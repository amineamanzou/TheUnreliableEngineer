# ADR 0002: CI/CD Security Baseline

## Status

Accepted

## Context

The production site is a static Astro application shipped as a Docker image to
GHCR and deployed by Ansible from the private infrastructure repository.

The repository needs a pragmatic DevSecOps baseline that gives evidence for
dependency, source, workflow, and container image checks without turning every
medium advisory into a delivery blocker.

## Decision

The CI/CD baseline uses critical-only blocking gates in V1:

- `npm audit --audit-level=critical`
- Dependency Review on pull requests with `fail-on-severity: critical`
- Trivy filesystem scan with SARIF upload and critical-only failure
- Trivy image scan before GHCR publication with critical-only failure
- Trivy scan of the pushed GHCR digest before signature and deployment
- Actionlint workflow validation
- CodeQL JavaScript/TypeScript analysis

The production workflow also emits Buildx SBOM/provenance and signs the pushed
image digest with keyless Sigstore/Cosign before the deploy job can consume it.
Manual production dispatch is restricted to the `main` ref.

High and medium findings stay visible but non-blocking in this baseline. They
are handled through maintenance rather than merge blocking.

## Consequences

The required GitHub checks for protected branches should include:

- `CI / Verify Astro site`
- `Security / npm audit`
- `Security / Dependency review`
- `Security / Trivy filesystem scan`
- `Security / Actionlint`
- `CodeQL / Analyze JavaScript and TypeScript`

The production deploy still depends on SSH reachability from the selected
runner to `ops-gw` and `web-prod`. That network execution model is explicitly
outside this ADR and should be handled as an infrastructure goal.
