import { serve } from "srvx/service-worker";
import type { VuerendRequestHandler } from "../runtime/types.js";

/** Mounts a Vuerend request handler on the `srvx/service-worker` runtime. */
export function serveServiceWorker(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
