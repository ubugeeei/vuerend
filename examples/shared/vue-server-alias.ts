import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = resolve(fileURLToPath(new URL("../../packages/core", import.meta.url)));
const nodeRoot = resolve(fileURLToPath(new URL("../../packages/node", import.meta.url)));
const cloudflareRoot = resolve(
  fileURLToPath(new URL("../../packages/cloudflare", import.meta.url)),
);
const serviceWorkerRoot = resolve(
  fileURLToPath(new URL("../../packages/service-worker", import.meta.url)),
);
const bunRoot = resolve(fileURLToPath(new URL("../../packages/bun", import.meta.url)));
const denoRoot = resolve(fileURLToPath(new URL("../../packages/deno", import.meta.url)));

export function vueServerAliases(): Array<{ find: string; replacement: string }> {
  return [
    { find: "@vue-server/core/vite", replacement: resolve(coreRoot, "src/vite.ts") },
    { find: "@vue-server/core/runtime", replacement: resolve(coreRoot, "src/runtime.ts") },
    { find: "@vue-server/core/client", replacement: resolve(coreRoot, "src/client.ts") },
    {
      find: "@vue-server/core/adapters/node",
      replacement: resolve(coreRoot, "src/adapters/node.ts"),
    },
    {
      find: "@vue-server/core/adapters/bun",
      replacement: resolve(coreRoot, "src/adapters/bun.ts"),
    },
    {
      find: "@vue-server/core/adapters/deno",
      replacement: resolve(coreRoot, "src/adapters/deno.ts"),
    },
    {
      find: "@vue-server/core/adapters/cloudflare",
      replacement: resolve(coreRoot, "src/adapters/cloudflare.ts"),
    },
    {
      find: "@vue-server/core/adapters/service-worker",
      replacement: resolve(coreRoot, "src/adapters/service-worker.ts"),
    },
    { find: "@vue-server/core", replacement: resolve(coreRoot, "src/index.ts") },
    { find: "@vue-server/node", replacement: resolve(nodeRoot, "src/index.ts") },
    { find: "@vue-server/cloudflare", replacement: resolve(cloudflareRoot, "src/index.ts") },
    {
      find: "@vue-server/service-worker",
      replacement: resolve(serviceWorkerRoot, "src/index.ts"),
    },
    { find: "@vue-server/bun", replacement: resolve(bunRoot, "src/index.ts") },
    { find: "@vue-server/deno", replacement: resolve(denoRoot, "src/index.ts") },
  ];
}
