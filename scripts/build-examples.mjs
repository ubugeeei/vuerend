#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const examples = [
  "explicit-routes",
  "secure-islands",
  "mixed-sfc-jsx",
  "isr-cache",
  "node-srvx",
  "cloudflare-worker",
  "social-cards",
];

for (const example of examples) {
  const cwd = path.join(repoRoot, "examples", example);
  console.log(`\nBuilding example: ${example}`);

  const result = spawnSync("pnpm", ["exec", "vite", "build"], {
    cwd,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
