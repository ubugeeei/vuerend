import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { NodeRequest, sendNodeResponse } from "srvx/node";
import {
  createRunnableDevEnvironment,
  defaultServerConditions,
  isRunnableDevEnvironment,
  normalizePath,
  type PluginOption,
  type ResolvedConfig,
  type Plugin,
} from "vite";
import type { ClientBuildAssets } from "../runtime/types.js";
import { resolveVuerendVaporOptions } from "../runtime/vapor-options.js";
import { loadClientAssets, minifyClientCssAssets, prerenderStaticRoutes } from "./build.js";
import { DEV_CLIENT_ENTRY_URL, RESOLVED_CLIENT_RUNTIME } from "./constants.js";
import { joinBase, shouldHandleRequest } from "./helpers.js";
import type { ResolvedVuerendPluginOptions, VuerendPluginOptions } from "./types.js";
import { loadVirtualModule, resolveVirtualId } from "./virtual.js";

/**
 * Installs the Vuerend Vite plugin.
 *
 * The plugin builds a client island entry and a fetch-first server entry using
 * the Vite v8 Environment API.
 */
export function vuerend(options: VuerendPluginOptions): PluginOption[] {
  const sourceRuntimeEntry = normalizePath(
    fileURLToPath(new URL("../runtime.ts", import.meta.url)),
  );
  const vuePlugins =
    options.vuePlugin === false
      ? []
      : options.vuePlugin === undefined
        ? options.vue === false
          ? []
          : vue(options.vue)
        : options.vuePlugin;
  const jsxPlugins =
    options.jsxPlugin === false
      ? []
      : options.jsxPlugin === undefined
        ? options.jsx === false
          ? []
          : vueJsx(options.jsx)
        : options.jsxPlugin;
  const state: {
    clientAssets: ClientBuildAssets;
    config: ResolvedConfig | undefined;
    options: ResolvedVuerendPluginOptions;
  } = {
    clientAssets: {
      entry: DEV_CLIENT_ENTRY_URL,
      css: [] as string[],
      modulepreload: [] as string[],
    },
    config: undefined,
    options: {
      app: "",
      islands: undefined,
      clientOutDir: options.outDir?.client ?? "dist/client",
      serverOutDir: options.outDir?.server ?? "dist/server",
      vapor: resolveVuerendVaporOptions(options.vapor),
    },
  };

  const plugin: Plugin = {
    name: "vuerend",
    enforce: "pre",
    config(userConfig) {
      const root = userConfig.root ?? process.cwd();
      state.options.app = normalizePath(resolve(root, options.app));
      state.options.islands = options.islands
        ? normalizePath(resolve(root, options.islands))
        : undefined;

      return {
        appType: "custom",
        builder: {
          sharedConfigBuild: true,
          sharedPlugins: true,
          async buildApp() {},
        },
        environments: {
          client: {
            build: {
              outDir: state.options.clientOutDir,
              emptyOutDir: true,
              manifest: ".vite/manifest.json",
              cssMinify: "lightningcss",
              minify: "oxc",
              sourcemap: false,
              rolldownOptions: {
                input: {
                  "vuerend-client": "virtual:vuerend/client-entry",
                },
                output: {
                  comments: false,
                  codeSplitting: {
                    groups: [
                      {
                        name: "vue",
                        test: /node_modules[\\/](?:@vue|vue)[\\/]/,
                        priority: 10,
                      },
                    ],
                  },
                },
              },
            },
          },
          server: {
            consumer: "server",
            dev: {
              createEnvironment(name, environmentConfig) {
                return createRunnableDevEnvironment(name, environmentConfig);
              },
            },
            build: {
              copyPublicDir: false,
              emitAssets: false,
              emptyOutDir: true,
              outDir: state.options.serverOutDir,
              cssMinify: "lightningcss",
              minify: "oxc",
              sourcemap: false,
              ssr: true,
              rolldownOptions: {
                external: ["playwright", "srvx/node"],
                input: {
                  server: "virtual:vuerend/server-entry",
                },
                output: {
                  comments: false,
                  entryFileNames: "index.js",
                },
              },
            },
          },
        },
      };
    },
    configEnvironment(name, environment) {
      if (name !== "server") {
        return;
      }

      return {
        ...environment,
        keepProcessEnv: true,
        resolve: {
          ...environment.resolve,
          conditions: ["vuerend", "workerd", "worker", ...defaultServerConditions],
        },
        build: {
          ...environment.build,
          target: "esnext",
          ssr: true,
          ssrEmitAssets: false,
        },
      };
    },
    configResolved(config) {
      state.config = config;
      state.clientAssets = {
        entry: joinBase(config.base, DEV_CLIENT_ENTRY_URL),
        css: [],
        modulepreload: [],
      };
    },
    configureServer(server) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          if (!shouldHandleRequest(req.url)) {
            next();
            return;
          }

          const environment = server.environments.server;

          if (!environment || !isRunnableDevEnvironment(environment)) {
            next(new TypeError("vuerend requires a runnable server environment."));
            return;
          }

          try {
            const runtime = await environment.runner.import("virtual:vuerend/server-entry");
            const request = new NodeRequest({ req, res });
            const response = await runtime.fetch(request);
            await sendNodeResponse(res, response);
          } catch (error) {
            next(error as Error);
          }
        });
      };
    },
    resolveId(id, _importer, options) {
      const environment = (this as { environment?: { name?: string } }).environment;
      const isServer = environment?.name ? environment.name === "server" : options.ssr === true;

      if (!isServer && normalizePath(id) === sourceRuntimeEntry) {
        return RESOLVED_CLIENT_RUNTIME;
      }

      return resolveVirtualId(id, {
        environment: environment?.name,
        ssr: options.ssr,
      });
    },
    load(id) {
      return loadVirtualModule(id, state.options, state.clientAssets);
    },
    async buildApp(builder) {
      const config = state.config;

      if (!config) {
        return;
      }

      const clientEnvironment = builder.environments.client;
      const serverEnvironment = builder.environments.server;

      if (!clientEnvironment || !serverEnvironment) {
        return;
      }

      await builder.build(clientEnvironment);
      await minifyClientCssAssets(config, state.options.clientOutDir);
      state.clientAssets = await loadClientAssets(config, state.options.clientOutDir, config.base);
      await builder.build(serverEnvironment);
      await prerenderStaticRoutes(config, state.options);
    },
  };

  return [vuePlugins, jsxPlugins, plugin].flat();
}
