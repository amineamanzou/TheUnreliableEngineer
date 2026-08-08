# npm Alias Support for the Dependency Age Gate

## Context

The dependency age gate derives a registry package name from each `package-lock.json` installation path. This works for ordinary entries, but npm aliases use an installation name that differs from the published package name. For example, PostHog installs `web-vitals` as `web-vitals-soft-navs`; the lockfile key is `node_modules/web-vitals-soft-navs` while its metadata contains `"name": "web-vitals"`. The current gate queries the npm registry for the alias and receives a 404.

## Decision

Keep the installation name for the gate's stable dependency identifier and allowlist semantics, but use `metadata.name` as the registry lookup name when it is a non-empty string. Fall back to the installation name for ordinary lockfile records.

This preserves all existing behavior for non-aliased packages, keeps reports understandable in terms of the installed tree, and resolves aliases using information npm already records in lockfile v3.

## Alternatives Considered

1. **Selected: targeted lookup-name fallback in the existing script.** Smallest production change and no new runtime abstraction.
2. **Extract lockfile traversal into a new production module.** Easier to unit-test directly, but adds an unnecessary module and refactor for a one-line behavioral distinction.
3. **Allowlist `web-vitals-soft-navs`.** Avoids the 404 but disables the supply-chain age check for that dependency and fails for future aliases.

## Testing

Add a Node test that executes the real dependency-age script against an isolated lockfile fixture containing an aliased package. A fake registry records the requested URL and returns an old publish timestamp. The test must first fail because the current script requests `web-vitals-soft-navs`, then pass after the fix because it requests `web-vitals`.

Wire the regression test into `check:dependencies-age` so every existing CI consumer exercises it before the live registry scan. The test must not contact the network or mutate the repository lockfile.

## Scope

Expected implementation files:

- `package.json`
- `scripts/qa/dependency-age-check.mjs`
- `scripts/qa/dependency-age-check.test.mjs`

No dependency versions, workflows, allowlists, age thresholds, concurrency settings, or failure semantics change.

## Acceptance Criteria

- npm alias entries query the registry using their real published package name.
- ordinary package entries retain current behavior.
- alias identifiers remain based on the installed alias name for reporting and allowlists.
- the regression test demonstrates red then green behavior.
- `npm run check:dependencies-age`, `npm run check`, the production build, and `npm audit` pass.
