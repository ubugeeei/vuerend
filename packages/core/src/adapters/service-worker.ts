import { serve } from "srvx/service-worker";
import type { VueServerRequestHandler } from "../runtime/types.js";

/** Mounts a Vue Server request handler on the `srvx/service-worker` runtime. */
export function serveServiceWorker(
  handler: VueServerRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
