# Vue Server Monorepo

Vue Server is a server-first way to build Vue applications when you want MPA or static rendering to be the default, not an afterthought. Pages are regular server-rendered Vue components, client JavaScript is opt-in through explicit islands, and the same fetch handler can run on Node, Bun, Deno, Cloudflare Workers, or service workers.

## Why This Exists

- Many Vue stacks assume a client router, route-level hydration, and a large baseline JavaScript payload even for mostly static pages.
- Some teams want Vue as a rendering language for content sites, dashboards, documentation, storefronts, or internal tools without buying into an SPA-first architecture.
- Runtime portability is usually bolted on later. Vue Server starts from a fetch-compatible handler so the app model stays the same across runtimes.
- Interactivity still matters, but it should be narrow and intentional. Vue Server uses explicit islands so only the parts that need JavaScript hydrate.

## Mental Model

- Route components are server components by default.
- There is no filesystem router and no client router included.
- Add interactivity by rendering `defineIsland()` components inside a server-rendered page.
- Add caching only where it pays off with `ssg`, `ssr`, or `isr`.
- Keep browser-only behavior explicit by importing client utilities from `@vue-server/core/client`.

## Workspace Layout

- `packages/core`: the Vite plugin, runtime, islands implementation, middleware, document metadata, and client utilities
- `packages/node`: Node adapter powered by `srvx/node`
- `packages/bun`: Bun adapter
- `packages/deno`: Deno adapter
- `packages/cloudflare`: Cloudflare Worker adapter
- `packages/service-worker`: service worker adapter

## Example Tour

Read the examples in this order if you want the clearest picture of the project motivation.

| Example | What Question It Answers | What It Demonstrates |
| --- | --- | --- |
| `examples/explicit-routes` | What if I want Vue pages without a client router? | explicit route tables, server-only pages, shared metadata, shared CSS |
| `examples/secure-islands` | How do I keep a marketing page mostly static but still interactive where needed? | explicit islands, targeted hydration, client-only widgets, zero-JS pages living next to interactive ones |
| `examples/mixed-sfc-jsx` | Can a team mix SFC pages, JSX islands, and shared client state in an MPA? | SFC + JSX together, `useClientState()`, page-to-page shared browser state |
| `examples/isr-cache` | Where does caching fit when the app is server-first? | `isr`, prerendered routes, dynamic metadata, pages that regenerate without an SPA runtime |
| `examples/node-srvx` | How does this fit into a traditional Node server process? | middleware, request-scoped state, Node adapter entry |
| `examples/cloudflare-worker` | Can the same app model run at the edge? | Cloudflare Worker adapter, fetch-first deployment model, runtime portability |

## Commands

From the repo root, use `vp` for the packages:

```bash
vp check
vp test
vp pack
```

Run any example from its own directory:

```bash
cd examples/explicit-routes
pnpm exec vite dev
```

Examples alias the workspace source directly, so they always exercise the in-repo implementation.

## Where To Start

- Start with `examples/explicit-routes` if the main appeal is “Vue without an SPA shell.”
- Move to `examples/secure-islands` if the main appeal is “mostly static pages with tiny interactive pockets.”
- Open `examples/mixed-sfc-jsx` if the sticking point is “I still need client state for some islands across page loads.”
- Read `packages/core/README.md` when you want the API surface rather than the motivation.

## Documentation

The core package README lives at [packages/core/README.md](packages/core/README.md).
