export type NavItem = {
  label: string;
  href: string;
};

export type ProofItem = {
  label: string;
  meta: string;
};

export type PersonaSpec = {
  label: string;
  value: string;
};

export type WorkCard = {
  kicker: string;
  title: string;
  body: string;
};

export type MethodStep = {
  index: string;
  title: string;
  body: string;
};

export type TestimonialCard = {
  quote: string;
  attribution: string;
  meta: string;
};

export type InsightCard = {
  kicker: string;
  title: string;
  body: string;
};

export const homepageFr = {
  meta: {
    title: "The Unreliable Engineer | SRE, observabilité et stratégie infra",
    description:
      "SRE, observabilité, stratégie infra et IA pragmatique pour les équipes qui ont besoin de clarté dans des environnements instables.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "SRE / Observabilité / Stratégie infra / IA pragmatique",
    nav: [
      { label: "Missions", href: "#work" },
      { label: "Méthode", href: "#method" },
      { label: "Références", href: "#proof" },
      { label: "Notes", href: "#insights" },
    ] satisfies NavItem[],
    cta: {
      label: "Prendre un rendez-vous",
      href: "#contact",
    },
  },
  hero: {
    eyebrow: "SRE / Observabilité / Stratégie infra",
    title: "Des systèmes plus fiables. Des décisions moins fragiles.",
    body:
      "J'accompagne tech leads, engineering managers, responsables infrastructure et CTO sur les sujets SRE, observabilité, stratégie infra et IA pragmatique. Avec une approche sérieuse sur le fond, satirique sur la forme et toujours ancrée dans le réel.",
    primaryCta: {
      label: "Prendre un rendez-vous",
      href: "#contact",
    },
    secondaryCta: {
      label: "Voir les références",
      href: "#proof",
    },
    chips: ["Orange", "Odigo", "SI énergie / 400+ projets", "Banque privée"],
    bubble: {
      kicker: "Bulle du moment",
      body:
        "Le dashboard n'est pas une stratégie. L'observabilité ne vaut quelque chose que si elle aide vraiment une équipe à décider.",
    },
    sticky: {
      kicker: "Post-it",
      title: "Premium sur le fond. Décalé sur la forme.",
      body:
        "Une voix éditoriale assumée pour parler de fiabilité, d'observabilité et de stratégie infra sans jargon de brochure.",
    },
    persona: {
      title: "Personnage canonique",
      caption: "The Unreliable Engineer, version éditoriale à illustrer.",
      body:
        "Le hero doit pouvoir accueillir ton personnage, ses bulles de dialogue et ses post-it sans casser la crédibilité premium du site.",
      specs: [
        {
          label: "Silhouette",
          value: "Homme, visage ovale et légèrement rond, expression sympathique.",
        },
        {
          label: "Cheveux",
          value: "Cheveux noirs tirés en arrière, man bun strict, front dégagé.",
        },
        {
          label: "Visage",
          value: "Barbe complète noire, moustache présente, lunettes rondes fines en métal.",
        },
        {
          label: "Vêtement",
          value: "Chemise en flanelle rouge et noir, parfois avec un tee-shirt geek.",
        },
      ] satisfies PersonaSpec[],
    },
    proofFlash: {
      kicker: "Références",
      title: "Orange, Odigo, SI énergie, banque privée.",
      body:
        "Des environnements sensibles où la clarté technique change directement le niveau de risque et la qualité de décision.",
    },
  },
  proof: {
    tag: "Références",
    intro:
      "J'interviens là où la fiabilité, la lisibilité du système et la qualité de décision ont un impact direct sur l'équipe et sur le business.",
    callout:
      "Grand compte, environnements sensibles, dette opérationnelle, responsabilités partagées: la preuve doit apparaître immédiatement.",
    items: [
      { label: "Orange", meta: "Contexte grand compte" },
      { label: "Odigo", meta: "Systèmes opérationnels" },
      { label: "SI énergie", meta: "Environ 400 projets" },
      { label: "Banque privée", meta: "Environnement à forte exigence" },
      { label: "LinkedIn", meta: "Preuve collègue" },
      { label: "Malt", meta: "Crédibilité freelance" },
    ] satisfies ProofItem[],
  },
  work: {
    tag: "Missions",
    title: "Ce que j'apporte aux équipes sous pression.",
    intro:
      "Quand la production devient illisible, que l'observabilité rassure plus qu'elle n'éclaire, ou que l'infrastructure grossit plus vite que sa clarté, j'interviens pour remettre du signal.",
    featured: {
      kicker: "Mission principale",
      meta: "Terrain / Arbitrages / Livraison",
      title: "Remettre du signal dans des systèmes qui ont appris à survivre dans le bruit.",
      body:
        "Audit terrain, cadrage de l'observabilité, simplification des flux, arbitrages d'architecture et documentation utile. Le travail vise toujours un système plus lisible, plus opérable et moins dépendant de l'improvisation.",
    },
    cards: [
      {
        kicker: "SRE",
        title: "Fiabilité sous contraintes réelles",
        body:
          "Résilience, incidents, niveaux de service, runbooks et décisions de fiabilité qui tiennent hors du slide deck.",
      },
      {
        kicker: "Observabilité",
        title: "Rendre le signal lisible",
        body:
          "Logs, metrics, traces et alerting remis au service du diagnostic plutôt que du théâtre des dashboards.",
      },
      {
        kicker: "Stratégie infra",
        title: "Clarifier le système avant de multiplier les outils",
        body:
          "Architecture, outillage, coûts et responsabilités clarifiés avant d'ajouter une nouvelle couche de complexité.",
      },
    ] satisfies WorkCard[],
  },
  method: {
    tag: "Méthode",
    title: "Une méthode lisible, sans théâtre de cabinet.",
    intro:
      "Le but n'est pas d'importer un framework de plus. Le but est de réduire l'ambiguïté, d'accélérer la décision et de laisser un système que d'autres peuvent reprendre.",
    steps: [
      {
        index: "01",
        title: "Lire le terrain",
        body:
          "Identifier les contraintes réelles, la dette visible et les angles morts que les rituels ne montrent plus.",
      },
      {
        index: "02",
        title: "Réduire le problème",
        body:
          "Transformer un système flou en arbitrages explicites, tractables et compréhensibles par l'équipe.",
      },
      {
        index: "03",
        title: "Exécuter sans folklore",
        body:
          "Livrer des changements utiles, compatibles avec le contexte technique et politique qui existe réellement.",
      },
      {
        index: "04",
        title: "Laisser une couche réutilisable",
        body:
          "Documenter les décisions et les artefacts pour que la valeur du travail survive après l'intervention.",
      },
    ] satisfies MethodStep[],
  },
  editorial: {
    tag: "Contenu",
    title: "Le contenu prolonge la méthode.",
    intro:
      "Conférences, posts, satire SRE, vulgarisation IA et réflexions de carrière servent la même promesse: produire du recul utile pour des équipes techniques en responsabilité.",
    featureLabel: "Poster / vidéo / case BD",
    featureTitle: "Le personnage devient un outil de lecture, pas un gimmick.",
    featureBody:
      "Le hero et les futures animations devront utiliser ton personnage pour créer de la tension visuelle, du contraste et des prises de parole mémorables.",
    featureNote:
      "Direction à tenir: ligne claire, humains uniquement, contours noirs nets, bulles, post-it jaunes et énergie éditoriale contrôlée.",
    cards: [
      {
        labels: ["SRE", "Observabilité", "Satire contrôlée"],
        body:
          "Des contenus qui font sourire assez pour qu'on écoute, mais surtout assez clairs pour faire évoluer une pratique.",
      },
      {
        labels: ["IA pragmatique", "Leadership", "Freelance premium"],
        body:
          "Une parole publique qui aide des ingénieurs à gagner en jugement, en influence et en positionnement sans papier peint buzzword.",
      },
    ],
  },
  testimonials: {
    tag: "Témoignages",
    title: "De la preuve humaine, pas des compliments décoratifs.",
    intro:
      "Les vrais extraits viendront de LinkedIn, Malt et du portefeuille client. La mise en forme doit déjà montrer un système de preuve crédible et structuré.",
    cards: [
      {
        quote: "Extrait LinkedIn grand compte à intégrer ici.",
        attribution: "Référence à confirmer",
        meta: "Confiance en contexte sensible",
      },
      {
        quote: "Extrait Malt ou collègue à intégrer ici.",
        attribution: "Référence à confirmer",
        meta: "Qualité de collaboration",
      },
      {
        quote: "Extrait technique à intégrer ici.",
        attribution: "Référence à confirmer",
        meta: "Crédibilité technique",
      },
    ] satisfies TestimonialCard[],
  },
  insights: {
    tag: "Notes",
    title: "Analyses, terrain et recul stratégique.",
    intro:
      "Cette zone renverra vers tes réseaux sociaux et tes contenus longs sans casser l'unité visuelle du site.",
    cards: [
      {
        kicker: "Observabilité",
        title: "Rendre visible la différence entre signal utile et décoration d'interface",
        body:
          "Posts, carrousels ou notes sur les habitudes d'observabilité qui aident vraiment une équipe à décider.",
      },
      {
        kicker: "IA pragmatique",
        title: "Des usages concrets de l'IA sans décor de hype",
        body:
          "Des cas d'usage directement reliés au travail d'ingénierie, de leadership et de conseil technique.",
      },
      {
        kicker: "Leadership",
        title: "Comment des ingénieurs gagnent en influence stratégique",
        body:
          "Réflexions pour tech leads, engineering managers et freelances qui veulent prendre plus de hauteur.",
      },
    ] satisfies InsightCard[],
  },
  contact: {
    tag: "Commencer ici",
    title: "Parlons d'un système à remettre au clair.",
    bullets: [
      "Un environnement opérationnel désordonné avec de vrais enjeux techniques et politiques",
      "Un besoin de fiabilité, d'observabilité, de stratégie infra ou de repositionnement technique",
      "Une attente d'exécution avec du jugement, pas de théâtre ni de jargon décoratif",
    ],
    primaryCta: {
      label: "Prendre un rendez-vous",
      href: "#top",
    },
    secondaryCta: {
      label: "Voir les notes",
      href: "#insights",
    },
    note:
      "La prise de rendez-vous V1 passera par Google Calendar / Meet via une URL externe, sans logique métier côté serveur.",
  },
} as const;
