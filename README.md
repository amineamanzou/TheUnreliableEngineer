# The Unreliable Engineer

Bilingual French/English static website built with Astro and served by Caddy.

## Development

```sh
npm ci
npm run check
npm run check:i18n
SITE_URL=https://theunreliable.engineer BASE_PATH=/ npm run build
npm run check:seo
npm run review:static
```

Run `npm run dev` for the local development server.

## Public repository scope

This repository contains website source code, public assets, article content,
and the public build and delivery contract. Follow [AGENTS.md](AGENTS.md) for
language and contribution rules. Engineering material is written in English;
website content is maintained in French and English.

Internal planning, editorial strategy, and agent working material belong in
private storage. CI rejects tracked files in reserved private directories,
even when they were force-added despite ignore rules. This path check does not
replace reviewing file contents for sensitive information.

Article frontmatter controls the publication date. Scheduled articles committed
to this repository are publicly readable before they appear on the website.

## Delivery

GitHub Actions validates the site and builds, scans, signs, and publishes an
immutable production image to GHCR. Runtime promotion is managed outside this
repository. GitHub Pages previews use the separate Pages workflow.

Browser observability and product analytics use explicit visitor consent. See
`.env.example` for the public build configuration and the website privacy pages
for the visitor-facing contract. Never use server credentials in browser code.
