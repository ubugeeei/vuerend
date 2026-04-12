import { createSSRApp } from "vue";
import type { AnyDefinedIsland } from "../runtime/types.js";
import { hydrateIslandsWith } from "./hydrate-core.js";

/**
 * Hydrates every island instance found in the current document.
 *
 * This function is intended to be called from the generated client entry.
 */
export async function hydrateIslands(islands: readonly AnyDefinedIsland[]): Promise<void> {
  return hydrateIslandsWith(islands, (component, props) => createSSRApp(component, props));
}
