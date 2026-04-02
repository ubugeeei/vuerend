import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: [
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
      ],
    },
    dts: {
      oxc: true,
    },
    entry: {
      index: "src/index.ts",
      vite: "src/vite.ts",
      runtime: "src/runtime.ts",
      client: "src/client.ts",
      "adapters/node": "src/adapters/node.ts",
      "adapters/bun": "src/adapters/bun.ts",
      "adapters/deno": "src/adapters/deno.ts",
      "adapters/cloudflare": "src/adapters/cloudflare.ts",
      "adapters/service-worker": "src/adapters/service-worker.ts",
    },
    format: ["esm"],
    sourcemap: true,
  },
  staged: {
    "*.{ts,tsx,vue,mts,cts,json,md}": "vp check --fix",
  },
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
  },
});
