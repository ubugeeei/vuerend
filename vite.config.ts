import { defineConfig } from "vite-plus";
import type { PackUserConfig } from "vite-plus/pack";

const coreNeverBundle = [
  "vue",
  "vite",
  "srvx/node",
  "@vitejs/plugin-vue",
  "@vitejs/plugin-vue-jsx",
  "@vue/server-renderer",
];

function adapterPack(
  cwd: string,
  name: string,
  runtimeModule: string,
  extras: string[] = [],
): PackUserConfig {
  return {
    clean: true,
    deps: {
      neverBundle: ["@vuerend/core", runtimeModule, ...extras],
    },
    dts: {
      oxc: true,
    },
    entry: {
      index: `${cwd}/src/index.ts`,
    },
    format: ["esm"],
    minify: true,
    name,
    outDir: `${cwd}/dist`,
    sourcemap: false,
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
        "client/hydrate": "packages/core/src/client/hydrate.ts",
        "client/vapor-hydrate": "packages/core/src/client/vapor-hydrate.ts",
      },
      format: ["esm"],
      minify: true,
      name: "@vuerend/core",
      outDir: "packages/core/dist",
      sourcemap: false,
      tsconfig: "packages/core/tsconfig.json",
    },
    adapterPack("packages/node", "@vuerend/node", "srvx/node", ["playwright"]),
    adapterPack("packages/bun", "@vuerend/bun", "srvx/bun"),
    adapterPack("packages/deno", "@vuerend/deno", "srvx/deno"),
    adapterPack("packages/cloudflare", "@vuerend/cloudflare", "srvx/cloudflare"),
    adapterPack("packages/service-worker", "@vuerend/service-worker", "srvx/service-worker"),
  ],
  test: {
    exclude: ["packages/*/test/browser/**/*.browser.test.ts"],
    include: ["packages/*/test/**/*.test.ts"],
  },
});
