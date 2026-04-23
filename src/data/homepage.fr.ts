export type NavItem = {
  label: string;
  href: string;
};

export type ProofItem = {
  label: string;
  meta: string;
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
};

export const homepageFr = {
  meta: {
    title: "The Unreliable Engineer | SRE, observabilité et stratégie infra",
    description:
      "SRE, observabilité, stratégie infra et IA pragmatique pour les équipes qui ont besoin de clarté dans des environnements instables.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "SRE / Observabilité / Stratégie Infra / IA pragmatique",
    nav: [
      { label: "Missions", href: "#work" },
      { label: "Méthode", href: "#method" },
      { label: "Notes", href: "#insights" },
      { label: "Références", href: "#proof" },
    ] satisfies NavItem[],
    cta: {
      label: "Discuter d'un projet",
      href: "#contact",
    },
  },
  hero: {
    eyebrow: "SRE / Observabilité / Stratégie Infra",
    title: "Des systèmes fiables dans des environnements instables.",
    body:
      "J'aide les tech leads, engineering managers, responsables infrastructure et CTO à prendre de meilleures décisions en fiabilité, observabilité, infrastructure et IA pragmatique quand le système est trop complexe pour des recettes génériques.",
    primaryCta: {
      label: "Discuter d'un projet",
      href: "#contact",
    },
    secondaryCta: {
      label: "Voir les missions",
      href: "#work",
    },
    chips: ["Orange", "Odigo", "SI énergie / 400+ projets", "Banque privée"],
  },
  proof: {
    intro:
      "Contextes, références et signaux de preuve issus d'environnements techniques à fort niveau d'exigence.",
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
    title: "La preuve avant le discours.",
    intro:
      "Quelques interventions concrètes valent mieux qu'une grande galerie de cas clients flous. La homepage doit montrer le type de systèmes, de contraintes et de décisions que cette marque est amenée à traiter.",
    featured: {
      kicker: "Mission principale",
      meta: "Problème / Intervention / Résultat",
      title:
        "Grands systèmes, environnements sensibles et décisions qui doivent survivre au réel.",
      body:
        "La carte principale doit montrer comment le bruit opérationnel est réduit jusqu'à produire un système lisible et opérable. La structure doit rester concrète : problème, intervention, résultat, contexte.",
    },
    cards: [
      {
        kicker: "SRE",
        title: "Fiabilité sous contraintes réelles",
        body: "Carte focalisée sur une intervention contenue et un résultat visible.",
      },
      {
        kicker: "Observabilité",
        title: "Rendre le signal lisible",
        body: "Une autre carte mission avec un avant-après plus net.",
      },
      {
        kicker: "Stratégie infra",
        title: "Clarifier le système avant de multiplier les outils",
        body: "Un contexte confidentiel peut rester spécifique sans tout nommer.",
      },
    ] satisfies WorkCard[],
  },
  method: {
    tag: "Méthode",
    title: "Assez structurée pour tenir. Assez pragmatique pour livrer.",
    intro:
      "La méthode doit se lire comme un modèle opératoire, pas comme un framework de conseil. Le but est de montrer comment l'ambiguïté devient des décisions tractables et des artefacts réutilisables.",
    steps: [
      {
        index: "01 / Diagnostiquer",
        title: "Lire le système réel",
        body: "Séparer la réalité opérationnelle de l'abstraction, de la politique et du bruit outil.",
      },
      {
        index: "02 / Concevoir",
        title: "Réduire la forme du problème",
        body: "Transformer l'ambiguïté en système avec des arbitrages explicites.",
      },
      {
        index: "03 / Exécuter",
        title: "Livrer avec les contraintes en vue",
        body: "L'implémentation doit rester ancrée dans le réel, pas dans le théâtre framework.",
      },
      {
        index: "04 / Documenter",
        title: "Laisser une couche réutilisable",
        body: "Les décisions, les artefacts et la connaissance doivent continuer à servir après la livraison.",
      },
    ] satisfies MethodStep[],
  },
  editorial: {
    tag: "Territoires éditoriaux",
    title: "La parole publique doit renforcer la méthode.",
    intro:
      "C'est ici que le site relie l'offre premium à l'identité média : commentaire technique sérieux, recul stratégique et satire contrôlée.",
    featureLabel: "Emplacement persona / poster",
    cards: [
      {
        labels: ["SRE", "Observabilité", "Stratégie infra"],
        body: "Commentaire opérationnel à fort signal avec un angle satirique assumé.",
      },
      {
        labels: ["IA pragmatique", "Leadership", "Freelance premium"],
        body: "IA pratique, posture d'ingénieur et positionnement sans papier peint buzzword.",
      },
    ],
  },
  testimonials: {
    tag: "Témoignages",
    title: "De la preuve humaine, pas des compliments décoratifs.",
    intro:
      "Garder trois cartes visibles et faire en sorte que chacune prouve quelque chose de distinct : confiance grand compte, qualité de collaboration et crédibilité technique.",
    cards: [
      {
        quote: "Extrait de témoignage grand compte à intégrer ici dès validation.",
        attribution: "Rôle / Société",
        meta: "Preuve grand compte",
      },
      {
        quote: "Extrait de témoignage collaboration à intégrer ici dès validation.",
        attribution: "Rôle / Contexte",
        meta: "Preuve collaboration",
      },
      {
        quote: "Extrait de témoignage technique à intégrer ici dès validation.",
        attribution: "Rôle / Société",
        meta: "Crédibilité technique",
      },
    ] satisfies TestimonialCard[],
  },
  insights: {
    tag: "Notes",
    title: "Analyses, terrain et satire contrôlée.",
    intro:
      "Cette section doit montrer que la marque est active et intellectuellement vivante, pas seulement propre commercialement.",
    cards: [
      {
        kicker: "Observabilité",
        title: "Une manière plus nette de parler du signal, du bruit et des habitudes outillées",
      },
      {
        kicker: "IA pragmatique",
        title: "Des usages concrets de l'IA sans décor de hype",
      },
      {
        kicker: "Leadership",
        title: "Comment des ingénieurs gagnent en influence stratégique",
      },
    ] satisfies InsightCard[],
  },
  contact: {
    tag: "Commencer ici",
    title: "Pour les équipes qui ont besoin de clarté avant plus de bruit.",
    bullets: [
      "Des environnements opérationnels désordonnés avec de vrais enjeux",
      "Fiabilité, observabilité, infra ou repositionnement technique stratégique",
      "Des responsables qui veulent de l'exécution avec du jugement, pas du théâtre",
    ],
    primaryCta: {
      label: "Discuter d'un projet",
      href: "#top",
    },
    secondaryCta: {
      label: "Voir les références",
      href: "#proof",
    },
    note:
      "La prise de rendez-vous Google Calendar / Meet sera branchée via une URL externe, sans logique métier côté serveur.",
  },
} as const;
