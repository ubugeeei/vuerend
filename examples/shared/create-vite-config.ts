import { defineConfig } from "vite";
import { vuerend } from "../../packages/core/src/vite";
import { vuerendAliases } from "./vuerend-alias";

export interface ExampleViteConfigOptions {
  app: string;
  islands?: string;
}

export function createExampleViteConfig(options: ExampleViteConfigOptions) {
  return defineConfig({
    plugins: [
      vuerend({
        app: options.app,
        islands: options.islands,
      }),
    ],
    resolve: {
      alias: vuerendAliases(),
    },
  });
}
