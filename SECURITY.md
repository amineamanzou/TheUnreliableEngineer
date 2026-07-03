# Security Policy

This repository contains the public static site for The Unreliable Engineer.

## Reporting Vulnerabilities

Please report sensitive vulnerabilities through GitHub private vulnerability reporting or a draft GitHub Security Advisory when that feature is available for this repository.

Do not open a public issue for exploitable vulnerabilities, secrets, account takeover paths, or other sensitive findings. Public issues are appropriate for non-sensitive hardening suggestions, documentation improvements, or defense-in-depth ideas that do not disclose an active risk.

There is no public bug bounty program or guaranteed response SLA for this repository. Maintainers will review reports on a best-effort basis and coordinate fixes before public disclosure when a confirmed issue affects the site or its delivery pipeline.

## Scope

In scope:

- Static site source code and build configuration in this repository.
- GitHub Actions workflows used to validate or publish the site.
- Dependency and supply-chain issues that affect the built site or CI/CD path.

## Supply Chain Policy

Routine dependency, GitHub Actions, and Docker image updates should not be
installed immediately after publication. Dependabot version updates use a
48-hour cooldown, and CI checks the npm lockfile before `npm ci` to reject npm
package versions published less than 48 hours ago.

Security updates remain allowed to bypass the cooldown when they remediate an
active vulnerability. In that case, the critical vulnerability gates, dependency
review, Trivy scans, CodeQL, signed Docker digest, and maintainer review still
apply.

## CI/CD Security Chain

The repository-side chain is:

1. Pull request checks validate Astro, i18n content, dependency release age,
   critical npm vulnerabilities, dependency review, Trivy filesystem scan,
   CodeQL, Plumber compliance, and Gitleaks.
2. After merge to `main`, the production workflow builds a local Docker image,
   generates Trivy SARIF, generates a CycloneDX image SBOM, and blocks on
   critical image vulnerabilities before publishing.
3. The published GHCR digest is scanned again, signed with Sigstore/Cosign, and
   verified before release metadata is emitted.
4. GitHub artifact attestations are created for image provenance and the
   CycloneDX SBOM, then provenance is verified with `gh attestation verify`.
5. The workflows upload structured JSON event artifacts:
   `cicd-event-security` and `cicd-event-production`. These artifacts are the
   repo-side contract for future ClickStack ingestion; no network shipping is
   performed by this repository yet.

Manual verification commands:

```bash
npm run compliance:plumber
npm run check:dependencies-age
gh attestation verify oci://ghcr.io/amineamanzou/the-unreliable-engineer@sha256:<digest> \
  --repo amineamanzou/TheUnreliableEngineer \
  --signer-workflow amineamanzou/TheUnreliableEngineer/.github/workflows/deploy-production.yml \
  --source-ref refs/heads/main \
  --source-digest <commit-sha> \
  --predicate-type https://slsa.dev/provenance/v1
cosign verify ghcr.io/amineamanzou/the-unreliable-engineer@sha256:<digest> \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com \
  --certificate-identity-regexp='^https://github.com/amineamanzou/TheUnreliableEngineer/\.github/workflows/deploy-production\.yml@refs/.+$'
```

The current gating policy is progressive. Secrets, critical dependency
vulnerabilities, critical image vulnerabilities, Cosign verification, and
production attestations are blocking. OpenSSF Scorecard starts as report-only so
the solo-maintainer workflow does not break on governance checks that are not
yet realistic for this repository.

Out of scope:

- Denial-of-service testing.
- Social engineering.
- Vulnerabilities in third-party services unless they are caused by this repository's configuration.
- Production infrastructure hardening that is not represented in this repository.
