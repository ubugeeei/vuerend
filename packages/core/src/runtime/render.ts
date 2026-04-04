import { renderToString } from "@vue/server-renderer";
import { createSSRApp } from "vue";
import { renderDocument } from "./document.js";
import { createIslandRenderState, createRenderRoot, getIslandDefinition } from "./islands.js";
import type {
  AnyRouteDefinition,
  CreateRequestHandlerOptions,
  RenderedIsland,
  RequestHandlerContext,
  RouteContext,
  RouteHead,
  VuerendApp,
} from "./types.js";

/** The result of rendering a single matched route. */
export interface RenderedRouteResponse {
  html: string;
  props: unknown;
  response: Response;
}

/**
 * Renders a matched route into HTML and an HTTP response.
 *
 * This is the core server-rendering step used by the request handler.
 */
export async function renderRouteResponse(
  app: VuerendApp,
  route: AnyRouteDefinition,
  routeContext: RouteContext,
  options: CreateRequestHandlerOptions,
): Promise<RenderedRouteResponse> {
  const island = getIslandDefinition(route.component);

  if (island) {
    throw new TypeError(
      `Route "${route.path}" cannot use island "${island.id}" as its page component.`,
    );
  }

  const props = route.getProps ? await route.getProps(routeContext) : {};
  const state = createIslandRenderState();
  const root = createRenderRoot(route.component, props, state);
  const vueApp = createSSRApp(root);
  const body = await renderToString(vueApp);
  const head = route.head ? await route.head(routeContext, props) : undefined;
  const html = renderDocument({
    appDocument: app.document,
    body,
    head,
    islandsRendered: state.islands.length > 0,
    assets: options.assets,
  });
  const status = route.status
    ? typeof route.status === "function"
      ? await route.status(routeContext, props)
      : route.status
    : 200;

  return {
    html,
    props,
    response: new Response(html, {
      status,
      headers: createHtmlHeaders(head, state.islands),
    }),
  };
}

/** Creates the request context object passed to route hooks. */
export function createRouteContext(
  request: Request,
  url: URL,
  params: Record<string, string>,
  context: RequestHandlerContext,
): RouteContext {
  return {
    request,
    url,
    params,
    query: url.searchParams,
    waitUntil: (promise) => {
      context.waitUntil?.(promise);
    },
    platform: context.platform,
    env: context.env,
  };
}

function createHtmlHeaders(
  head: RouteHead | undefined,
  islands: readonly RenderedIsland[],
): Headers {
  const headers = new Headers();
  headers.set("content-type", "text/html; charset=utf-8");

  if (head?.title) {
    headers.set("x-vuerend-title", head.title);
  }

  if (islands.length > 0) {
    headers.set("x-vuerend-islands", String(islands.length));
  }

  return headers;
}
