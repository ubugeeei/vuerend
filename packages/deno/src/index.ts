import { serve } from "srvx/deno";
import type { VuerendRequestHandler } from "@vuerend/core";

/**
 * Starts a Deno server for a Vuerend request handler.
 *
 * This adapter is intended for Deno-first deployments where the application is
 * already represented as a fetch-compatible Vuerend handler. It connects that
 * handler to `srvx/deno` without changing the request lifecycle you defined in
 * `createRequestHandler()`.
 *
 * Pass any `srvx/deno` options through `options`, except for `fetch`. The
 * adapter always uses the Vuerend handler for request dispatch.
 *
 * # Examples
 *
 * ```ts
 * import { createRequestHandler } from "@vuerend/core";
 * import { serveDeno } from "@vuerend/deno";
 *
 * const handler = createRequestHandler({ app });
 *
 * serveDeno(handler, {
 *   port: 8_000,
 * });
 * ```
 *
 * # Returns
 *
 * Returns the server instance produced by `srvx/deno`.
 */
export function serveDeno(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
