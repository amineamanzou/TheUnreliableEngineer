# The Unreliable Engineer

Dépôt technique du site de marque.

La V1 est un site statique Astro en français. La V2 ajoutera l'internationalisation.

## Surfaces versionnées

- [ADR V1 architecture](adr/0001-v1-web-architecture.md)
- [Homepage Astro](src/pages/index.astro)
- [Données homepage FR](src/data/homepage.fr.ts)
- [Styles globaux](src/styles/global.css)
- [Runtime container](Dockerfile)
- [Runtime Caddy](ops/Caddyfile)

## Choix V1

- Astro
- site statique
- pas de SSR
- pas de backend
- pas de base de données
- pas de React en V1
- couche client minimale
- rendez-vous via Google Calendar / Meet externe
- runtime statique minimal derrière Caddy

## Contenu local non versionné

Les documents de spécification, de design et les prototypes de travail restent en local et sont exclus du dépôt via `.gitignore`.

Concrètement :

- `docs/`
- `prototypes/`

## Règles de dépôt

- conventional commits
- commits réguliers et ciblés
- trace technique conservée dans le dépôt versionné
- documentation de conception gardée hors GitHub pour cette V1

## Prochaines étapes

1. Installer les dépendances et valider le build Astro.
2. Remplacer les placeholders du hero, des missions et des témoignages.
3. Brancher l'URL réelle de prise de rendez-vous Google.
4. Générer les premiers assets du hero.

## Preview GitHub Pages

Le workflow `.github/workflows/deploy-pages.yml` publie la version statique sur
GitHub Pages pour prévisualisation:

`https://amineamanzou.github.io/TheUnreliableEngineer/`

Avant la première publication, ouvrir les settings du repository sur GitHub,
aller dans **Pages**, puis choisir **GitHub Actions** comme source. Le workflow
sert de préproduction et se lance à chaque push sur `dev`; il peut aussi être
lancé manuellement depuis l'onglet **Actions**.

Si GitHub affiche une erreur du type `Invalid YAML front matter in
src/pages/index.astro`, c'est que Pages essaie de lancer Jekyll sur les sources
Astro. Repasser la source Pages sur **GitHub Actions**; les fichiers `.nojekyll`
servent de garde-fou pour l'artifact généré.

## Déploiement production

Le workflow `.github/workflows/deploy-production.yml` se lance sur `main`.
Il valide Astro, construit une image Docker locale, bloque la publication si
Trivy trouve une vulnérabilité critique, puis pousse l'image sur GHCR. Le digest
GHCR réellement publié est ensuite scanné à son tour avant signature. Le build
publié émet SBOM et provenance Buildx, et le digest est signé puis vérifié avec
Sigstore/Cosign. Deux builds Docker sont utilisés: le premier alimente le scan
local avant publication, le second produit le digest immutable publié et signé.
Un dispatch manuel production n'est accepté que sur la référence `main`.

Le déploiement production est piloté depuis le bastion par Argo Workflows, en
mode pull depuis GHCR. Le runbook du pilote est dans
[`ops/argo-workflows/README.md`](ops/argo-workflows/README.md), et la décision
est documentée dans [ADR 0003](adr/0003-argo-workflows-pull-deploy.md).

Le dépôt infra doit contenir le contrat Ansible `web_runtime` introduit par le
commit `348605b` ou plus récent. La production n'accepte qu'une image sous forme
`ghcr.io/amineamanzou/the-unreliable-engineer@sha256:<digest>`.

La joignabilité SSH depuis les runners GitHub hébergés n'est plus requise pour
publier une release. Le bastion devient le point d'orchestration interne.

## Baseline sécurité CI/CD

Le socle DevSecOps est documenté dans
[ADR 0002](adr/0002-ci-cd-security-baseline.md). La V1 bloque les
vulnérabilités critiques, publie les résultats SARIF dans GitHub Security,
active CodeQL et Dependabot, et signe le digest Docker publié avant
déploiement. Le blocage des secrets doit être activé côté GitHub avec Secret
Scanning et Push Protection.

La conformité CI/CD ajoute Plumber avec un seuil de 100, protection de `main`
contre le force-push et la suppression, et un gate supply-chain qui refuse les
versions npm publiées depuis moins de 48 heures avant toute installation
`npm ci`. La protection n'impose pas de review CODEOWNERS: ce dépôt est maintenu
par un maintainer solo.
