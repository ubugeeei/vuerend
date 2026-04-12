import { renderToString } from "@vue/server-renderer";
import { createSSRApp } from "vue";
import { renderDocument, renderImageDocument } from "./document.js";
import { createIslandRenderState, createRenderRoot, getIslandDefinition } from "./islands.js";
import { resolveVuerendVaporOptions } from "./vapor-options.js";
import { installVaporInterop } from "./vapor.js";
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

interface ResolvedRouteOutput {
  body: string;
  head: RouteHead | undefined;
  props: unknown;
  status: number;
  islands: RenderedIsland[];
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
  const rendered = await resolveRouteOutput(route, routeContext, options);
  const html = renderDocument({
    appDocument: app.document,
    body: rendered.body,
    head: rendered.head,
    islandsRendered: rendered.islands.length > 0,
    assets: options.assets,
  });

  return {
    html,
    props: rendered.props,
    response: new Response(html, {
      status: rendered.status,
      headers: createHtmlHeaders(rendered.head, rendered.islands),
    }),
  };
}

/**
 * Renders a matched image route into a binary image response.
 *
 * The Vue route component is first server-rendered to HTML, then handed to the
 * configured `imageRenderer` for Chromium-based capture.
 */
export async function renderImageRouteResponse(
  app: VuerendApp,
  route: AnyRouteDefinition,
  routeContext: RouteContext,
  options: CreateRequestHandlerOptions,
): Promise<RenderedRouteResponse> {
  if (!route.image) {
    throw new TypeError(`Route "${route.path}" is not configured as an image route.`);
  }

  if (!options.imageRenderer) {
    throw new TypeError(
      `Route "${route.path}" requires an imageRenderer. Pass one to createRequestHandler().`,
    );
  }

  const rendered = await resolveRouteOutput(route, routeContext, options);
  const width = route.image.width ?? 1200;
  const height = route.image.height ?? 630;
  const format = route.image.format ?? "png";
  const html = renderImageDocument({
    appDocument: app.document,
    body: rendered.body,
    head: rendered.head,
    width,
    height,
    baseUrl: routeContext.url,
  });
  const image = await options.imageRenderer.render({
    html,
    url: routeContext.url,
    width,
    height,
    format,
    quality: route.image.quality,
  });
  const contentType = image.contentType ?? defaultImageContentType(format);

  return {
    html,
    props: rendered.props,
    response: new Response(image.body, {
      status: rendered.status,
      headers: createImageHeaders(rendered.head, contentType, width, height),
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
    state: context.state ?? {},
    waitUntil: (promise) => {
      context.waitUntil?.(promise);
    },
    platform: context.platform,
    env: context.env,
  };
}

async function resolveRouteOutput(
  route: AnyRouteDefinition,
  routeContext: RouteContext,
  options: CreateRequestHandlerOptions,
): Promise<ResolvedRouteOutput> {
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

  if (resolveVuerendVaporOptions(options.vapor)) {
    installVaporInterop(vueApp);
  }

  const body = await renderToString(vueApp);
  const head = route.head
    ? typeof route.head === "function"
      ? await route.head(routeContext, props)
      : route.head
    : undefined;
  const status = route.status
    ? typeof route.status === "function"
      ? await route.status(routeContext, props)
      : route.status
    : 200;

  return {
    body,
    head,
    props,
    status,
    islands: state.islands,
  };
}

function createHtmlHeaders(
  head: RouteHead | undefined,
  islands: readonly RenderedIsland[],
): Headers {
  const headers = new Headers();
  headers.set("content-type", "text/html; charset=utf-8");

  if (head?.title) {
    headers.set("x-vuerend-title", createHeaderSafeText(head.title));
  }

  if (islands.length > 0) {
    headers.set("x-vuerend-islands", String(islands.length));
  }

  return headers;
}

function createImageHeaders(
  head: RouteHead | undefined,
  contentType: string,
  width: number,
  height: number,
): Headers {
  const headers = new Headers();
  headers.set("content-type", contentType);
  headers.set("x-vuerend-image-size", `${width}x${height}`);

  if (head?.title) {
    headers.set("x-vuerend-title", createHeaderSafeText(head.title));
  }

  return headers;
}

function createHeaderSafeText(value: string): string {
  return encodeURIComponent(value);
}

function defaultImageContentType(format: "png" | "jpeg"): string {
  return format === "jpeg" ? "image/jpeg" : "image/png";
}
