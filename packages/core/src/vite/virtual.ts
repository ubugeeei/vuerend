import type { ClientBuildAssets } from "../runtime/types.js";
import {
  PUBLIC_PACKAGE_NAME,
  RESOLVED_CLIENT_BUILD,
  RESOLVED_CLIENT_ENTRY,
  RESOLVED_SERVER_ENTRY,
  VIRTUAL_CLIENT_BUILD,
  VIRTUAL_CLIENT_ENTRY,
  VIRTUAL_SERVER_ENTRY,
} from "./constants.js";
import type { ResolvedVuerendPluginOptions } from "./types.js";

export function resolveVirtualId(id: string): string | undefined {
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

    return [
      `import islands from ${JSON.stringify(options.islands)};`,
      `import { hydrateIslands } from ${JSON.stringify(`${PUBLIC_PACKAGE_NAME}/client`)};`,
      "void hydrateIslands(islands);",
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
      "const handler = createRequestHandler({ app, assets, ...runtimeOptions });",
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

  return null;
}
