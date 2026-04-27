import { defineConfig } from "vite";
import { vuerend } from "../../packages/core/src/vite";
import type { VuerendPluginOptions } from "../../packages/core/src/vite";
import { vuerendAliases } from "./vuerend-alias";

export interface ExampleViteConfigOptions {
  app: string;
  islands?: string;
  vapor?: VuerendPluginOptions["vapor"];
  vue?: VuerendPluginOptions["vue"];
}

export function createExampleViteConfig(options: ExampleViteConfigOptions) {
  return defineConfig({
    plugins: [
      vuerend({
        app: options.app,
        islands: options.islands,
        vapor: options.vapor,
        vue: options.vue,
      }),
    ],
    resolve: {
      alias: vuerendAliases(),
    },
  });
}
