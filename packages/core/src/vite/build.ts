import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ResolvedConfig } from "vite";
import type { ClientBuildAssets } from "../runtime/types.js";
import { MANIFEST_FILE } from "./constants.js";
import { dirname, joinBase, toPrerenderPath } from "./helpers.js";
import type { ResolvedVuerendPluginOptions } from "./types.js";

export async function loadClientAssets(
  config: ResolvedConfig,
  outDir: string,
  base: string,
): Promise<ClientBuildAssets> {
  const manifestPath = join(config.root, outDir, MANIFEST_FILE);
  const manifestRaw = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw) as Record<
    string,
    { css?: string[]; file: string; isEntry?: boolean }
  >;
  const entry = Object.values(manifest).find((item) => item.isEntry);

  return {
    entry: entry?.file ? joinBase(base, entry.file) : undefined,
    css: entry?.css?.map((asset) => joinBase(base, asset)) ?? [],
  };
}

export async function prerenderStaticRoutes(
  config: ResolvedConfig,
  options: ResolvedVuerendPluginOptions,
): Promise<void> {
  const serverEntry = join(config.root, options.serverOutDir, "index.js");
  const runtime = await import(`${pathToFileURL(serverEntry).href}?t=${Date.now()}`);
  const routes = (await runtime.listPrerenderRoutes?.()) as string[] | undefined;

  if (!routes?.length) {
    return;
  }

  for (const route of routes) {
    const response = await runtime.fetch(new Request(`https://vuerend.local${route}`));

    if (!response.ok) {
      continue;
    }

    const html = await response.text();
    const filePath = toPrerenderPath(config.root, options.clientOutDir, route);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, html, "utf8");
  }
}
