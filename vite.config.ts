import { defineConfig } from "vite-plus";
import type { PackUserConfig } from "vite-plus/pack";

const coreNeverBundle = [
  "vue",
  "vite",
  "srvx",
  "srvx/node",
  "srvx/bun",
  "srvx/deno",
  "srvx/cloudflare",
  "srvx/service-worker",
  "@vitejs/plugin-vue",
  "@vitejs/plugin-vue-jsx",
  "@vue/server-renderer",
];

function adapterPack(cwd: string, name: string): PackUserConfig {
  return {
    clean: true,
    deps: {
      neverBundle: ["@vuerend/core"],
    },
    dts: {
      oxc: true,
    },
    entry: {
      index: `${cwd}/src/index.ts`,
    },
    format: ["esm"],
    name,
    outDir: `${cwd}/dist`,
    sourcemap: true,
    tsconfig: `${cwd}/tsconfig.json`,
  };
}

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  pack: [
    {
      clean: true,
      deps: {
        neverBundle: coreNeverBundle,
      },
      dts: {
        oxc: true,
      },
      entry: {
        index: "packages/core/src/index.ts",
        vite: "packages/core/src/vite.ts",
        runtime: "packages/core/src/runtime.ts",
        client: "packages/core/src/client.ts",
        "adapters/node": "packages/core/src/adapters/node.ts",
        "adapters/bun": "packages/core/src/adapters/bun.ts",
        "adapters/deno": "packages/core/src/adapters/deno.ts",
        "adapters/cloudflare": "packages/core/src/adapters/cloudflare.ts",
        "adapters/service-worker": "packages/core/src/adapters/service-worker.ts",
      },
      format: ["esm"],
      name: "@vuerend/core",
      outDir: "packages/core/dist",
      sourcemap: true,
      tsconfig: "packages/core/tsconfig.json",
    },
    adapterPack("packages/node", "@vuerend/node"),
    adapterPack("packages/bun", "@vuerend/bun"),
    adapterPack("packages/deno", "@vuerend/deno"),
    adapterPack("packages/cloudflare", "@vuerend/cloudflare"),
    adapterPack("packages/service-worker", "@vuerend/service-worker"),
  ],
});
