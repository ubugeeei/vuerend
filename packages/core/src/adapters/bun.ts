import { serve } from "srvx/bun";
import type { VueServerRequestHandler } from "../runtime/types.js";

/** Mounts a Vue Server request handler on the `srvx/bun` server runtime. */
export function serveBun(
  handler: VueServerRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
