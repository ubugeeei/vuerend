import { serve } from "srvx/cloudflare";
import type { VuerendRequestHandler } from "@vuerend/core";

/**
 * Creates a Cloudflare Worker binding for a Vuerend request handler.
 *
 * Use this adapter when deploying the application on Cloudflare Workers. The
 * returned value is the `srvx/cloudflare` server wrapper, configured so that
 * every incoming request is handled by the supplied Vuerend fetch handler.
 *
 * Pass any `srvx/cloudflare` options through `options`, except for `fetch`.
 * The worker's `fetch` implementation is always taken from `handler`.
 *
 * # Examples
 *
 * ```ts
 * import { createRequestHandler } from "@vuerend/core";
 * import { serveCloudflare } from "@vuerend/cloudflare";
 *
 * const handler = createRequestHandler({ app });
 *
 * export default serveCloudflare(handler);
 * ```
 *
 * # Returns
 *
 * Returns the Cloudflare-compatible server wrapper produced by
 * `srvx/cloudflare`.
 */
export function serveCloudflare(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
