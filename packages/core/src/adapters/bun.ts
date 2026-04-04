import { serve } from "srvx/bun";
import type { VuerendRequestHandler } from "../runtime/types.js";

/** Mounts a Vuerend request handler on the `srvx/bun` server runtime. */
export function serveBun(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
