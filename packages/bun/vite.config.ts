import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: ["@vuerend/core", "srvx/bun"],
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
