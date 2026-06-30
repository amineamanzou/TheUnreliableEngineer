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

Out of scope:

- Denial-of-service testing.
- Social engineering.
- Vulnerabilities in third-party services unless they are caused by this repository's configuration.
- Production infrastructure hardening that is not represented in this repository.
