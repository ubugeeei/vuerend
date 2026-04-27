import { describe, expect, it } from "vitest";
import type { ClientBuildAssets } from "../src/runtime/types";
import { RESOLVED_CLIENT_ENTRY } from "../src/vite/constants";
import type { ResolvedVuerendPluginOptions } from "../src/vite/types";
import { loadVirtualModule } from "../src/vite/virtual";

const assets: ClientBuildAssets = {};

describe("Vite virtual modules", () => {
  it("uses the pure Vapor hydration export for runtime-only Vapor islands", () => {
    const code = loadVirtualModule(
      RESOLVED_CLIENT_ENTRY,
      createOptions({
        vapor: {
          mode: "islands",
          interop: false,
        },
      }),
      assets,
    );

    expect(code).toContain("hydrateVaporRuntimeIslands");
    expect(code).toContain("hydrateVaporRuntimeIslands(islands)");
    expect(code).not.toContain("hydrateVaporIslands(islands,");
  });

  it("uses the interop-capable Vapor hydration export when requested", () => {
    const code = loadVirtualModule(
      RESOLVED_CLIENT_ENTRY,
      createOptions({
        vapor: {
          mode: "interop",
          interop: true,
        },
      }),
      assets,
    );

    expect(code).toContain("hydrateVaporIslands");
    expect(code).toContain('{"mode":"interop","interop":true}');
  });
});

function createOptions(
  overrides: Partial<ResolvedVuerendPluginOptions> = {},
): ResolvedVuerendPluginOptions {
  return {
    app: "/src/app.ts",
    islands: "/src/islands.ts",
    clientOutDir: "dist/client",
    serverOutDir: "dist/server",
    ...overrides,
  };
}
