import {
  Fragment,
  defineComponent,
  h,
  inject,
  mergeProps,
  provide,
  type Component,
  type InjectionKey,
  type Slots,
} from "vue";
import type {
  AnyDefinedIsland,
  DefineIslandOptions,
  DefinedIsland,
  IslandDefinition,
  JsonObject,
  JsonValue,
  RenderedIsland,
  SerializableComponentProps,
} from "./types.js";

const RENDER_STATE_KEY: InjectionKey<IslandRenderState> = Symbol("vuerend:render-state");

/**
 * Marks a component as an explicit island boundary.
 *
 * Island props must remain JSON-serializable, and slots are rejected on purpose.
 */
export function defineIsland<
  Props extends JsonObject,
  const Id extends string = string,
  TComponent extends Component = Component,
>(id: Id, options: DefineIslandOptions<TComponent>): DefinedIsland<Props, TComponent>;
export function defineIsland<
  const Id extends string,
  TComponent extends Component,
  Props extends JsonObject = SerializableComponentProps<TComponent>,
>(id: Id, options: DefineIslandOptions<TComponent>): DefinedIsland<Props, TComponent>;
export function defineIsland(
  id: string,
  options: DefineIslandOptions<Component>,
): AnyDefinedIsland {
  const definition: IslandDefinition<Component> = Object.freeze({
    id,
    component: options.component,
    load: options.load,
    hydrate: options.hydrate ?? "load",
    media: options.media,
    ssr: options.ssr ?? true,
  });

  const island = defineComponent({
    name: `VuerendIsland(${id})`,
    inheritAttrs: false,
    setup(props, { attrs, slots }) {
      return () => {
        assertNoSlots(slots, id);

        const collector = inject(RENDER_STATE_KEY, null);

        if (!collector) {
          if (!definition.ssr) {
            return null;
          }

          return h(definition.component as never, mergeProps(props, attrs));
        }

        const serializedProps = serializeIslandProps(mergeProps(props, attrs));
        const islandRecord = collector.register(definition, serializedProps);
        const hostAttributes: Record<string, string> = {
          "data-vs-island": islandRecord.instanceId,
          "data-vs-component": definition.id,
          "data-vs-hydrate": definition.hydrate,
        };

        if (definition.media) {
          hostAttributes["data-vs-media"] = definition.media;
        }

        const host = definition.ssr
          ? h("div", hostAttributes, [h(definition.component as never, mergeProps(props, attrs))])
          : h("div", hostAttributes);
        const payload = h(
          "script",
          {
            type: "application/json",
            "data-vs-island-props": islandRecord.instanceId,
          },
          escapeScriptJson(JSON.stringify(serializedProps)),
        );

        return h(Fragment, [host, payload]);
      };
    },
  }) as unknown as AnyDefinedIsland;

  island.__vuerendIsland = definition;
  return island;
}

/** Groups islands into a stable registry for the client hydration entry. */
export function defineIslands<const Islands extends readonly AnyDefinedIsland[]>(
  islands: Islands,
): Islands {
  return islands;
}

/** Returns the island metadata attached by `defineIsland()`. */
export function getIslandDefinition<TComponent extends Component = Component>(
  island: unknown,
): IslandDefinition<TComponent> | undefined {
  return (island as AnyDefinedIsland | undefined)?.__vuerendIsland as
    | IslandDefinition<TComponent>
    | undefined;
}

/** Mutable state used to collect rendered islands during SSR. */
export interface IslandRenderState {
  islands: RenderedIsland[];
  register(definition: IslandDefinition, props: JsonObject): RenderedIsland;
}

/** Creates the per-render collector used to record island instances. */
export function createIslandRenderState(): IslandRenderState {
  const islands: RenderedIsland[] = [];
  let counter = 0;

  return {
    islands,
    register(definition, props) {
      const rendered: RenderedIsland = {
        instanceId: `${definition.id}:${counter++}`,
        id: definition.id,
        props,
        hydrate: definition.hydrate,
        media: definition.media,
        ssr: definition.ssr,
      };

      islands.push(rendered);
      return rendered;
    },
  };
}

/** Wraps a route component in a provider that exposes the island render state. */
export function createRenderRoot(
  component: unknown,
  props: unknown,
  state: IslandRenderState,
): ReturnType<typeof defineComponent> {
  return defineComponent({
    name: "VuerendRoot",
    setup() {
      provide(RENDER_STATE_KEY, state);
      return () => h(component as never, props as never);
    },
  });
}

/**
 * Serializes island props into plain JSON.
 *
 * Non-plain objects, functions, symbols, and slots are rejected to keep the
 * browser boundary explicit and predictable.
 */
export function serializeIslandProps(value: unknown): JsonObject {
  const serialized = toJsonValue(value, "props");

  if (!isPlainObject(serialized)) {
    throw new TypeError("Island props must serialize to a plain JSON object.");
  }

  return serialized;
}

function assertNoSlots(slots: Slots, islandId: string): void {
  if (Object.keys(slots).length > 0) {
    throw new TypeError(
      `Island "${islandId}" cannot receive slots. Pass JSON-serializable props instead.`,
    );
  }
}

function toJsonValue(value: unknown, path: string): JsonValue {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) => toJsonValue(entry, `${path}[${index}]`));
  }

  if (typeof value === "object" && value) {
    if (!isPlainObject(value)) {
      throw new TypeError(
        `Unsupported island prop at ${path}. Only plain JSON values are allowed.`,
      );
    }

    const result: JsonObject = {};

    for (const [key, entry] of Object.entries(value)) {
      result[key] = toJsonValue(entry, `${path}.${key}`);
    }

    return result;
  }

  throw new TypeError(`Unsupported island prop at ${path}.`);
}

function isPlainObject(value: unknown): value is JsonObject {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function escapeScriptJson(value: string): string {
  return value
    .replaceAll("<", "\\u003c")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
