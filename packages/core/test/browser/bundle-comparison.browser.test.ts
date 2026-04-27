import { describe, expect, it } from "vitest";
import { commands } from "vitest/browser";
import type { BundleComparison } from "./bundle-comparison-types";

interface BundleComparisonCommands {
  buildBundleComparison(): Promise<BundleComparison>;
}

const browserCommands = commands as unknown as BundleComparisonCommands;

describe("Vapor production bundles", () => {
  it("hydrates built pages and keeps the Vapor client smaller", async () => {
    const comparison = await browserCommands.buildBundleComparison();

    console.info(formatBundleComparison(comparison));

    await expectHydratedCounter(comparison.standard.indexUrl);
    await expectHydratedCounter(comparison.vapor.indexUrl);

    expect(comparison.standard.assets.length).toBeGreaterThan(0);
    expect(comparison.vapor.assets.length).toBeGreaterThan(0);
    expect(comparison.vapor.totalGzipBytes).toBeLessThan(comparison.standard.totalGzipBytes);
  });
});

async function expectHydratedCounter(src: string): Promise<void> {
  const iframe = document.createElement("iframe");
  const loaded = waitForFrameLoad(iframe);

  iframe.src = src;
  iframe.style.height = "480px";
  iframe.style.width = "720px";
  document.body.append(iframe);

  try {
    await loaded;

    const frameDocument = iframe.contentDocument;

    if (!frameDocument) {
      throw new Error(`Unable to read iframe document for ${src}.`);
    }

    const count = await waitForElement<HTMLElement>(frameDocument, '[data-testid="counter-count"]');
    const button = await waitForElement<HTMLButtonElement>(
      frameDocument,
      '[data-testid="counter-increment"]',
    );

    await waitFor(
      () =>
        frameDocument.querySelector("[data-vs-island]")?.getAttribute("data-vs-mounted") === "true",
      "Timed out waiting for the island to hydrate.",
    );

    expect(count.textContent?.trim()).toBe("3");

    button.click();

    await waitFor(
      () => count.textContent?.trim() === "4",
      "Timed out waiting for the hydrated counter to update.",
    );
  } finally {
    iframe.remove();
  }
}

function waitForFrameLoad(iframe: HTMLIFrameElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => {
      reject(new Error(`Timed out loading ${iframe.src}.`));
    }, 10_000);

    iframe.addEventListener(
      "load",
      () => {
        window.clearTimeout(timeout);
        resolve();
      },
      { once: true },
    );
  });
}

async function waitForElement<TElement extends Element>(
  root: ParentNode,
  selector: string,
): Promise<TElement> {
  return waitFor(
    () => root.querySelector<TElement>(selector),
    `Timed out waiting for ${selector}.`,
  );
}

async function waitFor<TValue>(
  read: () => TValue | false | null | undefined,
  message: string,
): Promise<TValue> {
  const startedAt = performance.now();

  while (performance.now() - startedAt < 10_000) {
    const value = read();

    if (value) {
      return value;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 25));
  }

  throw new Error(message);
}

function formatBundleComparison(comparison: BundleComparison): string {
  const lines = [
    "Production client bundle sizes:",
    ...formatBuild("standard", comparison.standard.assets),
    `standard total: ${formatBytes(comparison.standard.totalBytes)} raw, ${formatBytes(
      comparison.standard.totalGzipBytes,
    )} gzip`,
    ...formatBuild("vapor", comparison.vapor.assets),
    `vapor total: ${formatBytes(comparison.vapor.totalBytes)} raw, ${formatBytes(
      comparison.vapor.totalGzipBytes,
    )} gzip`,
    `delta: ${formatSignedBytes(comparison.delta.bytes)} raw, ${formatSignedBytes(
      comparison.delta.gzipBytes,
    )} gzip (${comparison.delta.gzipPercent.toFixed(1)}%)`,
  ];

  return lines.join("\n");
}

function formatBuild(label: string, assets: BundleComparison["standard"]["assets"]): string[] {
  return assets.map(
    (asset) =>
      `${label} ${asset.file}: ${formatBytes(asset.bytes)} raw, ${formatBytes(
        asset.gzipBytes,
      )} gzip`,
  );
}

function formatBytes(bytes: number): string {
  return `${bytes.toLocaleString("en-US")} B`;
}

function formatSignedBytes(bytes: number): string {
  const sign = bytes > 0 ? "+" : "";

  return `${sign}${formatBytes(bytes)}`;
}
