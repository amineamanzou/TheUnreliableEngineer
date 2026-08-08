# npm Alias Dependency Age Check Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the dependency age gate resolve npm aliases through their real registry package name without weakening age, reporting, or allowlist behavior.

**Architecture:** Keep the current lockfile traversal and network gate intact. When a lockfile record exposes a non-empty `metadata.name`, use it only for the registry request while retaining the installation-path name in the dependency identifier. Cover the behavior by executing the real script against an isolated lockfile fixture with a fake in-process registry response.

**Tech Stack:** Node.js 22 ESM, `node:test`, npm lockfile v3, GitHub Actions.

## Global Constraints

- Do not change dependency versions, workflow files, age thresholds, concurrency, allowlists, or error semantics.
- Preserve installation-path names in dependency identifiers and allowlist keys.
- Use the lockfile `name` field only when it is a non-empty string; otherwise retain the current path-derived registry name.
- The regression test must not contact the network or modify the repository lockfile.
- Wire the regression test into every existing `check:dependencies-age` invocation.

---

### Task 1: Add the npm alias regression test and minimal fix

**Files:**
- Create: `scripts/qa/dependency-age-check.test.mjs`
- Modify: `scripts/qa/dependency-age-check.mjs:20-32`
- Modify: `package.json:18-20`

**Interfaces:**
- Consumes: npm lockfile v3 entries shaped as `{ name?: string, version: string }` and the existing dependency-age script.
- Produces: registry requests that use the published package name for aliases while leaving `${installName}@${version}` identifiers unchanged.

- [ ] **Step 1: Write the failing integration-style unit test**

Create `scripts/qa/dependency-age-check.test.mjs`:

```js
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
```

- [ ] **Step 2: Run the test and prove the current behavior is red**

Run:

```bash
node --test scripts/qa/dependency-age-check.test.mjs
```

Expected: one failed assertion showing the actual request ends in `/web-vitals-soft-navs` while the expected request ends in `/web-vitals`.

- [ ] **Step 3: Implement the minimal lookup-name distinction**

In `scripts/qa/dependency-age-check.mjs`, replace the existing map insertion:

```js
const id = `${name}@${metadata.version}`;
dependencyVersions.set(id, { name, version: metadata.version });
```

with:

```js
const registryName = typeof metadata.name === "string" && metadata.name.trim() ? metadata.name : name;
const id = `${name}@${metadata.version}`;
dependencyVersions.set(id, { name: registryName, version: metadata.version });
```

- [ ] **Step 4: Run the regression test and prove the behavior is green**

Run:

```bash
node --test scripts/qa/dependency-age-check.test.mjs
```

Expected: one test passes, zero fail.

- [ ] **Step 5: Wire the regression test into the existing gate**

Update only these package scripts:

```json
"test:dependency-age": "node --test scripts/qa/dependency-age-check.test.mjs",
"check:dependencies-age": "npm run test:dependency-age && node scripts/qa/dependency-age-check.mjs"
```

- [ ] **Step 6: Verify the focused gate against the real lockfile**

Run:

```bash
npm run check:dependencies-age
```

Expected: the regression test passes first, then the live registry age check passes for all locked packages.

- [ ] **Step 7: Commit the tested fix**

```bash
git add package.json scripts/qa/dependency-age-check.mjs scripts/qa/dependency-age-check.test.mjs
git commit -m "fix: support npm aliases in dependency age checks"
```

---

### Task 2: Verify and publish the focused pull request

**Files:**
- Verify: `package.json`
- Verify: `scripts/qa/dependency-age-check.mjs`
- Verify: `scripts/qa/dependency-age-check.test.mjs`
- Verify: `docs/superpowers/specs/2026-08-08-dependency-age-npm-alias-design.md`
- Verify: `docs/superpowers/plans/2026-08-08-dependency-age-npm-alias.md`

**Interfaces:**
- Consumes: the tested alias-aware dependency age gate from Task 1.
- Produces: one reviewable pull request against `main` with no dependency or workflow changes.

- [ ] **Step 1: Run repository verification**

```bash
node --version
npm run check:dependencies-age
npm run check
npm run check:i18n
SITE_URL=https://theunreliable.engineer BASE_PATH=/ npm run build
npm audit --omit=dev --audit-level=high
```

Expected: Node reports a 22.x release and every command exits 0.

- [ ] **Step 2: Verify final scope**

```bash
git diff --check origin/main...HEAD
git diff --name-only origin/main...HEAD
git status --short --branch
```

Expected implementation and design files only; the worktree is clean.

- [ ] **Step 3: Push and open a draft pull request**

```bash
git push -u origin codex/dependency-age-alias-support
```

Open a draft PR titled `fix: support npm aliases in dependency age checks`. Report the #64 failure signature, the red-green regression proof, the unchanged age/allowlist semantics, and the complete local verification results.

- [ ] **Step 4: Wait for all required GitHub checks**

Required results: Verify Astro site, dependency release age, npm audit, dependency review, Gitleaks, Trivy, Actionlint, OpenSSF Scorecard, Plumber compliance and CodeQL. Keep the PR in draft while any check is pending or failing.

## Self-Review Result

- Spec coverage: alias lookup, fallback behavior, stable identifiers, test isolation, gate wiring and publication are covered.
- Placeholder scan: no implementation placeholders remain.
- Interface consistency: the test exercises the real script; the production change only alters the registry lookup name.
- Scope: no dependency, workflow, threshold, concurrency or allowlist changes are included.
