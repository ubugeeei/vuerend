import { defineConfig } from "vite";
import { vuerend } from "../../packages/core/src/vite";
import { vuerendAliases } from "../shared/vuerend-alias";

export default defineConfig({
  plugins: [
    vuerend({
      app: "./src/app.ts",
    }),
  ],
  resolve: {
    alias: vuerendAliases(),
  },
});
