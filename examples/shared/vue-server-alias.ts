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

export function vueServerAliases(): Record<string, string> {
  return {
    "@vue-server/core": resolve(coreRoot, "src/index.ts"),
    "@vue-server/core/vite": resolve(coreRoot, "src/vite.ts"),
    "@vue-server/core/runtime": resolve(coreRoot, "src/runtime.ts"),
    "@vue-server/core/client": resolve(coreRoot, "src/client.ts"),
    "@vue-server/core/adapters/node": resolve(coreRoot, "src/adapters/node.ts"),
    "@vue-server/core/adapters/bun": resolve(coreRoot, "src/adapters/bun.ts"),
    "@vue-server/core/adapters/deno": resolve(coreRoot, "src/adapters/deno.ts"),
    "@vue-server/core/adapters/cloudflare": resolve(coreRoot, "src/adapters/cloudflare.ts"),
    "@vue-server/core/adapters/service-worker": resolve(coreRoot, "src/adapters/service-worker.ts"),
    "@vue-server/node": resolve(nodeRoot, "src/index.ts"),
    "@vue-server/cloudflare": resolve(cloudflareRoot, "src/index.ts"),
    "@vue-server/service-worker": resolve(serviceWorkerRoot, "src/index.ts"),
    "@vue-server/bun": resolve(bunRoot, "src/index.ts"),
    "@vue-server/deno": resolve(denoRoot, "src/index.ts"),
  };
}
