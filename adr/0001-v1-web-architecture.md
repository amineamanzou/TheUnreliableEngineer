# ADR 0001 - Architecture web V1

## Statut

Accepté

## Contexte

La V1 est un site vitrine de marque.

Contraintes explicites :

- site statique
- pas de SSR
- pas de backend
- pas de base de données
- pas de secrets côté serveur
- V1 en français
- V2 avec internationalisation
- intégration de prise de rendez-vous via Google Calendar / Google Meet par lien ou embed externe
- couche client minimale
- pas de React en V1
- pas de framework d'état client
- pas de SPA
- animations d'abord en CSS, WAAPI seulement pour quelques détails
- pas de GSAP en V1
- runtime conteneurisé avec build Node et serveur statique minimal derrière un Caddy déjà en place

## Décision

La V1 s'appuie sur :

- Astro comme moteur de site
- `output: "static"` explicite
- contenu versionné dans le repo
- pages Astro sans framework UI client
- CSS global pour l'essentiel du rendu
- WAAPI réservé à de petites finitions éventuelles, pas au socle de l'interface
- intégration de rendez-vous par URL externe Google, sans logique applicative maison
- runtime de production en conteneur statique basé sur Caddy, écoutant en HTTP interne derrière le Caddy d'infrastructure

## Détails

### Rendu

- toutes les pages sont prérendues au build
- aucun code serveur applicatif n'est déployé
- aucune route on-demand n'est utilisée

### Couche client

- aucun framework de composant hydraté en V1
- aucun store global
- aucun routeur client
- JavaScript optionnel seulement si un détail d'animation le justifie réellement

### Contenu

- la V1 garde le contenu structuré dans le dépôt
- la présentation et le contenu restent séparés
- la structure de données est préparée pour ajouter plus tard une variante `en`

### Internationalisation V2

La V2 utilisera les capacités i18n natives d'Astro.

Décision de préparation dès la V1 :

- la locale par défaut est `fr`
- le contenu est organisé pour pouvoir ajouter une version anglaise sans réécrire la structure du site
- aucune logique i18n n'est activée côté runtime en V1

### Prise de rendez-vous

- intégration via lien Google Calendar ou Google Meet externe
- éventuellement embed externe si le besoin UX le justifie
- aucune logique maison de réservation
- aucun token ou secret côté serveur

### Sécurité

La sécurité repose d'abord sur la réduction de surface d'attaque :

- pas de backend
- pas de base de données
- pas d'authentification maison
- pas de secrets applicatifs en runtime
- dépendances limitées
- JavaScript côté client maintenu au strict minimum

Les headers de sécurité les plus stricts doivent être pilotés au niveau du Caddy d'infrastructure, car l'intégration Google peut nécessiter des règles CSP et `frame-src` spécifiques.

Le conteneur de runtime peut néanmoins servir quelques headers sûrs par défaut si cela ne contredit pas la politique gérée par le Caddy frontal.

### Runtime

- build avec Node
- artefacts statiques générés dans `dist/`
- runtime avec Caddy servant les fichiers statiques sur un port HTTP interne
- le TLS et le reverse proxy restent la responsabilité du Caddy déjà en place

## Conséquences

### Positives

- surface d'attaque très faible
- temps de réponse prévisibles
- déploiement simple
- coût d'exploitation faible
- base propre pour une V2 i18n
- cohérence avec une homepage fortement orientée contenu, preuve et branding

### Négatives

- pas de logique de personnalisation côté serveur
- pas de réservation intégrée nativement dans le site
- le contenu éditorial structuré reste maintenu dans le repo en V1
- les besoins avancés d'animation devront rester disciplinés pour ne pas réintroduire trop de JavaScript

## Sources

- Astro install and setup: https://docs.astro.build/en/install-and-setup/
- Astro configuration reference (`output: "static"`): https://docs.astro.build/en/reference/configuration-reference/
- Astro i18n routing: https://docs.astro.build/fr/guides/internationalization/
- Caddy official Docker image: https://hub.docker.com/_/caddy
