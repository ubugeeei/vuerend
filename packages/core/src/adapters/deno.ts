import { serve } from "srvx/deno";
import type { VuerendRequestHandler } from "../runtime/types.js";

/** Mounts a Vuerend request handler on the `srvx/deno` runtime. */
export function serveDeno(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
