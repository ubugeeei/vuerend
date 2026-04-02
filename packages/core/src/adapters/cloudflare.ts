import { serve } from "srvx/cloudflare";
import type { VueServerRequestHandler } from "../runtime/types.js";

/** Mounts a Vue Server request handler on the `srvx/cloudflare` runtime. */
export function serveCloudflare(
  handler: VueServerRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
