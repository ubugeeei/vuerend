import { createReadStream } from "node:fs";
import { readdir, readFile, rm } from "node:fs/promises";
import type { IncomingMessage, ServerResponse } from "node:http";
import { extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { gzip } from "node:zlib";
import { createBuilder } from "vite";
import type {
  BundleAssetSize,
  BundleBuildSize,
  BundleComparison,
  BundleVariant,
} from "./bundle-comparison-types";

const gzipAsync = promisify(gzip);
const repoRoot = resolve(fileURLToPath(new URL("../../../../", import.meta.url)));
const fixtureRoot = resolve(repoRoot, "packages/core/test/fixtures/bundle-comparison");
const staticRoutePrefix = "/__bundle-comparison/";

type Next = (error?: unknown) => void;

export async function buildBundleComparison(): Promise<BundleComparison> {
  const [standard, vapor] = await Promise.all([buildFixture("standard"), buildFixture("vapor")]);

  const gzipBytes = vapor.totalGzipBytes - standard.totalGzipBytes;

  return {
    delta: {
      bytes: vapor.totalBytes - standard.totalBytes,
      gzipBytes,
      gzipPercent: (gzipBytes / standard.totalGzipBytes) * 100,
    },
    standard,
    vapor,
  };
}

async function buildFixture(name: BundleVariant): Promise<BundleBuildSize> {
  const root = resolve(fixtureRoot, name);
  const clientRoot = resolve(root, "dist/client");

  await rm(resolve(root, "dist"), { force: true, recursive: true });
  const builder = await createBuilder({
    configFile: resolve(root, "vite.config.ts"),
    logLevel: "warn",
    mode: "production",
    root,
  });
  await builder.buildApp();

  const assets = await collectBundleAssets(resolve(clientRoot, "assets"), clientRoot);
  const totalBytes = sum(assets.map((asset) => asset.bytes));
  const totalGzipBytes = sum(assets.map((asset) => asset.gzipBytes));

  return {
    assets,
    indexUrl: `${staticRoutePrefix}${name}/index.html`,
    name,
    totalBytes,
    totalGzipBytes,
  };
}

export async function serveBundleComparisonAsset(
  request: IncomingMessage,
  response: ServerResponse,
  next: Next,
): Promise<void> {
  if (!request.url?.startsWith(staticRoutePrefix)) {
    next();
    return;
  }

  try {
    const url = new URL(request.url, "http://vuerend.local");
    const [variant, ...pathSegments] = url.pathname
      .slice(staticRoutePrefix.length)
      .split("/")
      .filter(Boolean);

    if (variant !== "standard" && variant !== "vapor") {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const clientRoot = resolve(fixtureRoot, variant, "dist/client");
    const requestPath = pathSegments.map((segment) => decodeURIComponent(segment)).join("/");
    const file = resolve(clientRoot, requestPath || "index.html");

    if (!isInsideRoot(clientRoot, file)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    response.setHeader("cache-control", "no-store");
    response.setHeader("content-type", contentType(file));
    createReadStream(file)
      .on("error", () => {
        if (!response.headersSent) {
          response.writeHead(404);
        }

        response.end("Not found");
      })
      .pipe(response);
  } catch (error) {
    next(error);
  }
}

async function collectBundleAssets(
  assetsRoot: string,
  clientRoot: string,
): Promise<BundleAssetSize[]> {
  const files = await listFiles(assetsRoot);
  const bundleFiles = files.filter((file) => /\.(?:css|js)$/.test(file));
  const assets = await Promise.all(
    bundleFiles.map(async (file) => {
      const content = await readFile(file);
      const compressed = await gzipAsync(content);

      return {
        bytes: content.byteLength,
        file: normalizePath(relative(clientRoot, file)),
        gzipBytes: compressed.byteLength,
        kind: getAssetKind(file),
      } satisfies BundleAssetSize;
    }),
  );

  return assets.sort((left, right) => left.file.localeCompare(right.file));
}

async function listFiles(root: string): Promise<string[]> {
  const entries = await readdir(root, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(root, entry.name);

      if (entry.isDirectory()) {
        return listFiles(path);
      }

      return entry.isFile() ? [path] : [];
    }),
  );

  return nested.flat();
}

function getAssetKind(file: string): BundleAssetSize["kind"] {
  if (file.endsWith(".css")) {
    return "css";
  }

  if (file.endsWith(".js")) {
    return "js";
  }

  return "other";
}

function normalizePath(path: string): string {
  return path.split(sep).join("/");
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function isInsideRoot(root: string, file: string): boolean {
  return file === root || file.startsWith(`${root}${sep}`);
}

function contentType(file: string): string {
  switch (extname(file)) {
    case ".css":
      return "text/css; charset=utf-8";
    case ".html":
      return "text/html; charset=utf-8";
    case ".js":
      return "text/javascript; charset=utf-8";
    case ".json":
      return "application/json; charset=utf-8";
    default:
      return "application/octet-stream";
  }
}
