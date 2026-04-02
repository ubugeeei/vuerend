import { serve } from "srvx/deno";
import type { VueServerRequestHandler } from "../runtime/types.js";

/** Mounts a Vue Server request handler on the `srvx/deno` runtime. */
export function serveDeno(
  handler: VueServerRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
