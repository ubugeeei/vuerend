import { serve } from "srvx/bun";
import type { VuerendRequestHandler } from "@vuerend/core";

/**
 * Starts a Bun server for a Vuerend request handler.
 *
 * Use this when the surrounding deployment model is Bun-native and you want to
 * expose a Vuerend application through `srvx/bun`. The function installs the
 * given `handler` as the runtime fetch entry and forwards all other options to
 * Bun's server adapter.
 *
 * Pass any `srvx/bun` options through `options`, except for `fetch`. The
 * `fetch` callback is always derived from the supplied Vuerend handler.
 *
 * # Examples
 *
 * ```ts
 * import { createRequestHandler } from "@vuerend/core";
 * import { serveBun } from "@vuerend/bun";
 *
 * const handler = createRequestHandler({ app });
 *
 * serveBun(handler, {
 *   port: 3_000,
 * });
 * ```
 *
 * # Returns
 *
 * Returns the server instance produced by `srvx/bun`.
 */
export function serveBun(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
