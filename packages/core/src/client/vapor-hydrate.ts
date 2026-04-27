import type {
  AnyDefinedIsland,
  ResolvedVuerendVaporOptions,
  VuerendVaporOptions,
} from "../runtime/types.js";
import { resolveVuerendVaporOptions } from "../runtime/vapor-options.js";
import { hydrateIslandsWith, type CreateIslandClientApp } from "./hydrate-core.js";

let vaporRuntimeModule: Promise<typeof import("./vapor-runtime.js")> | undefined;
let vaporInteropModule: Promise<typeof import("./vapor-interop.js")> | undefined;

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

  if (vapor.mode === "islands" && !vapor.interop) {
    return hydrateVaporRuntimeIslands(islands);
  }

  return hydrateIslandsWith(islands, createVaporIslandApp(vapor));
}

export async function hydrateVaporRuntimeIslands(
  islands: readonly AnyDefinedIsland[],
): Promise<void> {
  return hydrateIslandsWith(islands, createVaporRuntimeIslandApp());
}

function createVaporIslandApp(options: ResolvedVuerendVaporOptions): CreateIslandClientApp {
  if (options.mode === "interop" || options.interop) {
    return async (component, props) => {
      const { createVaporInteropIslandApp } = await loadVaporInterop();
      return createVaporInteropIslandApp(component, props, options);
    };
  }

  return async (component, props) => {
    const { createVaporRuntimeIslandApp } = await loadVaporRuntime();
    return createVaporRuntimeIslandApp(component, props);
  };
}

function createVaporRuntimeIslandApp(): CreateIslandClientApp {
  return async (component, props) => {
    const { createVaporRuntimeIslandApp: createRuntimeApp } = await loadVaporRuntime();
    return createRuntimeApp(component, props);
  };
}

function loadVaporRuntime(): Promise<typeof import("./vapor-runtime.js")> {
  vaporRuntimeModule ??= import("./vapor-runtime.js");
  return vaporRuntimeModule;
}

function loadVaporInterop(): Promise<typeof import("./vapor-interop.js")> {
  vaporInteropModule ??= import("./vapor-interop.js");
  return vaporInteropModule;
}
