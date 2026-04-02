import { defineConfig } from "vite-plus";

export default defineConfig({
  pack: {
    clean: true,
    deps: {
      neverBundle: ["@vue-server/core/adapters/deno"],
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
