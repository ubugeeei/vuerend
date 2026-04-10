# Examples

The examples are organized by motivation first, but they now share the same clean-room structure so
you can move between them without relearning the layout.

## Quick Start

```bash
cd examples/explicit-routes
pnpm exec vite dev
```

## Shared Layout

- `README.md`: who the example is for and which routes it exposes
- `src/app.ts`: the app contract, route table, and runtime hooks
- `src/data/*`: scenario-specific content and constants
- `src/routes/*`: public document routes and image routes
- `src/islands/*`: optional client boundaries with explicit loaders
- `public/styles/*`: shared and route-specific CSS

## Example Index

| Directory           | Best For                                          | Why It Exists                                                                                                       |
| ------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `explicit-routes`   | handbooks, policy hubs, small docs sites          | Shows a Zero JavaScript-first MPA where explicit routes, metadata, and a Vue-authored social card all stay visible. |
| `secure-islands`    | launch sites, waitlists, campaign pages           | Shows how to keep the page static and hydrate only the estimator and signup flow.                                   |
| `mixed-sfc-jsx`     | buying guides, catalogs, editorial commerce pages | Shows SFC pages and JSX islands sharing a saved shortlist across full page loads.                                   |
| `isr-cache`         | release notes, changelogs, newsroom homepages     | Shows an ISR landing page next to fully prerendered long-tail entries.                                              |
| `node-srvx`         | internal tools and support desks on Node          | Shows middleware, request-scoped state, and a traditional Node process entry.                                       |
| `cloudflare-worker` | edge-delivered status pages and docs mirrors      | Shows the same explicit-route app model packaged for Cloudflare Workers.                                            |
| `social-cards`      | publisher and marketing workflows                 | Shows dynamic social cards authored as Vue SFCs and rendered through Chromium.                                      |

## Reading Order

1. Start with `explicit-routes` if you want the clearest picture of the Zero JavaScript-first MPA model.
2. Move to `secure-islands` if the question is how to add interactivity without hydrating the whole page.
3. Open `mixed-sfc-jsx` if the sticking point is mixed authoring styles or MPA-friendly browser state.
4. Read `isr-cache` when the next question is freshness and revalidation.
5. Use `node-srvx` and `cloudflare-worker` when the question becomes deployment shape.
6. Open `social-cards` when you need Chromium-backed OG image generation in the same app model.

## Example READMEs

- [`explicit-routes`](./explicit-routes/README.md)
- [`secure-islands`](./secure-islands/README.md)
- [`mixed-sfc-jsx`](./mixed-sfc-jsx/README.md)
- [`isr-cache`](./isr-cache/README.md)
- [`node-srvx`](./node-srvx/README.md)
- [`cloudflare-worker`](./cloudflare-worker/README.md)
- [`social-cards`](./social-cards/README.md)
