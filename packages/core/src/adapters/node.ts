import { serve } from "srvx/node";
import type { VuerendRequestHandler } from "../runtime/types.js";

/** Mounts a Vuerend request handler on the `srvx/node` server runtime. */
export function serveNode(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
