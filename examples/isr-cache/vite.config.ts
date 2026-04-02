import { defineConfig } from "vite";
import { vueServer } from "../../packages/core/src/vite";
import { vueServerAliases } from "../shared/vue-server-alias";

export default defineConfig({
  plugins: [
    vueServer({
      app: "./src/app.ts",
    }),
  ],
  resolve: {
    alias: vueServerAliases(),
  },
});
