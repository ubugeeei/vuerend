#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const artifactDir = path.join(repoRoot, ".release-artifacts");
const packageDirectories = [
  "packages/core",
  "packages/node",
  "packages/bun",
  "packages/deno",
  "packages/cloudflare",
  "packages/service-worker",
];
const stableReleaseKinds = new Set(["major", "minor", "patch"]);
const prereleaseKinds = new Set(["alpha", "beta", "rc"]);
const releaseCheckTargets = [
  ".github/workflows",
  "package.json",
  "pnpm-workspace.yaml",
  "README.md",
  "scripts",
  ...packageDirectories.flatMap((directory) => [
    `${directory}/package.json`,
    `${directory}/src`,
    `${directory}/vite.config.ts`,
  ]),
];

function main(argv) {
  const [commandOrKind, ...rest] = argv;

  if (!commandOrKind) {
    printUsage();
    process.exit(1);
  }

  if (commandOrKind === "publish-from-tag") {
    const options = parseOptions(rest, {
      allowPublishTarget: false,
      allowTagOverride: true,
    });
    publishFromTag(options);
    return;
  }

  const releaseKind = normalizeReleaseKind(commandOrKind);
  const options = parseOptions(rest, {
    allowPublishTarget: true,
    allowTagOverride: false,
  });

  createRelease(releaseKind, options);
}

function printUsage() {
  console.error(`Usage:
  vp run release <major|minor|patch|rc|alpha|allpha|beta> [--publish=ci|local] [--dry-run] [--skip-git] [--skip-push]
  vp run release publish-from-tag [--tag v1.2.3] [--dry-run]
`);
}

function parseOptions(args, config) {
  const options = {
    dryRun: false,
    publishTarget: "ci",
    skipGit: false,
    skipPush: false,
    otp: undefined,
    tag: undefined,
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (argument === "--skip-git") {
      options.skipGit = true;
      options.skipPush = true;
      continue;
    }

    if (argument === "--skip-push" || argument === "--no-push") {
      options.skipPush = true;
      continue;
    }

    if (config.allowPublishTarget && argument === "--local") {
      options.publishTarget = "local";
      continue;
    }

    if (config.allowPublishTarget && argument.startsWith("--publish=")) {
      options.publishTarget = readPublishTarget(argument.slice("--publish=".length));
      continue;
    }

    if (config.allowPublishTarget && argument === "--publish") {
      index += 1;
      options.publishTarget = readPublishTarget(readRequiredOptionValue(args[index], "--publish"));
      continue;
    }

    if (argument.startsWith("--otp=")) {
      options.otp = argument.slice("--otp=".length);
      continue;
    }

    if (argument === "--otp") {
      index += 1;
      options.otp = readRequiredOptionValue(args[index], "--otp");
      continue;
    }

    if (config.allowTagOverride && argument.startsWith("--tag=")) {
      options.tag = argument.slice("--tag=".length);
      continue;
    }

    if (config.allowTagOverride && argument === "--tag") {
      index += 1;
      options.tag = readRequiredOptionValue(args[index], "--tag");
      continue;
    }

    console.error(`Unknown option: ${argument}`);
    printUsage();
    process.exit(1);
  }

  return options;
}

function readRequiredOptionValue(value, optionName) {
  if (value) {
    return value;
  }

  console.error(`Missing value for ${optionName}`);
  process.exit(1);
}

function readPublishTarget(value) {
  if (value === "ci" || value === "local") {
    return value;
  }

  console.error(`Unsupported publish target: ${value}`);
  process.exit(1);
}

function normalizeReleaseKind(value) {
  if (value === "allpha") {
    return "alpha";
  }

  if (stableReleaseKinds.has(value) || prereleaseKinds.has(value)) {
    return value;
  }

  console.error(`Unsupported release kind: ${value}`);
  printUsage();
  process.exit(1);
}

function createRelease(releaseKind, options) {
  const packages = readPublishedPackages();
  const currentVersion = readSharedVersion(packages);
  const nextVersion = bumpVersion(currentVersion, releaseKind);
  const distTag = resolveDistTag(nextVersion);

  console.log(`Preparing release ${currentVersion} -> ${nextVersion}`);
  console.log(`Publish target: ${options.publishTarget}`);
  console.log(`Git tag: v${nextVersion}`);

  if (options.dryRun) {
    printDryRunSummary(nextVersion, distTag, options);
    return;
  }

  ensureCleanWorktree();
  runReleaseChecks();
  updatePackageVersions(packages, nextVersion);

  if (options.publishTarget === "local") {
    ensureNpmLogin();
    publishPackages(packages, nextVersion, {
      distTag,
      otp: options.otp,
      provenance: false,
    });
  }

  if (!options.skipGit) {
    createReleaseCommit(packages, nextVersion);
    createReleaseTag(nextVersion);
  }

  if (!options.skipGit && !options.skipPush) {
    pushRelease();
  }
}

function publishFromTag(options) {
  const packages = readPublishedPackages();
  const currentVersion = readSharedVersion(packages);
  const tag = options.tag ?? process.env.GITHUB_REF_NAME;

  if (!tag) {
    throw new Error("Missing tag name. Pass --tag vX.Y.Z or run inside GitHub Actions.");
  }

  const tagVersion = parseReleaseTag(tag);

  if (currentVersion !== tagVersion) {
    throw new Error(`The checked out package version (${currentVersion}) does not match ${tag}.`);
  }

  console.log(`Publishing ${tagVersion} from ${tag}`);

  if (options.dryRun) {
    const distTag = resolveDistTag(tagVersion);
    printDryRunSummary(tagVersion, distTag, {
      ...options,
      publishTarget: "ci",
      skipGit: true,
      skipPush: true,
    });
    return;
  }

  runReleaseChecks();
  publishPackages(packages, tagVersion, {
    distTag: resolveDistTag(tagVersion),
    otp: options.otp,
    provenance: true,
  });
}

function printDryRunSummary(version, distTag, options) {
  console.log("");
  console.log("[dry-run] release checks:");
  console.log(`  pnpm exec vp check --no-lint ${releaseCheckTargets.join(" ")}`);
  console.log("  pnpm exec vp test run");
  console.log("  pnpm exec vp pack");

  if (options.publishTarget === "local") {
    console.log("");
    console.log("[dry-run] local publish:");
    for (const packageDirectory of packageDirectories) {
      const packageName = readJson(path.join(repoRoot, packageDirectory, "package.json")).name;
      const tagArgs = distTag ? ` --tag ${distTag}` : "";
      console.log(`  npm publish <tarball for ${packageName}> --access public${tagArgs}`);
    }
  }

  if (!options.skipGit) {
    console.log("");
    console.log("[dry-run] git:");
    console.log(`  git commit -m "chore(release): v${version}"`);
    console.log(`  git tag -a v${version} -m "v${version}"`);

    if (!options.skipPush) {
      console.log("  git push origin HEAD --follow-tags");
    }
  }
}

function readPublishedPackages() {
  return packageDirectories.map((directory) => {
    const manifestPath = path.join(repoRoot, directory, "package.json");
    const manifest = readJson(manifestPath);

    return {
      directory: path.join(repoRoot, directory),
      manifestPath,
      name: manifest.name,
      version: manifest.version,
    };
  });
}

function readSharedVersion(packages) {
  const versions = new Set(packages.map((pkg) => pkg.version));

  if (versions.size !== 1) {
    throw new Error(
      `Expected all published packages to share one version, found: ${[...versions].join(", ")}`,
    );
  }

  return packages[0].version;
}

function bumpVersion(version, releaseKind) {
  const parsed = parseVersion(version);

  if (stableReleaseKinds.has(releaseKind)) {
    return formatVersion(bumpStableRelease(parsed, releaseKind));
  }

  return formatVersion(bumpPrerelease(parsed, releaseKind));
}

function parseVersion(version) {
  const match =
    /^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)(?:-(?<preid>[0-9A-Za-z-]+)\.(?<prenumber>\d+))?$/.exec(
      version,
    );

  if (!match?.groups) {
    throw new Error(`Unsupported semver version: ${version}`);
  }

  return {
    major: Number(match.groups.major),
    minor: Number(match.groups.minor),
    patch: Number(match.groups.patch),
    prerelease: match.groups.preid
      ? {
          id: match.groups.preid,
          number: Number(match.groups.prenumber),
        }
      : null,
  };
}

function bumpStableRelease(parsed, releaseKind) {
  if (parsed.prerelease) {
    if (releaseKind === "patch") {
      return {
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch,
        prerelease: null,
      };
    }

    if (releaseKind === "minor" && parsed.patch === 0) {
      return {
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch,
        prerelease: null,
      };
    }

    if (releaseKind === "major" && parsed.minor === 0 && parsed.patch === 0) {
      return {
        major: parsed.major,
        minor: parsed.minor,
        patch: parsed.patch,
        prerelease: null,
      };
    }
  }

  if (releaseKind === "major") {
    return {
      major: parsed.major + 1,
      minor: 0,
      patch: 0,
      prerelease: null,
    };
  }

  if (releaseKind === "minor") {
    return {
      major: parsed.major,
      minor: parsed.minor + 1,
      patch: 0,
      prerelease: null,
    };
  }

  return {
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch + 1,
    prerelease: null,
  };
}

function bumpPrerelease(parsed, releaseKind) {
  if (parsed.prerelease?.id === releaseKind) {
    return {
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch,
      prerelease: {
        id: releaseKind,
        number: parsed.prerelease.number + 1,
      },
    };
  }

  if (parsed.prerelease) {
    return {
      major: parsed.major,
      minor: parsed.minor,
      patch: parsed.patch,
      prerelease: {
        id: releaseKind,
        number: 0,
      },
    };
  }

  return {
    major: parsed.major,
    minor: parsed.minor,
    patch: parsed.patch + 1,
    prerelease: {
      id: releaseKind,
      number: 0,
    },
  };
}

function formatVersion(version) {
  const base = `${version.major}.${version.minor}.${version.patch}`;

  if (!version.prerelease) {
    return base;
  }

  return `${base}-${version.prerelease.id}.${version.prerelease.number}`;
}

function resolveDistTag(version) {
  return parseVersion(version).prerelease?.id ?? null;
}

function parseReleaseTag(tag) {
  const match = /^v(.+)$/.exec(tag);

  if (!match) {
    throw new Error(`Release tags must start with "v": ${tag}`);
  }

  parseVersion(match[1]);
  return match[1];
}

function ensureCleanWorktree() {
  const result = run("git", ["status", "--short"], { capture: true });

  if (result.stdout.trim()) {
    throw new Error("Release requires a clean git worktree.");
  }
}

function runReleaseChecks() {
  console.log("");
  console.log("Running release checks");
  run("pnpm", ["exec", "vp", "check", "--no-lint", ...releaseCheckTargets]);
  run("pnpm", ["exec", "vp", "test", "run"]);
  run("pnpm", ["exec", "vp", "pack"]);
}

function updatePackageVersions(packages, nextVersion) {
  console.log("");
  console.log(`Writing package versions: ${nextVersion}`);

  for (const pkg of packages) {
    const manifest = readJson(pkg.manifestPath);
    manifest.version = nextVersion;
    writeJson(pkg.manifestPath, manifest);
    pkg.version = nextVersion;
  }
}

function ensureNpmLogin() {
  console.log("");
  console.log("Checking npm login");
  run("npm", ["whoami"]);
}

function publishPackages(packages, version, options) {
  console.log("");
  console.log("Publishing packages");

  resetArtifactDirectory();

  for (const pkg of packages) {
    if (isVersionPublished(pkg.name, version)) {
      console.log(`- ${pkg.name}@${version} is already published, skipping`);
      continue;
    }

    const tarballPath = createTarball(pkg);
    const publishArgs = ["publish", tarballPath, "--access", "public"];

    if (options.distTag) {
      publishArgs.push("--tag", options.distTag);
    }

    if (options.provenance) {
      publishArgs.push("--provenance");
    }

    if (options.otp) {
      publishArgs.push("--otp", options.otp);
    }

    run("npm", publishArgs);
  }
}

function resetArtifactDirectory() {
  rmSync(artifactDir, { recursive: true, force: true });
  mkdirSync(artifactDir, { recursive: true });
}

function createTarball(pkg) {
  const before = new Set(readdirSync(artifactDir));

  run("pnpm", ["pack", "--pack-destination", artifactDir], {
    cwd: pkg.directory,
  });

  const createdTarballs = readdirSync(artifactDir)
    .filter((entry) => entry.endsWith(".tgz") && !before.has(entry))
    .sort();

  if (createdTarballs.length !== 1) {
    throw new Error(
      `Expected exactly one tarball for ${pkg.name}, found: ${createdTarballs.join(", ") || "none"}`,
    );
  }

  return path.join(artifactDir, createdTarballs[0]);
}

function isVersionPublished(packageName, version) {
  const result = run("npm", ["view", `${packageName}@${version}`, "version", "--json"], {
    allowFailure: true,
    capture: true,
  });

  if (result.status === 0) {
    return true;
  }

  const output = `${result.stdout}\n${result.stderr}`;

  if (output.includes("E404") || output.includes("404 Not Found")) {
    return false;
  }

  throw new Error(`Failed to query npm for ${packageName}@${version}:\n${output}`);
}

function createReleaseCommit(packages, version) {
  console.log("");
  console.log("Creating release commit");

  run("git", ["add", "--", ...packages.map((pkg) => path.relative(repoRoot, pkg.manifestPath))]);
  run("git", ["commit", "-m", `chore(release): v${version}`]);
}

function createReleaseTag(version) {
  console.log("");
  console.log(`Creating git tag v${version}`);
  run("git", ["tag", "-a", `v${version}`, "-m", `v${version}`]);
}

function pushRelease() {
  console.log("");
  console.log("Pushing release commit and tag");
  run("git", ["push", "origin", "HEAD", "--follow-tags"]);
}

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function run(command, args, options = {}) {
  const cwd = options.cwd ?? repoRoot;
  const printable = [command, ...args].join(" ");

  console.log(`> ${printable}`);

  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8",
    env: {
      ...process.env,
      ...options.env,
    },
    stdio: options.capture ? "pipe" : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (!options.allowFailure && result.status !== 0) {
    throw new Error(`Command failed (${result.status}): ${printable}`);
  }

  return result;
}

try {
  main(process.argv.slice(2));
} catch (error) {
  console.error("");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
