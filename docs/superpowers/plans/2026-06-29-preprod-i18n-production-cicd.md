# Preprod I18n Production CICD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move GitHub Pages to a `dev` preproduction branch, add full FR/EN static i18n including blog articles, and prepare `main` for Docker image build plus Ansible deployment to TheUnreliableInfrastructure.

**Architecture:** Keep Astro static. Preserve French URLs at `/` and `/blog/...`, add English under `/en/`, and use a tiny client locale redirect only from the French root when the visitor has not chosen a locale. GitHub Pages becomes a single preprod surface fed by `dev`; production is a Docker image promoted from `main` and deployed by the infrastructure Ansible playbooks with an immutable image reference.

**Tech Stack:** Astro 5 static output, GitHub Actions, GitHub Pages, Docker/Caddy, GHCR, Ansible in `/Users/amine/Projects/TheUnreliableInfrastructure`.

---

### Task 1: GitHub Pages Preprod On `dev`

**Files:**
- Modify: `.github/workflows/deploy-pages.yml`
- Verify: `astro.config.mjs`

- [ ] **Step 1: Change Pages trigger to `dev`**

Set the workflow trigger to:

```yaml
on:
  push:
    branches: [dev]
  workflow_dispatch:
```

Keep the existing `GITHUB_PAGES`, `SITE_URL`, and `BASE_PATH` build env values.

- [ ] **Step 2: Rename the environment label**

Set the deploy environment name to `github-pages-preprod` while keeping `actions/deploy-pages@v4`.

- [ ] **Step 3: Verify the Pages build locally**

Run:

```bash
GITHUB_PAGES=true SITE_URL=https://amineamanzou.github.io BASE_PATH=/TheUnreliableEngineer npm run build
```

Expected: `5 page(s) built` until i18n adds more routes.

- [ ] **Step 4: Create and push `dev` after main is clean**

Run:

```bash
git switch -c dev
git push -u origin dev
```

Expected: GitHub Pages deploys from `dev` to `https://amineamanzou.github.io/TheUnreliableEngineer/`.

### Task 2: Neutral CI For All Branches

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Add CI workflow**

Create:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main, dev]

permissions:
  contents: read

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Astro check
        run: npm run check

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Verify locally**

Run:

```bash
npm run check
npm run build
```

Expected: both commands exit 0.

### Task 3: Docker Image Contract

**Files:**
- Modify: `Dockerfile`
- Modify: `.dockerignore`
- Modify: `ops/Caddyfile`

- [ ] **Step 1: Add build args and OCI labels**

Add `ARG SITE_URL`, `ARG BASE_PATH`, and `ARG VCS_REF` in the build stage. Pass `SITE_URL` and `BASE_PATH` into `npm run build` via env. Add OCI labels to the Caddy stage using `VCS_REF`.

- [ ] **Step 2: Add `/healthz` route**

In `ops/Caddyfile`, add:

```caddy
  respond /healthz 200
```

inside `:8080`.

- [ ] **Step 3: Keep Docker context small**

Ensure `.dockerignore` excludes:

```gitignore
.astro
artifacts
coverage
docs
node_modules
dist
```

- [ ] **Step 4: Verify image locally**

Run:

```bash
docker build --build-arg SITE_URL=https://theunreliable.engineer --build-arg BASE_PATH=/ --build-arg VCS_REF=local -t the-unreliable-engineer:local .
docker run --rm -p 8080:8080 the-unreliable-engineer:local
curl -I http://127.0.0.1:8080/healthz
```

Expected: `/healthz` returns `200`.

### Task 4: Production Docker Build Workflow

**Files:**
- Create: `.github/workflows/deploy-production.yml`

- [ ] **Step 1: Add GHCR build/push on `main` and manual dispatch**

Workflow outline:

```yaml
name: Deploy Production

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  packages: write

env:
  IMAGE_NAME: ghcr.io/${{ github.repository_owner }}/the-unreliable-engineer

jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      image: ${{ steps.meta.outputs.image }}
      digest: ${{ steps.build.outputs.digest }}
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - id: meta
        run: echo "image=${IMAGE_NAME}" >> "$GITHUB_OUTPUT"
      - id: build
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            ${{ env.IMAGE_NAME }}:main
            ${{ env.IMAGE_NAME }}:${{ github.sha }}
          build-args: |
            SITE_URL=https://theunreliable.engineer
            BASE_PATH=/
            VCS_REF=${{ github.sha }}
```

- [ ] **Step 2: Keep Ansible deployment gated until infra contract lands**

Add a second job only after TheUnreliableInfrastructure accepts `THE_UNRELIABLE_ENGINEER_IMAGE=<image>@<digest>`. Until then, expose the digest as workflow output and do not SSH from this app repo.

### Task 5: I18n Foundation

**Files:**
- Modify: `astro.config.mjs`
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/components/Topbar.astro`
- Create: `src/i18n/config.ts`
- Create: `src/i18n/paths.ts`
- Create: `src/components/LocaleRedirect.astro`
- Create: `src/components/LanguageSwitcher.astro`

- [ ] **Step 1: Add Astro i18n config**

Configure:

```ts
i18n: {
  locales: ["fr", "en"],
  defaultLocale: "fr",
  routing: {
    prefixDefaultLocale: false,
  },
}
```

- [ ] **Step 2: Make layout locale-aware**

`BaseLayout` receives `lang`, defaults to `fr`, and renders `<html lang={lang}>`.

- [ ] **Step 3: Remove hard dependency from Topbar to `homepageFr`**

Pass `topbar`, `locale`, and `home` as props.

- [ ] **Step 4: Add language switcher**

Render links between equivalent FR and EN routes. Use `/` ↔ `/en/`, `/blog/slug/` ↔ `/en/blog/slug/`.

- [ ] **Step 5: Add cautious locale redirect**

Only on `/`, if there is no stored locale and `navigator.languages` prefers English, redirect to `/en/`. Store explicit choice in `localStorage`.

### Task 6: Translate Homepage FR/EN

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/pages/en/index.astro`
- Modify: `src/data/homepage.fr.ts`
- Create: `src/data/homepage.en.ts`
- Create: `src/views/HomePage.astro`

- [ ] **Step 1: Extract reusable homepage view**

Move current page markup to `src/views/HomePage.astro`, accepting `page` and `locale`.

- [ ] **Step 2: Keep French root stable**

`src/pages/index.astro` imports `homepageFr`, renders `HomePage`, and includes `LocaleRedirect`.

- [ ] **Step 3: Add English page**

`src/pages/en/index.astro` imports `homepageEn`, renders `HomePage`, and does not redirect.

- [ ] **Step 4: Translate all homepage copy**

Translate every visible string from `homepage.fr.ts` into `homepage.en.ts`, preserving structure and proof governance.

### Task 7: Translate Blog FR/EN

**Files:**
- Modify: `src/content/config.ts`
- Move: `src/content/articles/*.md`
- Create: `src/content/articles/fr/*.mdx`
- Create: `src/content/articles/en/*.mdx`
- Create: `src/views/BlogIndexPage.astro`
- Create: `src/views/ArticlePage.astro`
- Create: `src/pages/en/blog.astro`
- Create: `src/pages/en/blog/[slug].astro`

- [ ] **Step 1: Add content schema fields**

Add `locale`, `translationKey`, and `slug` to article frontmatter.

- [ ] **Step 2: Preserve French routes**

French article pages still generate `/blog/<slug>/`.

- [ ] **Step 3: Add English routes**

English article pages generate `/en/blog/<slug>/`.

- [ ] **Step 4: Translate all articles**

Translate the two current articles completely. Reuse the same local images and source URLs.

- [ ] **Step 5: Verify parity**

Add `scripts/review-i18n.mjs` to assert every `translationKey` has both `fr` and `en`, and every rendered page has correct `lang`, switch links, and no missing images above fold.

### Task 8: Infra Ansible Contract

**Files in TheUnreliableInfrastructure, not this repo:**
- Modify: `runtime/web/compose.yaml`
- Modify: `runtime/web/Caddyfile` or site snippets
- Modify: `inventories/prod/group_vars/web.yml`
- Modify: `roles/web_runtime/tasks/main.yml`

- [ ] **Step 1: Add site service**

Add a service such as:

```yaml
the-unreliable-engineer:
  image: ${THE_UNRELIABLE_ENGINEER_IMAGE:?Set THE_UNRELIABLE_ENGINEER_IMAGE}
  restart: unless-stopped
  read_only: true
  networks:
    - web-public
```

- [ ] **Step 2: Point upstream**

Set `WEB_PRIMARY_UPSTREAM=the-unreliable-engineer:8080` for the production host once DNS and Caddy routes are ready.

- [ ] **Step 3: Add image release env**

Render `/opt/web/.env.release` containing `THE_UNRELIABLE_ENGINEER_IMAGE=ghcr.io/...@sha256:<digest>` and include it in `docker compose config` and `up`.

- [ ] **Step 4: Dry-run then deploy**

Run from the infra repo:

```bash
ANSIBLE_LOCAL_TEMP=/tmp/ansible-local ANSIBLE_REMOTE_TEMP=/tmp/ansible-remote ANSIBLE_HOME=/tmp/ansible-home HOME=/tmp/ansible-home .venv-ansible/bin/ansible-playbook playbooks/web-prod.yml --check --diff
```

Expected: no secret lookup failures and a clear compose diff.

### Task 9: Completion Verification

**Files:**
- Verify all touched files.

- [ ] **Step 1: Local checks**

Run:

```bash
npm run check
npm run build
GITHUB_PAGES=true SITE_URL=https://amineamanzou.github.io BASE_PATH=/TheUnreliableEngineer npm run build
npm run review:homepage -- http://127.0.0.1:<port>/
npm run review:blog -- http://127.0.0.1:<port>/blog/
npm run review:i18n -- http://127.0.0.1:<port>/
```

- [ ] **Step 2: Docker smoke**

Run:

```bash
docker build -t the-unreliable-engineer:local .
docker run --rm -p 8080:8080 the-unreliable-engineer:local
curl -I http://127.0.0.1:8080/healthz
```

- [ ] **Step 3: Remote checks**

Verify:

```bash
curl -I https://amineamanzou.github.io/TheUnreliableEngineer/
curl -I https://theunreliable.engineer/healthz
```

Expected: both return `200` after their respective deployments.
