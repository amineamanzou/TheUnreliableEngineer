# Argo Workflows Pull Deploy Pilot

This runbook describes the pilot pull-deploy model for
`TheUnreliableEngineer`.

The goal is to stop deploying production from GitHub-hosted runners over SSH.
GitHub Actions publishes a signed GHCR image digest. The bastion hosts Argo
Workflows and pulls the release from inside the private network.

## Responsibilities

GitHub Actions remains responsible for:

- Astro checks and build
- dependency release-age gate
- Trivy filesystem and image scans
- GHCR push
- Cosign keyless signature on the pushed digest

Argo Workflows on the bastion becomes responsible for:

- resolving `ghcr.io/amineamanzou/the-unreliable-engineer:main` to a digest
- verifying the Cosign signature
- running a critical-only Trivy image gate
- promoting the digest on `web-prod`
- storing run logs, status, retries, and failures in the Argo UI

`TheUnreliableInfrastructure` remains responsible for the host baseline:

- Docker and Docker Compose
- `/opt/web` runtime assets
- Caddy snippets
- observability
- backups
- SOPS-rendered runtime secrets

The pilot does not move `SOPS_AGE_KEY` into Argo.

## Bastion Setup

The bastion should host a small Kubernetes runtime such as k3s and Argo
Workflows. The Argo UI must stay private: VPN, private network, or an
operator-only tunnel. Do not expose it publicly.

Apply the workflow bundle:

```bash
kubectl apply -f ops/argo-workflows/the-unreliable-engineer-pull-deploy.yaml
```

## Required Secrets

Create the GHCR pull secret used by the resolver, Trivy, and the deploy step:

```bash
kubectl -n the-unreliable-deploy create secret generic the-unreliable-engineer-ghcr \
  --from-literal=username="$GHCR_USERNAME" \
  --from-literal=token="$GHCR_READ_TOKEN"
```

Create the SSH secret used from the bastion network to `web-prod`:

```bash
ssh-keyscan -t ed25519 10.42.1.30 > /tmp/web-prod-known_hosts
# Verify this fingerprint against a trusted console or existing host inventory
# before creating the Kubernetes secret.

kubectl -n the-unreliable-deploy create secret generic the-unreliable-engineer-web-prod-ssh \
  --from-file=id_ed25519=/path/to/bastion-to-web-prod-ed25519 \
  --from-file=known_hosts=/tmp/web-prod-known_hosts
```

Prefer a narrow bastion-only key. The key only needs to reach `root@10.42.1.30`
or the final deployment user selected for `web-prod`. The workflow uses strict
SSH host key checking; do not replace the `known_hosts` value with an
unverified scan if the host key changes unexpectedly.

## Manual Deployment

Run the latest `main` image:

```bash
argo -n the-unreliable-deploy submit \
  --from workflowtemplate/the-unreliable-engineer-pull-deploy \
  -p tag=main
```

Run a specific immutable digest:

```bash
argo -n the-unreliable-deploy submit \
  --from workflowtemplate/the-unreliable-engineer-pull-deploy \
  -p image-ref=ghcr.io/amineamanzou/the-unreliable-engineer@sha256:<digest>
```

Rollback is the same command with an older known-good digest.

## Automatic Polling

The included `CronWorkflow` checks `main` every 15 minutes:

```bash
kubectl -n the-unreliable-deploy get cronworkflow
```

The concurrency policy is `Forbid`, so a slow deployment blocks the next
scheduled run instead of overlapping with it.

## Workflow Steps

1. Resolve or validate an immutable image reference.
2. Verify the GitHub Actions keyless Cosign signature.
3. Run a critical-only Trivy gate.
4. Log in to GHCR over SSH without leaving a token file on `web-prod`.
5. Copy `/opt/web/.env.release.candidate` to `web-prod`.
6. Run `docker compose config -q` with the candidate env file.
7. Run `docker compose up -d --no-deps the-unreliable-engineer` with the
   candidate env file.
8. Check the container-local `/healthz` endpoint.
9. Roll back to the previous `.env.release` if the candidate healthcheck fails.
10. Promote the candidate to `/opt/web/.env.release`.
11. Check the public `https://theunreliable.engineer/healthz` endpoint.

If any step fails, Argo keeps the failed node and logs visible in the UI.

If the requested digest is already active, the deploy step exits without running
Docker Compose again.

## Runtime Contract

The workflow assumes the `web-prod` baseline already exists:

- `/opt/web/compose.yaml`
- `/opt/web/.env`
- `/opt/web/.env.runtime`
- `/opt/web/sites/amineamanzou/compose.yaml`
- `/opt/web/sites/aminespired/compose.yaml`
- `/opt/web/sites/the-unreliable-engineer/compose.yaml`
- `/opt/web/sites-enabled/30-the-unreliable-engineer.caddy`

If those files are missing, rerun the infrastructure playbook from
`TheUnreliableInfrastructure` before using Argo for releases.

The first `/opt/web/.env.release` must already exist before this workflow runs.
This keeps Argo in the release-promotion role and leaves the initial bootstrap
to the infrastructure playbook.

## Why Not Argo CD Yet

Argo CD is a better fit once the runtime is Kubernetes-native. This pilot keeps
Docker Compose on `web-prod`, so Argo Workflows is the smaller control plane:
it provides UI, history, retries, parameters, and logs without forcing a runtime
migration.

## Sizing Note

Start with the existing bastion. If k3s plus Argo Workflows causes memory or CPU
pressure, upgrade the bastion instance before moving Argo elsewhere.

## Tool Image Pinning

The workflow pins its tool containers by linux/amd64 digest:

- `alpine:3.22`
- `ghcr.io/sigstore/cosign/cosign:v3.0.2`
- `aquasec/trivy:0.66.0`

If the bastion moves to ARM, repin those images for the target architecture
before applying the manifest.
