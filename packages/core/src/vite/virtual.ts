import type { ClientBuildAssets } from "../runtime/types.js";
import {
  PUBLIC_PACKAGE_NAME,
  RESOLVED_CLIENT_BUILD,
  RESOLVED_CLIENT_ENTRY,
  RESOLVED_CLIENT_RUNTIME,
  RESOLVED_SERVER_ENTRY,
  VIRTUAL_CLIENT_BUILD,
  VIRTUAL_CLIENT_ENTRY,
  VIRTUAL_SERVER_ENTRY,
} from "./constants.js";
import type { ResolvedVuerendPluginOptions } from "./types.js";

export function resolveVirtualId(
  id: string,
  options?: { environment?: string | undefined; ssr?: boolean | undefined },
): string | undefined {
  const isServer = options?.environment ? options.environment === "server" : options?.ssr === true;

  if (id === PUBLIC_PACKAGE_NAME && !isServer) {
    return RESOLVED_CLIENT_RUNTIME;
  }

  if (id === VIRTUAL_CLIENT_ENTRY) {
    return RESOLVED_CLIENT_ENTRY;
  }

  if (id === VIRTUAL_SERVER_ENTRY) {
    return RESOLVED_SERVER_ENTRY;
  }

  if (id === VIRTUAL_CLIENT_BUILD) {
    return RESOLVED_CLIENT_BUILD;
  }

  return undefined;
}

export function loadVirtualModule(
  id: string,
  options: ResolvedVuerendPluginOptions,
  clientAssets: ClientBuildAssets,
): string | null {
  if (id === RESOLVED_CLIENT_ENTRY) {
    if (!options.islands) {
      return "export {};";
    }

    const vaporRuntimeOnly = options.vapor?.mode === "islands" && options.vapor.interop === false;
    const hydrateModule = options.vapor
      ? `${PUBLIC_PACKAGE_NAME}/client/vapor-hydrate`
      : `${PUBLIC_PACKAGE_NAME}/client/hydrate`;
    const hydrateExport = options.vapor
      ? vaporRuntimeOnly
        ? "hydrateVaporRuntimeIslands"
        : "hydrateVaporIslands"
      : "hydrateIslands";
    const hydrateArgs =
      options.vapor && !vaporRuntimeOnly ? `islands, ${JSON.stringify(options.vapor)}` : "islands";

    return [
      `import islands from ${JSON.stringify(options.islands)};`,
      `import { ${hydrateExport} } from ${JSON.stringify(hydrateModule)};`,
      `void ${hydrateExport}(${hydrateArgs});`,
    ].join("\n");
  }

  if (id === RESOLVED_SERVER_ENTRY) {
    return [
      `import assets from ${JSON.stringify(VIRTUAL_CLIENT_BUILD)};`,
      `import { createRequestHandler } from ${JSON.stringify(`${PUBLIC_PACKAGE_NAME}/runtime`)};`,
      `const appModule = await import(${JSON.stringify(options.app)});`,
      "const app = appModule.default;",
      "const runtimeOptions =",
      '  typeof appModule.requestHandlerOptions === "function"',
      "    ? await appModule.requestHandlerOptions({ assets })",
      "    : (appModule.requestHandlerOptions ?? {});",
      `const vapor = ${JSON.stringify(options.vapor)};`,
      "const handler = createRequestHandler({",
      "  app,",
      "  assets,",
      "  ...runtimeOptions,",
      "  ...(vapor ? { vapor } : {}),",
      "});",
      "export const fetch = handler;",
      "export const cache = handler.cache;",
      "export const listPrerenderRoutes = () => handler.listPrerenderRoutes();",
      "export const revalidatePath = (path) => handler.revalidatePath(path);",
      "export const revalidateTag = (tag) => handler.revalidateTag(tag);",
      "export default { fetch };",
    ].join("\n");
  }

  if (id === RESOLVED_CLIENT_BUILD) {
    return `export default ${JSON.stringify(clientAssets)};`;
  }

  if (id === RESOLVED_CLIENT_RUNTIME) {
    return [
      `export { useClientState } from ${JSON.stringify(`${PUBLIC_PACKAGE_NAME}/client`)};`,
      "export function defineIsland(id, options) {",
      "  const definition = Object.freeze({",
      "    id,",
      "    component: options.component,",
      "    load: options.load,",
      '    hydrate: options.hydrate ?? "load",',
      "    media: options.media,",
      "    ssr: options.ssr ?? true,",
      "  });",
      "  return { __vuerendIsland: definition };",
      "}",
      "export function defineIslands(islands) {",
      "  return islands;",
      "}",
      "export function getIslandDefinition(island) {",
      "  return island?.__vuerendIsland;",
      "}",
    ].join("\n");
  }

  return null;
}
