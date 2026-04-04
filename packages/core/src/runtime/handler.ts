import { createMemoryRenderCache } from "./cache.js";
import { compileRoutes, matchRoute, normalizePathname } from "./router.js";
import {
  createCacheEntry,
  isCacheableRequest,
  normalizeRenderOptions,
  resolveCacheKey,
  resolveTags,
  responseFromCache,
} from "./policy.js";
import { createRouteContext, renderRouteResponse } from "./render.js";
import type {
  AnyRouteDefinition,
  DocumentConfig,
  CreateRequestHandlerOptions,
  RequestHandlerContext,
  VuerendApp,
  VuerendRequestHandler,
} from "./types.js";

/**
 * Declares an application with explicit routes and optional document defaults.
 *
 * The returned object is consumed by both the runtime handler and the Vite plugin.
 */
export function defineApp<const Routes extends readonly AnyRouteDefinition[]>(app: {
  routes: Routes;
  document?: DocumentConfig;
}): VuerendApp<Routes> {
  return app;
}

/**
 * Creates a fetch-compatible request handler for a Vuerend application.
 *
 * The handler performs explicit route matching, server rendering, and optional
 * HTML caching when a route opts into it.
 */
export function createRequestHandler(
  options: CreateRequestHandlerOptions,
): VuerendRequestHandler {
  const routes = compileRoutes(options.app.routes);
  const cache = options.cache ?? createMemoryRenderCache();
  const pendingRevalidations = new Map<string, Promise<Response>>();

  const handle = async (
    request: Request,
    context: RequestHandlerContext = {},
  ): Promise<Response> => {
    const url = new URL(request.url);
    const matched = matchRoute(routes, url.pathname);

    if (!matched) {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "content-type": "text/plain; charset=utf-8",
        },
      });
    }

    const routeContext = createRouteContext(request, url, matched.params, context);
    const renderOptions = normalizeRenderOptions(matched.definition.render);
    const cacheKey = await resolveCacheKey(matched.definition, routeContext);

    if (!isCacheableRequest(request, renderOptions)) {
      const rendered = await renderRouteResponse(
        options.app,
        matched.definition,
        routeContext,
        options,
      );
      return rendered.response;
    }

    const cached = await cache.get(cacheKey);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      return responseFromCache(cached, "HIT");
    }

    if (cached && cached.staleUntil > now) {
      primeBackgroundRefresh(
        cacheKey,
        pendingRevalidations,
        (promise) => routeContext.waitUntil(promise),
        async () => {
          const fresh = await renderRouteResponse(
            options.app,
            matched.definition,
            routeContext,
            options,
          );
          const tags = await resolveTags(renderOptions, routeContext, fresh.props);
          await cache.set(
            cacheKey,
            createCacheEntry(fresh.html, fresh.response, tags, renderOptions),
          );
          return fresh.response;
        },
      );

      return responseFromCache(cached, "STALE");
    }

    const pending = pendingRevalidations.get(cacheKey);

    if (pending) {
      return pending;
    }

    const rendered = renderRouteResponse(options.app, matched.definition, routeContext, options)
      .then(async (fresh) => {
        const tags = await resolveTags(renderOptions, routeContext, fresh.props);
        await cache.set(
          cacheKey,
          createCacheEntry(fresh.html, fresh.response, tags, renderOptions),
        );
        return fresh.response;
      })
      .finally(() => {
        pendingRevalidations.delete(cacheKey);
      });

    pendingRevalidations.set(cacheKey, rendered);
    return rendered;
  };

  return Object.assign(handle, {
    cache,
    async listPrerenderRoutes() {
      return collectPrerenderRoutes(options.app);
    },
    async revalidatePath(path: string) {
      await cache.revalidatePath(normalizePathname(path));
    },
    async revalidateTag(tag: string) {
      await cache.revalidateTag(tag);
    },
  });
}

/**
 * Collects the paths that should be prerendered at build time.
 *
 * SSG routes contribute their own path, and dynamic routes may return an
 * explicit `prerender` list.
 */
export async function collectPrerenderRoutes(app: VuerendApp): Promise<string[]> {
  const baseUrl = new URL("https://vuerend.local/");
  const routes: string[] = [];

  for (const route of app.routes) {
    const render = normalizeRenderOptions(route.render);

    if (render.strategy !== "ssg" && !route.prerender) {
      continue;
    }

    if (!route.prerender) {
      routes.push(normalizePathname(route.path));
      continue;
    }

    const entries =
      typeof route.prerender === "function" ? await route.prerender(baseUrl) : route.prerender;

    for (const entry of entries) {
      routes.push(normalizePathname(entry));
    }
  }

  return [...new Set(routes)];
}

function primeBackgroundRefresh(
  cacheKey: string,
  pendingRevalidations: Map<string, Promise<Response>>,
  waitUntil: (promise: Promise<unknown>) => void,
  render: () => Promise<Response>,
): void {
  if (pendingRevalidations.has(cacheKey)) {
    return;
  }

  const refresh = render().finally(() => {
    pendingRevalidations.delete(cacheKey);
  });

  pendingRevalidations.set(cacheKey, refresh);
  waitUntil(refresh);
}
