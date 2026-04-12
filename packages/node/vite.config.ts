import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: ["@vuerend/core", "playwright", "srvx/node"],
    },
    dts: {
      oxc: true,
    },
    entry: {
      index: "src/index.ts",
    },
    format: ["esm"],
    minify: true,
    sourcemap: false,
  },
});
