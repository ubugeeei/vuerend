import { createVaporSSRApp } from "@vue/runtime-vapor";
import type { Component } from "vue";
import type { JsonObject } from "../runtime/types.js";
import type { IslandClientApp } from "./hydrate-core.js";

type VaporRootComponent = Parameters<typeof createVaporSSRApp>[0];

export function createVaporRuntimeIslandApp(
  component: Component,
  props: JsonObject,
): IslandClientApp {
  return createVaporSSRApp(component as VaporRootComponent, props);
}
