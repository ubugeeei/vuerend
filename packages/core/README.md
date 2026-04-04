# @vuerend/core

Lightweight Vue server renderer and Vite v8 plugin built around explicit routes, zero-JS-by-default rendering, explicit secure islands, and opt-in runtime caching.

## Goals

- Vite v8 with the Environment API instead of a client router or filesystem routing
- `srvx`-first runtime so the same fetch handler can target Node, Deno, Bun, Cloudflare Workers, dynamic workers, Vercel/Netlify edge-style runtimes, and service workers
- Server-first rendering by default, with explicit component-level island boundaries
- SSR, SSG, ISR, opt-in cache invalidation, and prerender collection without pulling in Vue Router
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
import HomePage from "./pages/HomePage";
import { defineApp, defineRoute } from "@vuerend/core";

export default defineApp({
  routes: [
    defineRoute({
      path: "/",
      component: HomePage,
      render: { strategy: "ssg" },
    }),
  ],
});
```

```ts
// src/islands.ts
import CounterView from "./components/CounterView";
import { defineIsland, defineIslands } from "@vuerend/core";

export const CounterIsland = defineIsland("counter", {
  component: CounterView,
  load: () => import("./components/CounterView"),
  hydrate: "visible",
});

export default defineIslands([CounterIsland]);
```

## Rendering Model

- Regular Vue components are server components by default and ship no browser JavaScript.
- Route components stay server-only. Render `defineIsland()` components inside them when a narrow client boundary is needed.
- `defineIsland()` marks an explicit boundary and emits a small JSON payload plus a targeted hydration root.
- `ssr: false` creates a client-only island.
- Island props must be plain JSON, and slots are intentionally rejected to keep the serialization surface small and predictable.

## Routing

- Routing is explicit with `defineRoute()`.
- No filesystem router is required.
- No client router is included.
- Route params come from the server request path, and pages can resolve props with `getProps(context)`.

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

- `../../examples/explicit-routes`: minimal explicit-routing app
- `../../examples/secure-islands`: secure island boundaries and targeted hydration
- `../../examples/isr-cache`: opt-in cache, ISR, and prerendering
- `../../examples/node-srvx`: Node entry powered by `srvx/node`
- `../../examples/cloudflare-worker`: Cloudflare Worker fetch handler example
- `../../examples/mixed-sfc-jsx`: mixed Vue SFC and JSX app
