#!/usr/bin/env node
import { readFile } from "node:fs/promises";

const lockfilePath = new URL("../../package-lock.json", import.meta.url);
const minAgeHours = Number.parseFloat(process.env.DEPENDENCY_MIN_AGE_HOURS ?? "48");
const now = process.env.DEPENDENCY_AGE_NOW ? new Date(process.env.DEPENDENCY_AGE_NOW) : new Date();
const allowlist = new Set(
  (process.env.DEPENDENCY_AGE_ALLOWLIST ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean),
);

if (!Number.isFinite(minAgeHours) || minAgeHours <= 0) {
  throw new Error(`DEPENDENCY_MIN_AGE_HOURS must be a positive number, got ${process.env.DEPENDENCY_MIN_AGE_HOURS}`);
}

if (Number.isNaN(now.getTime())) {
  throw new Error(`DEPENDENCY_AGE_NOW is not a valid date: ${process.env.DEPENDENCY_AGE_NOW}`);
}

const lockfile = JSON.parse(await readFile(lockfilePath, "utf8"));
const packages = lockfile.packages ?? {};
const dependencyVersions = new Map();

for (const [path, metadata] of Object.entries(packages)) {
  if (!path || !metadata || typeof metadata !== "object") continue;
  if (!path.includes("node_modules/")) continue;
  if (!metadata.version || typeof metadata.version !== "string") continue;

  const name = path.split("node_modules/").at(-1);
  if (!name || name.includes("node_modules/")) continue;

  const id = `${name}@${metadata.version}`;
  dependencyVersions.set(id, { name, version: metadata.version });
}

const ids = [...dependencyVersions.keys()].sort((left, right) => left.localeCompare(right));
const violations = [];
const missing = [];

async function fetchPackageMetadata(name) {
  const encodedName = encodeURIComponent(name).replace(/^%40/, "@");
  const response = await fetch(`https://registry.npmjs.org/${encodedName}`, {
    headers: {
      accept: "application/json",
      "user-agent": "the-unreliable-engineer-dependency-age-check",
    },
  });

  if (!response.ok) {
    throw new Error(`npm registry returned ${response.status} for ${name}`);
  }

  return response.json();
}

async function checkDependency(id) {
  if (allowlist.has(id)) return;

  const dependency = dependencyVersions.get(id);
  const metadata = await fetchPackageMetadata(dependency.name);
  const publishedAt = metadata.time?.[dependency.version];

  if (!publishedAt) {
    missing.push(id);
    return;
  }

  const publishedDate = new Date(publishedAt);
  const ageHours = (now.getTime() - publishedDate.getTime()) / 3_600_000;

  if (ageHours < minAgeHours) {
    violations.push({
      id,
      publishedAt,
      ageHours,
    });
  }
}

const concurrency = Number.parseInt(process.env.DEPENDENCY_AGE_CONCURRENCY ?? "8", 10);
const workers = Array.from({ length: Math.max(1, concurrency) }, async (_, workerIndex) => {
  for (let index = workerIndex; index < ids.length; index += Math.max(1, concurrency)) {
    await checkDependency(ids[index]);
  }
});

await Promise.all(workers);

if (missing.length > 0 || violations.length > 0) {
  if (violations.length > 0) {
    console.error(`Dependencies published less than ${minAgeHours}h ago:`);
    for (const violation of violations.sort((left, right) => left.id.localeCompare(right.id))) {
      console.error(`- ${violation.id}: ${violation.ageHours.toFixed(1)}h old, published at ${violation.publishedAt}`);
    }
  }

  if (missing.length > 0) {
    console.error("Dependencies without npm publish timestamp:");
    for (const id of missing.sort((left, right) => left.localeCompare(right))) {
      console.error(`- ${id}`);
    }
  }

  process.exit(1);
}

console.log(`Dependency age check passed: ${ids.length} locked npm packages are at least ${minAgeHours}h old.`);
