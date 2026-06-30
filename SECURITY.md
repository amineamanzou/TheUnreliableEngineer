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

Out of scope:

- Denial-of-service testing.
- Social engineering.
- Vulnerabilities in third-party services unless they are caused by this repository's configuration.
- Production infrastructure hardening that is not represented in this repository.
