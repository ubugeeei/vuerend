import { serve } from "srvx/node";
import type { VueServerRequestHandler } from "../runtime/types.js";

/** Mounts a Vue Server request handler on the `srvx/node` server runtime. */
export function serveNode(
  handler: VueServerRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
