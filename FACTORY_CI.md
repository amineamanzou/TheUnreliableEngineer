# Development and validation contract

Work branches target `dev`. `main` stays protected. Preserve both long-lived branches and their ancestry. Use Conventional Commits and isolated worktrees for concurrent tasks. Ordinary product pull requests require human approval.

The Factory controller may merge its own promotion pull request once required GitHub checks, independent review and staging E2E and performance checks pass for the exact candidate and staging has returned to idle. It signs the qualification before merging. The [production workflow](.github/workflows/deploy-production.yml) verifies the signed qualification and publishes the same image digest. The controller verifies production delivery against that digest.

Run application tests on the Mac in an isolated worktree. `.factory/ci.json` declares the repository-specific native recipe and its qualification state. The recipe builds with the canonical site URL and base path before checking SEO output. The native recipe requires its own qualification receipt. No generic GitHub runner is installed on the Mac.

Keep Linux checks, container and runtime checks, vulnerability scanning, SBOMs, signatures and delivery verification in GitHub. The `Factory contract` job validates branch and recipe metadata. Existing required checks stay in force.

A local receipt must identify the repository, remote HEAD, base, recipe revision, toolchain, commands, results and artifact digests. Verify the receipt before using it for merge admission. Dependabot may merge only with qualified passing tests, fresh green required CI and repository protections satisfied for the exact head.

Validation stays separate from publishing and deployment. The default-branch Dependabot configuration targets `dev`. Preserve its current package ecosystems, grouping and protections.
