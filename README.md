# Vue Server Monorepo

This repository is a monorepo for the `@vue-server/*` packages. The workspace root contains the core package, thin runtime adapters, and runnable examples. Route components are server components by default, so pages return no client JavaScript unless they render explicit islands.

## Layout

- `packages/core`: `@vue-server/core`
- `packages/node`: `@vue-server/node`
- `packages/bun`: `@vue-server/bun`
- `packages/deno`: `@vue-server/deno`
- `packages/cloudflare`: `@vue-server/cloudflare`
- `packages/service-worker`: `@vue-server/service-worker`
- `examples/explicit-routes`: minimal explicit-routing app
- `examples/secure-islands`: secure island boundaries with targeted hydration
- `examples/isr-cache`: opt-in cache, ISR, and prerendering
- `examples/node-srvx`: Node server entry with `srvx/node`
- `examples/cloudflare-worker`: fetch-first Cloudflare Worker entry
- `examples/mixed-sfc-jsx`: mixed Vue SFC and JSX app

## Commands

From the repo root, use `vp` directly for the library workspace:

```bash
vp check
vp test
vp pack
```

Examples are meant to be run from their own directories with Vite. They alias the workspace source directly, so you do not need to publish any package before trying them.

## Documentation

The core package README lives at [packages/core/README.md](packages/core/README.md).
