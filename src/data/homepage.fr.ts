export type NavItem = {
  label: string;
  href: string;
};

export type ProofItem = {
  label: string;
  meta: string;
};

export type LogoItem = {
  label: string;
  src: string;
  context: string;
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

export type AudienceCard = {
  labels: string[];
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
    title: "The Unreliable Engineer | Clarification SRE, observabilité et positionnement tech",
    description:
      "Études de cas de 60 minutes pour clarifier un problème de fiabilité, d'observabilité, d'infrastructure ou de positionnement tech avant de choisir la suite.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "Clarification / SRE / Observabilité / Positionnement tech",
    nav: [
      { label: "Offres", href: "#work" },
      { label: "Format", href: "#method" },
      { label: "Preuves", href: "#proof" },
      { label: "Témoignages", href: "#testimonials" },
    ] satisfies NavItem[],
    cta: {
      label: "Réserver 60 minutes",
      href: "#contact",
    },
  },
  hero: {
    eyebrow: "Clarification technique / SRE / Marché freelance",
    title: "Mieux formuler le problème. Mieux choisir la suite.",
    body:
      "J'aide les équipes techniques et les profils tech senior à clarifier ce qui bloque vraiment: un système trop bruyant, une observabilité qui n'aide plus à décider, une trajectoire freelance confuse ou une prise de parole qui ne reflète pas encore leur niveau.",
    primaryCta: {
      label: "Réserver une étude de cas",
      href: "#contact",
    },
    secondaryCta: {
      label: "Voir les preuves",
      href: "#proof",
    },
    chips: ["60 minutes", "Systèmes & observabilité", "Freelance & marché", "Sans recette magique"],
    bubble: {
      kicker: "Le principe",
      body:
        "On ne vient pas chercher une réponse rapide. On vient rendre le problème assez clair pour que les bonnes réponses deviennent visibles.",
    },
    sticky: {
      kicker: "Post-it",
      title: "Tu réserves du temps, pas une méthode miracle.",
      body:
        "Une conversation structurée pour mettre de l'ordre dans un sujet technique, stratégique ou professionnel qui résiste aux réponses toutes faites.",
    },
    consultation: {
      label: "Étude de cas 60 min",
      caption: "Une session pour clarifier avant d'agir.",
      body:
        "Tu exposes le contexte, les contraintes et les tensions. On décortique le problème ensemble, sans vendre une solution préfabriquée.",
      points: [
        {
          label: "Entrée",
          value: "Un problème réel, flou, sensible ou bloqué.",
        },
        {
          label: "Travail",
          value: "Nommer les angles morts, les compromis et les questions qui comptent.",
        },
        {
          label: "Sortie",
          value: "Des pistes de lecture et de décision plus nettes.",
        },
      ],
    },
    proofFlash: {
      kicker: "Références",
      title: "Orange, Odigo, Enedis.",
      body:
        "Télécom, énergie, production, plateformes internes, observabilité et DevOps/SRE dans des environnements où le flou coûte cher.",
    },
  },
  proof: {
    tag: "Preuves",
    intro:
      "Le travail s'appuie sur des contextes réels: grands comptes, énergie, télécom, production critique, dette opérationnelle et responsabilités partagées.",
    callout:
      "La valeur attendue n'est pas un avis de plus. C'est une lecture plus claire du problème, de ses contraintes et de ce qu'il rend possible.",
    logos: [
      { label: "Orange", src: "/brand/logos/orange.jpeg", context: "Télécom / production" },
      { label: "Odigo", src: "/brand/logos/odigo.jpeg", context: "Systèmes opérationnels" },
      { label: "Enedis", src: "/brand/logos/enedis.jpeg", context: "Énergie / SI à grande échelle" },
    ] satisfies LogoItem[],
    items: [
      { label: "Observabilité", meta: "Signal, alerting, pratiques d'équipe" },
      { label: "SRE / DevOps", meta: "Production, incidents, fiabilité" },
      { label: "Architecture", meta: "Systèmes internes, flux, dette" },
      { label: "Positionnement", meta: "Freelance, contenu, perception marché" },
    ] satisfies ProofItem[],
  },
  work: {
    tag: "Offres",
    title: "Trois façons de réserver mon temps.",
    intro:
      "Chaque format part d'un cas concret. Pas de tunnel de conseil, pas de diagnostic standardisé: une heure pour rendre le problème plus lisible.",
    featured: {
      kicker: "Format central",
      meta: "60 minutes / cas réel / clarification",
      title: "Étude de cas: poser le bon problème avant de chercher la bonne solution.",
      body:
        "Tu arrives avec un sujet qui tourne en boucle. On le met à plat, on regarde ce qui est technique, humain, politique, économique ou narratif, puis on extrait les questions qui peuvent vraiment guider la suite.",
    },
    cards: [
      {
        kicker: "Système",
        title: "Fiabilité, incidents, dette infra",
        body:
          "Pour comprendre pourquoi un système reste fragile, coûteux à opérer ou difficile à reprendre malgré les outils déjà en place.",
      },
      {
        kicker: "Observabilité",
        title: "Signal, dashboards, alerting",
        body:
          "Pour distinguer ce qui aide une équipe à décider de ce qui occupe seulement l'interface et les rituels.",
      },
      {
        kicker: "Positionnement",
        title: "Freelance, contenu, perception marché",
        body:
          "Pour passer d'un profil perçu comme exécutant fiable à un interlocuteur plus stratégique, visible et mieux compris.",
      },
    ] satisfies WorkCard[],
  },
  method: {
    tag: "Format",
    title: "Une heure pour mieux penser le problème.",
    intro:
      "Le but n'est pas de repartir avec une injonction. Le but est de mieux comprendre ce qui rend le sujet difficile, puis de faire émerger des éléments de réponse plus solides.",
    steps: [
      {
        index: "01",
        title: "Exposer le cas",
        body:
          "Tu présentes le contexte, les contraintes, ce qui bloque et ce que tu as déjà essayé ou envisagé.",
      },
      {
        index: "02",
        title: "Démêler les couches",
        body:
          "On sépare les symptômes, les causes possibles, les tensions d'équipe, les enjeux de décision et les angles morts.",
      },
      {
        index: "03",
        title: "Questionner les évidences",
        body:
          "On regarde les hypothèses implicites: pourquoi ce problème est formulé comme ça, et ce que cette formulation empêche de voir.",
      },
      {
        index: "04",
        title: "Extraire des pistes",
        body:
          "Tu repars avec une lecture plus nette, des questions de décision et des options à explorer sans te vendre une recette.",
      },
    ] satisfies MethodStep[],
  },
  editorial: {
    tag: "Pour qui",
    title: "Même mécanique: clarifier ce qui est mal nommé.",
    intro:
      "Les sujets changent, mais le travail reste le même: faire apparaître les tensions, les compromis et les décisions cachées derrière un problème trop vite résumé.",
    featureLabel: "Technique / marché / narration",
    featureTitle: "Le problème n'est pas toujours là où il a l'air d'être.",
    featureBody:
      "Un sujet d'observabilité peut être un sujet de décision. Un sujet freelance peut être un sujet de perception. Un sujet contenu peut être un sujet d'offre.",
    featureNote:
      "C'est précisément ce mélange entre technique, stratégie et lecture du marché qui rend la conversation utile.",
    cards: [
      {
        labels: ["Équipes tech", "CTO", "Engineering managers"],
        body:
          "Pour clarifier un sujet de production, d'observabilité, de fiabilité, de dette infra ou d'arbitrage technique.",
      },
      {
        labels: ["Freelances tech", "Salariés en transition", "Seniors"],
        body:
          "Pour travailler l'offre, la posture, le contenu et la perception: exécutant fiable, expert visible ou interlocuteur stratégique.",
      },
    ] satisfies AudienceCard[],
  },
  testimonials: {
    tag: "Témoignages",
    title: "Ce que les autres retiennent du travail.",
    intro:
      "Les recommandations parlent surtout d'une chose: la capacité à élever le niveau de lecture, techniquement et stratégiquement.",
    cards: [
      {
        quote:
          "Amine est exceptionnellement compétent techniquement et porte une vision stratégique de l'observabilité de premier ordre.",
        attribution: "Amin",
        meta: "Project management · Enedis",
      },
      {
        quote:
          "Travailler avec Amine, c'est l'assurance d'élever le niveau des discussions, tant sur le plan technique que stratégique.",
        attribution: "Valentin",
        meta: "Expert Observabilité & SRE Freelance · Enedis",
      },
      {
        quote:
          "Amine est un SRE expérimenté que je recommande pour tout projet de solution ou plateformes à échelle.",
        attribution: "Hichem",
        meta: "Software Architect / Engineering Manager · Orange",
      },
    ] satisfies TestimonialCard[],
  },
  insights: {
    tag: "Notes",
    title: "Contenu, signal et perception.",
    intro:
      "Les contenus publics prolongent le même travail: rendre lisible ce qui est souvent confus dans les systèmes, les carrières et les marchés techniques.",
    cards: [
      {
        kicker: "Observabilité",
        title: "Voir la différence entre signal utile et décoration d'interface",
        body:
          "Réflexions sur les dashboards, alertes et habitudes qui donnent l'impression de comprendre sans toujours aider à décider.",
      },
      {
        kicker: "Freelance",
        title: "Passer de l'exécution fiable à la valeur stratégique",
        body:
          "Angles, offres et prises de parole pour mieux faire percevoir le jugement derrière le travail technique.",
      },
      {
        kicker: "Leadership",
        title: "Formuler ce qu'on voit avant de demander à être écouté",
        body:
          "Le contenu devient utile quand il montre une capacité de lecture, pas seulement une liste de compétences.",
      },
    ] satisfies InsightCard[],
  },
  contact: {
    tag: "Commencer ici",
    title: "Réserve 60 minutes pour mettre ton problème sur la table.",
    bullets: [
      "Un sujet de fiabilité, d'observabilité, d'architecture ou de dette opérationnelle à clarifier",
      "Une trajectoire freelance, contenu ou positionnement à rendre plus lisible",
      "Une conversation exigeante pour mieux définir le problème avant de décider quoi faire",
    ],
    primaryCta: {
      label: "Réserver une étude de cas",
      href: "#top",
    },
    secondaryCta: {
      label: "Voir les témoignages",
      href: "#testimonials",
    },
    note:
      "Format V1: 60 minutes en visio. Tu viens avec un cas réel; on cherche à mieux le comprendre, pas à cocher une méthode.",
  },
} as const;
