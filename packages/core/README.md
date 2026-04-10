# @vuerend/core

Zero JavaScript-first Vue runtime and Vite v8 plugin for MPAs with SSR, SSG, explicit routes, secure islands, and opt-in runtime caching.

## Goals

- Vite v8 with the Environment API instead of a client router or filesystem routing
- Zero JavaScript-first rendering for MPA-style apps
- `srvx`-first runtime so the same fetch handler can target Node, Deno, Bun, Cloudflare Workers, dynamic workers, Vercel/Netlify edge-style runtimes, and service workers
- Server-rendered documents by default, with explicit component-level island boundaries
- SSR and SSG as the primary rendering modes, with ISR and revalidation when freshness needs it
- Vue SFC and JSX support out of the box

## Install

```bash
pnpm install
```

For Nix-based setups, a small `flake.nix` is included so `nodejs_24` and `pnpm` are available in the dev shell.

## Commands

```bash
vp check
vp test
vp pack
```

## Quick Start

```ts
// vite.config.ts
import { defineConfig } from "vite";
import { vuerend } from "@vuerend/core/vite";

export default defineConfig({
  plugins: [
    vuerend({
      app: "./src/app.ts",
      islands: "./src/islands.ts",
    }),
  ],
});
```

The `islands` option is optional. Leave it out when the app is pure server components and should return no client JavaScript.

```ts
// src/app.ts
import HomeRoute from "./routes/HomeRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomeRoute,
      render: { strategy: "ssg" },
    }),
  ],
});
```

```ts
// src/islands.ts
import CounterIslandView from "./islands/CounterIslandView";
import { defineIsland, defineIslands } from "@vuerend/core";

export const CounterIsland = defineIsland("counter", {
  component: CounterIslandView,
  load: () => import("./islands/CounterIslandView.loader"),
  hydrate: "visible",
});

export default defineIslands([CounterIsland]);
```

## Rendering Model

- Zero JavaScript is the starting point. Regular Vue components are server components by default and ship no browser JavaScript.
- Route components stay server-only. Render `defineIsland()` components inside them when a narrow client boundary is needed.
- `defineIsland()` marks an explicit boundary and emits a small JSON payload plus a targeted hydration root.
- `ssr: false` creates a client-only island.
- Island props must be plain JSON, and slots are intentionally rejected to keep the serialization surface small and predictable.

## Routing

- Routing is explicit with `defineRoute()`.
- No filesystem router is required.
- No client router is included.
- The navigation model is ordinary MPA links and documents.
- Route params come from the server request path, and pages can resolve props with `getProps(context)`.

## Document Head

- `defineApp({ document })` sets app-wide defaults for titles, meta tags, and shared assets.
- `defineRoute({ head })` accepts either a static object or a function when the head depends on the request or resolved props.
- Use `meta` for SEO and Open Graph tags, and `stylesheets` for shared CSS files you want injected as `<link rel="stylesheet">`.

```ts
import HomeRoute from "./routes/HomeRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  document: {
    title: "Example",
    titleTemplate: "%s | Vuerend",
    meta: [{ name: "description", content: "Shared site description" }],
    stylesheets: ["/styles/site.css"],
  },
  routes: [
    defineRoute({
      path: "/",
      component: HomeRoute,
      head: {
        title: "Home",
        meta: [
          { property: "og:title", content: "Home" },
          { property: "og:type", content: "website" },
        ],
        stylesheets: ["/styles/home.css"],
      },
    }),
  ],
});
```

## Dynamic OG Images

- Use `defineImageRoute()` when a route should return an image instead of an HTML document.
- The image route component is still a normal server-side Vue component, so Vue SFC templates work well for OG cards.
- `createRequestHandler()` needs an `imageRenderer` implementation. `@vuerend/node` ships `createChromiumImageRenderer()` for Playwright + Chromium.

```ts
import HomeRoute from "./routes/HomeRoute";
import OgCardRoute from "./routes/OgCardRoute.vue";
import {
  defineApp,
  defineImageRoute,
  defineRequestHandlerOptions,
  defineRoute,
} from "@vuerend/core";
import { createChromiumImageRenderer } from "@vuerend/node";

export const requestHandlerOptions = defineRequestHandlerOptions(() => ({
  imageRenderer: createChromiumImageRenderer(),
}));

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomeRoute,
      head(context) {
        const ogImageUrl = new URL("/og/home.png", context.url).href;

        return {
          meta: [{ property: "og:image", content: ogImageUrl }],
        };
      },
    }),
    defineImageRoute({
      path: "/og/home.png",
      component: OgCardRoute,
      getProps() {
        return {
          title: "Dynamic OG",
        };
      },
      head: {
        stylesheets: ["/styles/og.css"],
      },
      image: {
        width: 1200,
        height: 630,
        format: "png",
      },
    }),
  ],
});
```

Install Playwright in the app that renders the image routes:

```bash
pnpm add -D playwright
pnpm exec playwright install chromium
```

## Middleware

- `defineApp({ middleware })` runs fetch-style middleware before route matching and rendering.
- Middleware can short-circuit requests, rewrite the request passed to `next()`, or decorate the response after `await next()`.
- Use `context.state` to share request-scoped data with `getProps()`, `head()`, and other route hooks.

```ts
import HomeRoute from "./routes/HomeRoute";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  middleware: [
    async (request, context, next) => {
      context.state.requestPath = new URL(request.url).pathname;
      const response = await next();
      response.headers.set("x-powered-by", "vuerend");
      return response;
    },
  ],
  routes: [
    defineRoute({
      path: "/",
      component: HomeRoute,
      getProps(context) {
        return {
          requestPath: String(context.state.requestPath ?? "/"),
        };
      },
    }),
  ],
});
```

## Client State

- `useClientState()` is for hydrated islands that need shared browser state in an MPA.
- The default storage is `sessionStorage`, so state survives full page navigations within the same tab while keeping SSR request-local.
- Import it from `@vuerend/core/client` inside interactive islands only. Server-only routes still ship no browser JavaScript.

```ts
import { defineComponent } from "vue";
import { useClientState } from "@vuerend/core/client";

export default defineComponent({
  name: "ReadingListIsland",
  setup() {
    const count = useClientState("reading-list", 0);

    return () => (
      <button type="button" onClick={() => (count.value += 1)}>
        saved books: {count.value}
      </button>
    );
  },
});
```

## Rendering Strategies

- `ssr`: render on demand
- `ssg`: render at build time and include the route in prerender output
- `isr`: cache rendered HTML and revalidate based on `revalidate`
- Runtime cache is opt-in. Use `render.cache: true` when you want HTML caching.

```ts
defineRoute({
  path: "/about",
  component: AboutPage,
  render: {
    cache: true,
    strategy: "isr",
    revalidate: 60,
  },
});
```

## Runtime Targets

- `createRequestHandler()` returns a fetch-compatible handler.
- Use `@vuerend/node`, `@vuerend/bun`, `@vuerend/deno`, `@vuerend/cloudflare`, and `@vuerend/service-worker` for thin runtime adapters.
- The server build outputs a fetch handler in `dist/server/index.js` and prerendered/static assets in `dist/client`.

## Examples

- The example suite uses a shared layout: `src/app.ts`, `src/data/*`, `src/routes/*`, and optional `src/islands/*`.
- Start with `../../examples/README.md` if you want the scenario-first index and reading order.
- `../../examples/explicit-routes`: handbook / docs hub with explicit routes, SSG pages, and social cards
- `../../examples/secure-islands`: launch site with targeted hydration and client-only signup
- `../../examples/isr-cache`: release-notes site with ISR landing page and prerendered entries
- `../../examples/node-srvx`: internal-tool Node entry powered by `srvx/node`
- `../../examples/cloudflare-worker`: edge-delivered status board on Cloudflare Workers
- `../../examples/mixed-sfc-jsx`: buying-guide MPA mixing Vue SFC pages and JSX islands
- `../../examples/social-cards`: dynamic OG image workflow authored as Vue SFCs
