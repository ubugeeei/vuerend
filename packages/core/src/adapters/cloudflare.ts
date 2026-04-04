import { serve } from "srvx/cloudflare";
import type { VuerendRequestHandler } from "../runtime/types.js";

/** Mounts a Vuerend request handler on the `srvx/cloudflare` runtime. */
export function serveCloudflare(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
