import type { AllowedComponentProps, Component, DefineComponent, VNodeProps } from "vue";

/** A value that may be available immediately or after awaiting a promise. */
export type Awaitable<T> = T | Promise<T>;

/** A JSON scalar accepted by island serialization. */
export type JsonPrimitive = string | number | boolean | null;

/** A JSON value accepted by island serialization. */
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

/** A plain JSON object accepted by island serialization. */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** Mutable request-scoped storage shared across middleware and route hooks. */
export type RequestState = Record<string, unknown>;

/** Attribute bag used by document head tags such as `meta` and `link`. */
export type HeadTagAttributes = Record<string, string | undefined>;

/** A rendered `<meta>` tag descriptor. */
export type HeadMeta = HeadTagAttributes;

/** A rendered `<link>` tag descriptor. */
export type HeadLink = HeadTagAttributes;

/** A rendered `<script>` tag descriptor. */
export type HeadScript = HeadTagAttributes & { children?: string };

/** Binary payload types accepted when returning a rendered image. */
export type BinaryBody = ArrayBuffer | ArrayBufferView;

type Simplify<T> = {
  [Key in keyof T]: T[Key];
} & {};

type StripVueBuiltins<Props> = Omit<Props, keyof VNodeProps | keyof AllowedComponentProps>;

type PathParamKey<Segment extends string> = Segment extends `:${infer Key}`
  ? Key
  : Segment extends "*"
    ? "wildcard"
    : never;

type PathParamKeys<Path extends string> = Path extends `${infer Head}/${infer Tail}`
  ? PathParamKey<Head> | PathParamKeys<Tail>
  : PathParamKey<Path>;

/** Controls when an island hydrates on the client. */
export type HydrationStrategy = "load" | "idle" | "visible" | "media";

/** The public prop type accepted by a Vue component. */
export type ComponentProps<TComponent extends Component> = TComponent extends new (
  ...args: any[]
) => { $props: infer Props }
  ? Simplify<StripVueBuiltins<Props>>
  : TComponent extends (props: infer Props, ...args: any[]) => any
    ? Simplify<StripVueBuiltins<Props>>
    : never;

/** The JSON-serializable prop shape required for island boundaries. */
export type SerializableComponentProps<TComponent extends Component> =
  ComponentProps<TComponent> extends JsonObject ? ComponentProps<TComponent> : never;

/** The decoded params available for a literal route path. */
export type RouteParams<Path extends string> = [PathParamKeys<Path>] extends [never]
  ? Record<never, never>
  : {
      [Key in PathParamKeys<Path>]: string;
    };

/**
 * Request-scoped data passed to route hooks.
 *
 * This context is created on the server for every matched route.
 */
export interface RouteContext<Path extends string = string> {
  request: Request;
  url: URL;
  params: RouteParams<Path>;
  query: URLSearchParams;
  state: RequestState;
  waitUntil(this: void, promise: Promise<unknown>): void;
  platform?: unknown;
  env?: unknown;
}

/** Document fragments and metadata contributed by a route. */
export interface RouteHead {
  title?: string;
  lang?: string;
  head?: string;
  meta?: HeadMeta[];
  links?: HeadLink[];
  stylesheets?: string[];
  scripts?: HeadScript[];
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
}

/** Resolves the document head for a route either statically or per request. */
export type RouteHeadResolver<Props = unknown, Path extends string = string> =
  | RouteHead
  | ((context: RouteContext<Path>, props: Props) => Awaitable<RouteHead | undefined>);

/**
 * Controls how a route is rendered and cached.
 *
 * Caching is always opt-in through `cache: true`.
 */
export interface RouteRenderOptions<Props = unknown, Path extends string = string> {
  cache?: boolean;
  strategy?: "ssr" | "ssg" | "isr";
  revalidate?: number;
  staleWhileRevalidate?: number;
  tags?: string[] | ((context: RouteContext<Path>, props: Props) => Awaitable<string[]>);
  cacheKey?: (context: RouteContext<Path>) => Awaitable<string>;
}

/** Output formats supported by image routes. */
export type RouteImageFormat = "png" | "jpeg";

/** Chromium-backed image rendering options for a route. */
export interface RouteImageOptions {
  width?: number;
  height?: number;
  format?: RouteImageFormat;
  quality?: number;
}

/** A regular Vue component that remains server-only unless wrapped in `defineIsland()`. */
export type ServerComponent<TComponent extends Component = Component> =
  TComponent extends AnyDefinedIsland ? never : TComponent;

/**
 * Describes a single explicit server route.
 *
 * Route components are server components by default. Embed explicit islands
 * inside them when a narrow client boundary is needed.
 */
export interface RouteDefinition<
  Path extends string = string,
  TComponent extends Component = Component,
  Props = ComponentProps<TComponent>,
> {
  path: Path;
  name?: string;
  component: ServerComponent<TComponent>;
  getProps?: (context: RouteContext<Path>) => Awaitable<Props>;
  head?: RouteHeadResolver<Props, Path>;
  image?: RouteImageOptions;
  render?: RouteRenderOptions<Props, Path>;
  prerender?: string[] | ((baseUrl: URL) => Awaitable<string[]>);
  status?: number | ((context: RouteContext<Path>, props: Props) => Awaitable<number>);
}

/** A route definition with its prop type erased. */
export type AnyRouteDefinition = RouteDefinition<string, Component, any>;

/** A route definition that renders a binary image instead of an HTML document. */
export type ImageRouteDefinition<
  Path extends string = string,
  TComponent extends Component = Component,
  Props = ComponentProps<TComponent>,
> = RouteDefinition<Path, TComponent, Props> & {
  image: RouteImageOptions;
};

/** Shared document defaults applied to every rendered page. */
export interface DocumentConfig extends RouteHead {
  titleTemplate?: string | ((title: string | undefined) => string);
  bodyOpen?: string;
  bodyClose?: string;
}

/** The full application description consumed by the runtime and build plugin. */
export interface VuerendApp<
  Routes extends readonly AnyRouteDefinition[] = readonly AnyRouteDefinition[],
> {
  routes: Routes;
  document?: DocumentConfig;
  middleware?: RequestMiddleware[];
}

/**
 * Declares how an island is loaded and rendered.
 *
 * Islands keep the client boundary explicit and narrow.
 */
export type LoadedIslandModule<TComponent extends Component> = TComponent | { default: TComponent };

export interface DefineIslandOptions<TComponent extends Component = Component> {
  component?: TComponent | undefined;
  load: () => Promise<LoadedIslandModule<TComponent>>;
  hydrate?: HydrationStrategy;
  media?: string | undefined;
  ssr?: boolean;
}

/** Normalized island metadata attached to a defined island component. */
export interface IslandDefinition<TComponent extends Component = Component> {
  id: string;
  component: Component;
  load: () => Promise<LoadedIslandModule<TComponent>>;
  hydrate: HydrationStrategy;
  media?: string | undefined;
  ssr: boolean;
}

/** A Vue component branded as a Vuerend island. */
export type DefinedIsland<
  Props extends JsonObject = JsonObject,
  TComponent extends Component = DefineComponent<Props>,
> = DefineComponent<Props> & {
  __vuerendIsland: IslandDefinition<TComponent> | undefined;
};

/** A defined island with its prop and component types erased. */
export type AnyDefinedIsland = Component & {
  __vuerendIsland: IslandDefinition | undefined;
};

/** An island instance collected during server rendering. */
export interface RenderedIsland<Props extends JsonObject = JsonObject> {
  instanceId: string;
  id: string;
  props: Props;
  hydrate: HydrationStrategy;
  media?: string | undefined;
  ssr: boolean;
}

/** Client asset URLs discovered from the Vite client build manifest. */
export interface ClientBuildAssets {
  entry?: string | undefined;
  css?: string[] | undefined;
  modulepreload?: string[] | undefined;
}

export type VuerendVaporMode = "islands" | "interop";

/** Options for using Vue 3.6 Vapor mode in client islands. */
export type VuerendVaporOptions =
  | boolean
  | VuerendVaporMode
  | {
      /**
       * `islands` hydrates each client island with `createVaporSSRApp`.
       * `interop` hydrates with `createSSRApp` and installs `vaporInteropPlugin`.
       */
      mode?: VuerendVaporMode | undefined;
      /** Install Vue's Vapor/VDOM interop plugin inside the Vapor island app. */
      interop?: boolean | undefined;
    };

export interface ResolvedVuerendVaporOptions {
  mode: VuerendVaporMode;
  interop: boolean;
}

/** Input passed to an HTML-to-image renderer. */
export interface HtmlImageRendererInput {
  html: string;
  url: URL;
  width: number;
  height: number;
  format: RouteImageFormat;
  quality?: number | undefined;
}

/** The binary result produced by an HTML-to-image renderer. */
export interface HtmlImageRenderResult {
  body: BinaryBody;
  contentType?: string | undefined;
}

/** Renders a complete HTML document into an image buffer. */
export interface HtmlImageRenderer {
  render(input: HtmlImageRendererInput): Awaitable<HtmlImageRenderResult>;
}

/** Cached HTML together with the metadata required to revalidate it later. */
export interface RenderCacheEntry {
  body: string;
  status: number;
  headers: [string, string][];
  createdAt: number;
  expiresAt: number;
  staleUntil: number;
  tags: string[];
}

/**
 * Storage backend used by the request handler for ISR and manual revalidation.
 *
 * Implementations may be process-local or distributed.
 */
export interface RenderCache {
  get(key: string): Awaitable<RenderCacheEntry | undefined>;
  set(key: string, value: RenderCacheEntry): Awaitable<void>;
  delete(key: string): Awaitable<void>;
  revalidatePath(path: string): Awaitable<void>;
  revalidateTag(tag: string): Awaitable<void>;
}

/** Options used to build a fetch-compatible Vuerend handler. */
export interface CreateRequestHandlerOptions {
  app: VuerendApp;
  assets?: ClientBuildAssets;
  cache?: RenderCache;
  imageRenderer?: HtmlImageRenderer | undefined;
  vapor?: VuerendVaporOptions | undefined;
}

/** Extra options supplied to `createRequestHandler()` outside the app definition. */
export type RequestHandlerRuntimeOptions = Omit<CreateRequestHandlerOptions, "app" | "assets">;

/** Context passed to a request-handler options resolver inside the Vite plugin. */
export interface RequestHandlerOptionsContext {
  assets: ClientBuildAssets;
}

/** Lazily resolves additional options for `createRequestHandler()`. */
export type RequestHandlerOptionsResolver = (
  context: RequestHandlerOptionsContext,
) => Awaitable<RequestHandlerRuntimeOptions>;

/** Extra runtime data supplied by adapters while handling a request. */
export interface RequestHandlerContext {
  state?: RequestState;
  waitUntil?(this: void, promise: Promise<unknown>): void;
  platform?: unknown;
  env?: unknown;
}

/** Request context visible inside middleware after normalization. */
export interface MiddlewareContext extends Omit<RequestHandlerContext, "state" | "waitUntil"> {
  state: RequestState;
  waitUntil(this: void, promise: Promise<unknown>): void;
}

/** Invokes the next middleware or the final route handler. */
export type RequestMiddlewareNext = (
  request?: Request,
  context?: RequestHandlerContext,
) => Promise<Response>;

/** Runs before route resolution and may short-circuit or decorate the response. */
export type RequestMiddleware = (
  request: Request,
  context: MiddlewareContext,
  next: RequestMiddlewareNext,
) => Awaitable<Response>;

/**
 * A fetch-compatible request handler produced by `createRequestHandler()`.
 *
 * The callable function is accompanied by cache and prerender helpers.
 */
export interface VuerendRequestHandler {
  (request: Request, context?: RequestHandlerContext): Promise<Response>;
  cache: RenderCache;
  listPrerenderRoutes(): Promise<string[]>;
  revalidatePath(path: string): Promise<void>;
  revalidateTag(tag: string): Promise<void>;
}
