import { createVaporSSRApp, vaporInteropPlugin } from "@vue/runtime-vapor";
import { createSSRApp } from "vue";
import type { Component } from "vue";
import type { JsonObject, ResolvedVuerendVaporOptions } from "../runtime/types.js";
import type { IslandClientApp } from "./hydrate-core.js";

interface IslandClientAppWithUse extends IslandClientApp {
  use(plugin: unknown): this;
}

type VaporRootComponent = Parameters<typeof createVaporSSRApp>[0];

export function createVaporInteropIslandApp(
  component: Component,
  props: JsonObject,
  options: ResolvedVuerendVaporOptions,
): IslandClientApp {
  const app =
    options.mode === "interop"
      ? createSSRApp(component, props)
      : createVaporSSRApp(component as VaporRootComponent, props);

  return installVaporInterop(app as IslandClientAppWithUse);
}

function installVaporInterop(app: IslandClientAppWithUse): IslandClientAppWithUse {
  if (!vaporInteropPlugin) {
    throw new TypeError("Vuerend vapor interop requires Vue 3.6+ with vaporInteropPlugin.");
  }

  return app.use(vaporInteropPlugin);
}
