import { createSSRApp } from "vue";
import type { Component } from "vue";
import type { JsonObject } from "../runtime/types.js";
import type { IslandClientApp } from "./hydrate-core.js";

export function createVueIslandApp(component: Component, props: JsonObject): IslandClientApp {
  return createSSRApp(component, props);
}
