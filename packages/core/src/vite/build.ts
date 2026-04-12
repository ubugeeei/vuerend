import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import type { ResolvedConfig } from "vite";
import type { ClientBuildAssets } from "../runtime/types.js";
import { MANIFEST_FILE } from "./constants.js";
import { dirname, joinBase, toPrerenderPath } from "./helpers.js";
import type { ResolvedVuerendPluginOptions } from "./types.js";

interface ClientManifestEntry {
  css?: string[] | undefined;
  file: string;
  imports?: string[] | undefined;
  isEntry?: boolean | undefined;
}

interface LightningCssModule {
  transform(input: { code: Buffer; filename: string; minify: boolean; sourceMap: boolean }): {
    code: Uint8Array;
  };
}

export async function loadClientAssets(
  config: ResolvedConfig,
  outDir: string,
  base: string,
): Promise<ClientBuildAssets> {
  const manifestPath = join(config.root, outDir, MANIFEST_FILE);
  const manifestRaw = await readFile(manifestPath, "utf8");
  const manifest = JSON.parse(manifestRaw) as Record<string, ClientManifestEntry>;
  const entry = Object.values(manifest).find((item) => item.isEntry);
  const css = new Set<string>();
  const modulepreload = new Set<string>();

  if (entry) {
    collectImportedClientAssets(manifest, entry, base, css, modulepreload, new Set());
  }

  return {
    entry: entry?.file ? joinBase(base, entry.file) : undefined,
    css: [...css],
    modulepreload: [...modulepreload],
  };
}

function collectImportedClientAssets(
  manifest: Record<string, ClientManifestEntry>,
  entry: ClientManifestEntry,
  base: string,
  css: Set<string>,
  modulepreload: Set<string>,
  seen: Set<string>,
): void {
  for (const asset of entry.css ?? []) {
    css.add(joinBase(base, asset));
  }

  for (const importKey of entry.imports ?? []) {
    if (seen.has(importKey)) {
      continue;
    }

    seen.add(importKey);
    const imported = manifest[importKey];

    if (!imported) {
      continue;
    }

    modulepreload.add(joinBase(base, imported.file));
    collectImportedClientAssets(manifest, imported, base, css, modulepreload, seen);
  }
}

export async function minifyClientCssAssets(config: ResolvedConfig, outDir: string): Promise<void> {
  const root = join(config.root, outDir);
  const files = await listCssFiles(root);

  if (files.length === 0) {
    return;
  }

  const lightningCss = await importLightningCssFromVite();

  await Promise.all(
    files.map(async (file) => {
      const css = await readFile(file);
      const result = lightningCss.transform({
        code: css,
        filename: file,
        minify: true,
        sourceMap: false,
      });
      await writeFile(file, result.code);
    }),
  );
}

async function listCssFiles(root: string): Promise<string[]> {
  let entries;

  try {
    entries = await readdir(root, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(root, entry.name);

      if (entry.isDirectory()) {
        return listCssFiles(path);
      }

      return entry.isFile() && path.endsWith(".css") ? [path] : [];
    }),
  );

  return nested.flat();
}

async function importLightningCssFromVite(): Promise<LightningCssModule> {
  const require = createRequire(import.meta.url);
  const vitePackagePath = require.resolve("vite/package.json");
  const requireFromVite = createRequire(vitePackagePath);
  const lightningCssPath = requireFromVite.resolve("lightningcss");

  return import(pathToFileURL(lightningCssPath).href) as Promise<LightningCssModule>;
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

  const startedAt = Date.now();
  const concurrency = getPrerenderConcurrency(routes.length);
  const reportEvery = Math.max(1, Math.ceil(routes.length / 10));
  let completed = 0;
  let skipped = 0;

  config.logger.info(
    `vuerend prerendering ${routes.length} routes (concurrency ${concurrency})...`,
    { clear: false },
  );

  await runPrerenderQueue(routes, concurrency, async (route) => {
    const response = await runtime.fetch(new Request(`https://vuerend.local${route}`));

    if (!response.ok) {
      skipped += 1;
      reportPrerenderProgress(config, ++completed, routes.length, reportEvery);
      return;
    }

    const html = await response.text();
    const filePath = toPrerenderPath(config.root, options.clientOutDir, route);
    await mkdir(dirname(filePath), { recursive: true });
    await writeFile(filePath, html, "utf8");
    reportPrerenderProgress(config, ++completed, routes.length, reportEvery);
  });

  const elapsedMs = Date.now() - startedAt;
  const skippedSuffix = skipped > 0 ? `, ${skipped} skipped` : "";
  config.logger.info(
    `vuerend prerender complete: ${routes.length - skipped}/${routes.length} written${skippedSuffix} in ${elapsedMs}ms`,
    { clear: false },
  );
}

/** Bounds prerender fan-out so static generation is faster without flooding the CPU. */
function getPrerenderConcurrency(routeCount: number): number {
  return Math.min(routeCount, 4);
}

/** Runs route rendering through a small async worker queue. */
async function runPrerenderQueue(
  routes: readonly string[],
  concurrency: number,
  render: (route: string) => Promise<void>,
): Promise<void> {
  let nextRouteIndex = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (nextRouteIndex < routes.length) {
      const route = routes[nextRouteIndex++];
      if (route === undefined) {
        break;
      }

      await render(route);
    }
  });

  await Promise.all(workers);
}

/** Prints sparse progress so long static builds do not look frozen. */
function reportPrerenderProgress(
  config: ResolvedConfig,
  completed: number,
  total: number,
  reportEvery: number,
): void {
  if (completed === total || completed % reportEvery === 0) {
    config.logger.info(`vuerend prerendered ${completed}/${total} routes`, { clear: false });
  }
}
