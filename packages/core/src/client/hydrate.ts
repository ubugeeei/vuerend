import type { AnyDefinedIsland } from "../runtime/types.js";
import { hydrateIslandsWith } from "./hydrate-core.js";

let runtimeModule: Promise<typeof import("./vue-runtime.js")> | undefined;

/**
 * Hydrates every island instance found in the current document.
 *
 * This function is intended to be called from the generated client entry.
 */
export async function hydrateIslands(islands: readonly AnyDefinedIsland[]): Promise<void> {
  return hydrateIslandsWith(islands, async (component, props) => {
    const { createVueIslandApp } = await loadVueRuntime();
    return createVueIslandApp(component, props);
  });
}

function loadVueRuntime(): Promise<typeof import("./vue-runtime.js")> {
  runtimeModule ??= import("./vue-runtime.js");
  return runtimeModule;
}
