import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: [
        "vue",
        "@vue/runtime-vapor",
        "vite",
        "srvx/node",
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
      "client/hydrate": "src/client/hydrate.ts",
      "client/vapor-hydrate": "src/client/vapor-hydrate.ts",
    },
    format: ["esm"],
    minify: true,
    sourcemap: false,
  },
  staged: {
    "*.{ts,tsx,vue,mts,cts,json,md}": "vp check --fix",
  },
  test: {
    environment: "node",
    exclude: ["test/browser/**/*.browser.test.ts"],
    include: ["test/**/*.test.ts"],
  },
});
