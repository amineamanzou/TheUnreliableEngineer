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
se lance à chaque push sur `main` et peut aussi être lancé manuellement depuis
l'onglet **Actions**.

Si GitHub affiche une erreur du type `Invalid YAML front matter in
src/pages/index.astro`, c'est que Pages essaie de lancer Jekyll sur les sources
Astro. Repasser la source Pages sur **GitHub Actions**; les fichiers `.nojekyll`
servent de garde-fou pour l'artifact généré.
