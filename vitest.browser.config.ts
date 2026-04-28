import { defineBrowserCommand, playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";
import {
  buildBundleComparison,
  serveBundleComparisonAsset,
} from "./packages/core/test/browser/bundle-comparison";

export default defineConfig({
  plugins: [
    {
      name: "bundle-comparison-static-assets",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          void serveBundleComparisonAsset(request, response, next);
        });
      },
    },
  ],
  test: {
    browser: {
      commands: {
        buildBundleComparison: defineBrowserCommand(async () => buildBundleComparison()),
      },
      enabled: true,
      headless: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
      provider: playwright(),
    },
    fileParallelism: false,
    include: ["packages/core/test/browser/**/*.browser.test.ts"],
    testTimeout: 120_000,
  },
});
