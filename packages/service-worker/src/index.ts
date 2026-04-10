import { serve } from "srvx/service-worker";
import type { VuerendRequestHandler } from "@vuerend/core";

/**
 * Creates a service worker binding for a Vuerend request handler.
 *
 * This adapter is useful when the runtime exposes the standard service worker
 * fetch event model. It installs the provided Vuerend `handler` into
 * `srvx/service-worker` so that request routing, middleware, and rendering stay
 * identical to other Vuerend runtimes.
 *
 * Pass any `srvx/service-worker` options through `options`, except for
 * `fetch`. The fetch callback is always supplied by the Vuerend handler.
 *
 * # Examples
 *
 * ```ts
 * import { createRequestHandler } from "@vuerend/core";
 * import { serveServiceWorker } from "@vuerend/service-worker";
 *
 * const handler = createRequestHandler({ app });
 *
 * serveServiceWorker(handler);
 * ```
 *
 * # Returns
 *
 * Returns the service-worker-compatible server wrapper created by
 * `srvx/service-worker`.
 */
export function serveServiceWorker(
  handler: VuerendRequestHandler,
  options: Omit<Parameters<typeof serve>[0], "fetch"> = {},
): ReturnType<typeof serve> {
  return serve({
    ...options,
    fetch: handler,
  });
}
