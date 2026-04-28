import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(fileURLToPath(new URL("../../../../../", import.meta.url)));
const coreRoot = resolve(repoRoot, "packages/core");

export function vuerendAliases(): Array<{ find: string; replacement: string }> {
  return [
    { find: "@vuerend/core/vite", replacement: resolve(coreRoot, "src/vite.ts") },
    { find: "@vuerend/core/runtime", replacement: resolve(coreRoot, "src/runtime.ts") },
    {
      find: "@vuerend/core/client/hydrate",
      replacement: resolve(coreRoot, "src/client/hydrate.ts"),
    },
    {
      find: "@vuerend/core/client/vapor-hydrate",
      replacement: resolve(coreRoot, "src/client/vapor-hydrate.ts"),
    },
    { find: "@vuerend/core/client", replacement: resolve(coreRoot, "src/client.ts") },
    { find: "@vuerend/core", replacement: resolve(coreRoot, "src/runtime.ts") },
  ];
}
