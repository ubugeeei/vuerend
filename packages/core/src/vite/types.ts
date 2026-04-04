import type vue from "@vitejs/plugin-vue";
import type vueJsx from "@vitejs/plugin-vue-jsx";

/**
 * Options for the Vuerend Vite plugin.
 *
 * `app` is required and must point to the explicit app entry module.
 */
export interface VuerendPluginOptions {
  app: string;
  /** Optional islands registry. Omit this for server-only apps that return no client JS. */
  islands?: string;
  outDir?: {
    client?: string;
    server?: string;
  };
  vue?: Parameters<typeof vue>[0];
  jsx?: Parameters<typeof vueJsx>[0];
}

export interface ResolvedVuerendPluginOptions {
  app: string;
  islands?: string | undefined;
  clientOutDir: string;
  serverOutDir: string;
}
