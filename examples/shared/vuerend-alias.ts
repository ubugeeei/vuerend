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

export function vuerendAliases(): Record<string, string> {
  return {
    "@vuerend/core": resolve(coreRoot, "src/index.ts"),
    "@vuerend/core/vite": resolve(coreRoot, "src/vite.ts"),
    "@vuerend/core/runtime": resolve(coreRoot, "src/runtime.ts"),
    "@vuerend/core/client": resolve(coreRoot, "src/client.ts"),
    "@vuerend/core/adapters/node": resolve(coreRoot, "src/adapters/node.ts"),
    "@vuerend/core/adapters/bun": resolve(coreRoot, "src/adapters/bun.ts"),
    "@vuerend/core/adapters/deno": resolve(coreRoot, "src/adapters/deno.ts"),
    "@vuerend/core/adapters/cloudflare": resolve(coreRoot, "src/adapters/cloudflare.ts"),
    "@vuerend/core/adapters/service-worker": resolve(coreRoot, "src/adapters/service-worker.ts"),
    "@vuerend/node": resolve(nodeRoot, "src/index.ts"),
    "@vuerend/cloudflare": resolve(cloudflareRoot, "src/index.ts"),
    "@vuerend/service-worker": resolve(serviceWorkerRoot, "src/index.ts"),
    "@vuerend/bun": resolve(bunRoot, "src/index.ts"),
    "@vuerend/deno": resolve(denoRoot, "src/index.ts"),
  };
}
