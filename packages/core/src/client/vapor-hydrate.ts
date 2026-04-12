import * as Vue from "vue";
import type { Component } from "vue";
import type {
  AnyDefinedIsland,
  JsonObject,
  ResolvedVuerendVaporOptions,
  VuerendVaporOptions,
} from "../runtime/types.js";
import { resolveVuerendVaporOptions } from "../runtime/vapor-options.js";
import {
  hydrateIslandsWith,
  type CreateIslandClientApp,
  type IslandClientApp,
} from "./hydrate-core.js";

interface VueVaporRuntime {
  createSSRApp(component: Component, props: JsonObject): IslandClientAppWithUse;
  createVaporSSRApp?: (component: Component, props: JsonObject) => IslandClientAppWithUse;
  vaporInteropPlugin?: unknown;
}

interface IslandClientAppWithUse extends IslandClientApp {
  use(plugin: unknown): this;
}

/**
 * Hydrates islands through Vue Vapor runtime APIs.
 *
 * This entry is generated only when the Vuerend Vite plugin receives
 * `vapor: true` or a `vapor` options object.
 */
export async function hydrateVaporIslands(
  islands: readonly AnyDefinedIsland[],
  options?: VuerendVaporOptions,
): Promise<void> {
  const vapor = resolveVuerendVaporOptions(options) ?? {
    mode: "islands",
    interop: false,
  };

  return hydrateIslandsWith(islands, createVaporIslandApp(vapor));
}

function createVaporIslandApp(options: ResolvedVuerendVaporOptions): CreateIslandClientApp {
  const runtime = Vue as typeof Vue & VueVaporRuntime;

  if (options.mode === "interop") {
    return (component, props) => installVaporInterop(runtime.createSSRApp(component, props));
  }

  return (component, props) => {
    if (typeof runtime.createVaporSSRApp !== "function") {
      throw new TypeError("Vuerend vapor hydration requires Vue 3.6+ with createVaporSSRApp.");
    }

    const app = runtime.createVaporSSRApp(component, props);
    return options.interop ? installVaporInterop(app) : app;
  };
}

function installVaporInterop(app: IslandClientAppWithUse): IslandClientAppWithUse {
  const { vaporInteropPlugin } = Vue as typeof Vue & VueVaporRuntime;

  if (!vaporInteropPlugin) {
    throw new TypeError("Vuerend vapor interop requires Vue 3.6+ with vaporInteropPlugin.");
  }

  return app.use(vaporInteropPlugin);
}
