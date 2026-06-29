export type BlogArticle = {
  slug: string;
  label: string;
  title: string;
  date: string;
  readTime: string;
  sourceUrl: string;
  excerpt: string;
  intro: string;
  points: string[];
};

export const blogArticles = [
  {
    slug: "opamp-fleet-management-agents",
    label: "OpAMP / Fleet management",
    title: "Qui utilise vraiment OpAMP pour gérer ses agents ?",
    date: "29 juin 2026",
    readTime: "11 min",
    sourceUrl:
      "https://www.linkedin.com/pulse/qui-utilise-vraiment-opamp-pour-g%25C3%25A9rer-ses-agents-amine-amanzou-2qvte/",
    excerpt:
      "Dans les grands parcs, la question n'est plus seulement quel agent installer. Elle devient: qui contrôle vraiment le parc qui produit les logs, métriques et traces ?",
    intro:
      "Un tri terrain des promesses de fleet management autour d'OpenTelemetry, OpAMP, distributions collector, interfaces vendor et vraies boucles de contrôle à distance.",
    points: [
      "Distinguer le protocole OpAMP d'une promesse produit enterprise.",
      "Lire ce que les vendors documentent réellement, pas seulement ce qu'ils suggèrent en marketing.",
      "Comparer agent propriétaire, collector OpenTelemetry, distribution packagée et UI de pilotage.",
    ],
  },
  {
    slug: "observabilite-deck-tracker-developpeur",
    label: "Observabilité / Hearthstone",
    title: "L'Observabilité, le Deck Tracker du Développeur ?",
    date: "14 avril 2025",
    readTime: "5 min",
    sourceUrl:
      "https://www.linkedin.com/pulse/lobservabilit%25C3%25A9-le-deck-tracker-du-d%25C3%25A9veloppeur-amine-amanzou--66iqc/",
    excerpt:
      "Les joueurs utilisent des trackers pour comprendre une partie. Les ingénieurs utilisent logs, métriques et traces pour comprendre un système.",
    intro:
      "Une analogie entre Hearthstone Deck Tracker, replays, statistiques de méta et observabilité logicielle pour expliquer pourquoi la donnée utile vaut mieux que la donnée partout.",
    points: [
      "Relier logs, métriques et traces à des réflexes de joueur: journal de partie, winrate, replay.",
      "Montrer que comprendre pourquoi on gagne ou perd ressemble à comprendre pourquoi un système tient ou casse.",
      "Insister sur la qualité et le contexte du signal plutôt que l'accumulation de données.",
    ],
  },
] satisfies BlogArticle[];
