import { dirname, join } from "node:path";
import { STATIC_ASSET_PATTERN } from "./constants.js";

export function shouldHandleRequest(url: string | undefined): boolean {
  if (!url) {
    return false;
  }

  const pathname = new URL(url, "http://vuerend.local").pathname;

  if (
    pathname.startsWith("/@") ||
    pathname.startsWith("/__vite") ||
    pathname.startsWith("/node_modules/")
  ) {
    return false;
  }

  return !STATIC_ASSET_PATTERN.test(pathname);
}

export function joinBase(base: string, file: string): string {
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  const normalizedFile = file.startsWith("/") ? file : `/${file}`;
  return `${normalizedBase}${normalizedFile}` || normalizedFile;
}

export function toPrerenderPath(root: string, outDir: string, route: string): string {
  if (route === "/") {
    return join(root, outDir, "index.html");
  }

  return join(root, outDir, route.slice(1), "index.html");
}

export { dirname };
