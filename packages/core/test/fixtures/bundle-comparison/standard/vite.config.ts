import { defineConfig } from "vite";
import { vuerend } from "../../../../src/vite";
import { vuerendAliases } from "../vuerend-alias";

export default defineConfig({
  base: "./",
  plugins: [
    vuerend({
      app: "./src/app.ts",
      islands: "./src/islands.ts",
      vue: {
        features: {
          optionsAPI: false,
        },
      },
    }),
  ],
  resolve: {
    alias: vuerendAliases(),
  },
});
