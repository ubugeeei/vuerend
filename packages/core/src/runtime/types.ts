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
  waitUntil(this: void, promise: Promise<unknown>): void;
  platform?: unknown;
  env?: unknown;
}

/** Document fragments and metadata contributed by a route. */
export interface RouteHead {
  title?: string;
  lang?: string;
  meta?: Array<Record<string, string>>;
  links?: Array<Record<string, string>>;
  scripts?: Array<Record<string, string> & { children?: string }>;
  htmlAttrs?: Record<string, string>;
  bodyAttrs?: Record<string, string>;
}

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
  head?: (context: RouteContext<Path>, props: Props) => Awaitable<RouteHead | undefined>;
  render?: RouteRenderOptions<Props, Path>;
  prerender?: string[] | ((baseUrl: URL) => Awaitable<string[]>);
  status?: number | ((context: RouteContext<Path>, props: Props) => Awaitable<number>);
}

/** A route definition with its prop type erased. */
export type AnyRouteDefinition = RouteDefinition<string, Component, any>;

/** Shared document defaults applied to every rendered page. */
export interface DocumentConfig extends RouteHead {
  titleTemplate?: string | ((title: string | undefined) => string);
  head?: string;
  bodyOpen?: string;
  bodyClose?: string;
}

/** The full application description consumed by the runtime and build plugin. */
export interface VuerendApp<
  Routes extends readonly AnyRouteDefinition[] = readonly AnyRouteDefinition[],
> {
  routes: Routes;
  document?: DocumentConfig;
}

/**
 * Declares how an island is loaded and rendered.
 *
 * Islands keep the client boundary explicit and narrow.
 */
export type LoadedIslandModule<TComponent extends Component> = TComponent | { default: TComponent };

export interface DefineIslandOptions<TComponent extends Component = Component> {
  component: TComponent;
  load: () => Promise<LoadedIslandModule<TComponent>>;
  hydrate?: HydrationStrategy;
  media?: string | undefined;
  ssr?: boolean;
}

/** Normalized island metadata attached to a defined island component. */
export interface IslandDefinition<TComponent extends Component = Component> {
  id: string;
  component: TComponent;
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
}

/** Extra runtime data supplied by adapters while handling a request. */
export interface RequestHandlerContext {
  waitUntil?(this: void, promise: Promise<unknown>): void;
  platform?: unknown;
  env?: unknown;
}

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
