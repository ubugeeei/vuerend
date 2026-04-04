import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: ["@vuerend/core/adapters/node"],
    },
    dts: {
      oxc: true,
    },
    entry: {
      index: "src/index.ts",
    },
    format: ["esm"],
    sourcemap: true,
  },
});
