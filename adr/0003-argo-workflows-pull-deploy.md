# ADR 0003: Argo Workflows Pull Deploy Pilot

## Status

Accepted for pilot.

## Context

The production workflow for `TheUnreliableEngineer` can build, scan, publish,
and sign immutable GHCR image digests. The previous deployment model then tried
to reach `web-prod` from GitHub-hosted runners over SSH, through `ops-gw`.

That execution model is fragile because the runner is outside the private
network. The desired experiment is a pull model where the bastion becomes the
internal deployment orchestrator.

## Decision

Use Argo Workflows on the existing bastion as the first pull-based control
plane.

GitHub Actions remains responsible for:

- application checks
- dependency release-age gate
- Trivy scans
- GHCR publication
- Buildx SBOM and provenance
- keyless Cosign signature and publication-side verification of the pushed
  digest

GitHub Actions no longer deploys production over SSH.

Argo Workflows on the bastion repeats signature verification before promoting a
digest to the existing `web-prod` Docker Compose runtime. The pilot is
intentionally release-only: it does not rerun Terraform, SOPS rendering, Docker
host baseline, Caddy bootstrap, fail2ban, Kopia, or observability roles.

## Runtime Contract

The pilot assumes `TheUnreliableInfrastructure` has already converged the
`web-prod` baseline under `/opt/web`.

Required files on `web-prod`:

- `/opt/web/compose.yaml`
- `/opt/web/.env`
- `/opt/web/.env.runtime`
- `/opt/web/sites/amineamanzou/compose.yaml`
- `/opt/web/sites/aminespired/compose.yaml`
- `/opt/web/sites/the-unreliable-engineer/compose.yaml`
- `/opt/web/sites-enabled/30-the-unreliable-engineer.caddy`

The only release-owned state is:

```env
THE_UNRELIABLE_ENGINEER_IMAGE=ghcr.io/amineamanzou/the-unreliable-engineer@sha256:<digest>
```

The first `.env.release` is created by the infrastructure bootstrap. Argo only
promotes from an already-known-good release to a new candidate digest.

## Consequences

Argo gives the operator UI for this model: parameters, retries, logs, failed
nodes, and historical runs.

The bastion now hosts a small Kubernetes runtime such as k3s and the Argo
Workflows controller. If this creates resource pressure, the bastion instance
can be resized before moving the control plane elsewhere.

The pilot does not require placing `SOPS_AGE_KEY` in Argo. Argo needs only GHCR
read credentials, a bastion-to-`web-prod` deployment key, and the pinned
`web-prod` SSH host key.

Argo CD is not introduced yet because the website runtime is still Docker
Compose, not Kubernetes-native.
