import type { ResolvedVuerendVaporOptions, VuerendVaporOptions } from "./types.js";

export function resolveVuerendVaporOptions(
  options: VuerendVaporOptions | undefined,
): ResolvedVuerendVaporOptions | undefined {
  if (!options) {
    return undefined;
  }

  if (options === true) {
    return {
      mode: "islands",
      interop: false,
    };
  }

  if (typeof options === "string") {
    return {
      mode: options,
      interop: options === "interop",
    };
  }

  return {
    mode: options.mode ?? "islands",
    interop: options.interop ?? options.mode === "interop",
  };
}
