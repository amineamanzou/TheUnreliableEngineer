import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const checkScriptUrl = new URL("./dependency-age-check.mjs", import.meta.url);
const lockfileDeclaration = 'const lockfilePath = new URL("../../package-lock.json", import.meta.url);';

test("queries an npm alias by its published package name", async () => {
  const tempDirectory = await mkdtemp(path.join(os.tmpdir(), "dependency-age-alias-"));
  const fixturePath = path.join(tempDirectory, "package-lock.json");
  const originalFetch = globalThis.fetch;
  const originalNow = process.env.DEPENDENCY_AGE_NOW;
  const requestedUrls = [];

  await writeFile(
    fixturePath,
    JSON.stringify({
      packages: {
        "node_modules/web-vitals-soft-navs": {
          name: "web-vitals",
          version: "6.0.0",
        },
      },
    }),
  );

  globalThis.fetch = async (url) => {
    requestedUrls.push(String(url));
    return new Response(
      JSON.stringify({ time: { "6.0.0": "2026-01-01T00:00:00.000Z" } }),
      { status: 200, headers: { "content-type": "application/json" } },
    );
  };
  process.env.DEPENDENCY_AGE_NOW = "2026-08-08T00:00:00.000Z";

  try {
    const source = await readFile(checkScriptUrl, "utf8");
    assert.ok(source.includes(lockfileDeclaration), "test harness could not locate the lockfile declaration");
    const fixtureDeclaration = `const lockfilePath = new URL(${JSON.stringify(pathToFileURL(fixturePath).href)});`;
    const instrumentedSource = source.replace(lockfileDeclaration, fixtureDeclaration);
    const moduleUrl = `data:text/javascript;base64,${Buffer.from(instrumentedSource).toString("base64")}#alias-test`;

    await import(moduleUrl);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalNow === undefined) delete process.env.DEPENDENCY_AGE_NOW;
    else process.env.DEPENDENCY_AGE_NOW = originalNow;
    await rm(tempDirectory, { recursive: true, force: true });
  }

  assert.deepEqual(requestedUrls, ["https://registry.npmjs.org/web-vitals"]);
});
