export type NavItem = {
  label: string;
  href: string;
};

export type ProofItem = {
  label: string;
  meta: string;
  status: "descriptor_first";
  supportedClaim: string;
};

export type LogoItem = {
  label: string;
  src: string;
  context: string;
  status: "approved_logo";
  supportedClaim: string;
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
  status: "testimonial_quote";
  supportedClaim: string;
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
      "Session de 60 minutes pour clarifier un problème de fiabilité, d'observabilité, d'architecture ou de décision technique avant de choisir la suite.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "Session 60 min / SRE / Observabilité / Grands comptes",
    nav: [
      { label: "Offres", href: "#work" },
      { label: "Format", href: "#method" },
      { label: "Preuves", href: "#proof" },
      { label: "Témoignages", href: "#testimonials" },
    ] satisfies NavItem[],
    cta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
  },
  hero: {
    eyebrow: "Session 60 minutes / SRE / observabilité / grands comptes",
    title: "Clarifier le problème avant d'engager la suite.",
    body:
      "Pour les tech leads, CTO, engineering managers, responsables infra, SRE et observabilité qui doivent trancher dans le flou. Je lis les signaux faibles, les logs humains et les dashboards trop sûrs d'eux pour remettre le vrai problème au centre.",
    primaryCta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
    secondaryCta: {
      label: "Voir les preuves",
      href: "#proof",
    },
    chips: ["grep le vrai problème", "tail -f production", "dashboard != décision"],
    bubble: {
      kicker: "Le principe",
      body:
        "Tu viens avec un problème réel, mal cadré ou bloqué. On le rend assez net pour décider de la suite sans vendre une méthode miracle.",
    },
    sticky: {
      kicker: "Post-it",
      title: "Une heure de clarification, pas une promesse gonflée.",
      body:
        "Une conversation structurée pour remettre de l'ordre dans un sujet de production, d'observabilité, d'architecture ou de positionnement tech qui résiste aux réponses rapides.",
    },
    consultation: {
      label: "Session 60 min",
      caption: "Une offre principale: clarifier avant d'agir.",
      body:
        "Tu exposes le contexte, les contraintes et les tensions. On démêle le sujet ensemble pour sortir avec un problème mieux formulé, des arbitrages plus visibles et des prochaines questions plus nettes.",
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
    terminal: {
      title: "ops-console.local",
      status: "clarification session armed",
      lines: [
        {
          prompt: "$",
          command: "grep -R \"vrai probleme\" ./prod ./roadmap ./politics",
          output: "3 suspects, 12 symptômes, 1 décision à isoler",
        },
        {
          prompt: "$",
          command: "tail -f dashboards.log | filter --not-theater",
          output: "dashboard != décision; alert != incident",
        },
        {
          prompt: "$",
          command: "ssh contexte-reel -- 'show constraints'",
          output: "humain, budget, dette, org, signal faible",
        },
      ],
      badges: ["NO MAGIC FRAMEWORK", "WORKS ON PROD?", "RUNBOOK MENTAL"],
    },
    proofFlash: {
      kicker: "Références",
      title: "SRE, observabilité, production, grands comptes.",
      body:
        "Orange, Odigo, Enedis: télécom, énergie, systèmes opérationnels et environnements où un mauvais cadrage coûte du temps, de l'argent et de l'attention.",
    },
  },
  proof: {
    tag: "Preuves",
    intro:
      "Le travail s'appuie sur des contextes réels: grands comptes, énergie, télécom, production critique, dette opérationnelle et responsabilités partagées.",
    callout:
      "La valeur attendue n'est pas un avis de plus. C'est une lecture plus claire du problème, de ses contraintes et de ce qu'il rend possible.",
    logos: [
      {
        label: "Orange",
        src: "/brand/logos/orange.jpeg",
        context: "Télécom / production",
        status: "approved_logo",
        supportedClaim: "Expérience production et grands comptes",
      },
      {
        label: "Odigo",
        src: "/brand/logos/odigo.jpeg",
        context: "Systèmes opérationnels",
        status: "approved_logo",
        supportedClaim: "Systèmes opérationnels et fiabilité",
      },
      {
        label: "Enedis",
        src: "/brand/logos/enedis.jpeg",
        context: "Énergie / SI à grande échelle",
        status: "approved_logo",
        supportedClaim: "Énergie, SI à grande échelle et observabilité",
      },
    ] satisfies LogoItem[],
    items: [
      {
        label: "Observabilité",
        meta: "Signal, alerting, pratiques d'équipe",
        status: "descriptor_first",
        supportedClaim: "Clarifier le signal utile avant d'ajouter du dashboard",
      },
      {
        label: "SRE / DevOps",
        meta: "Production, incidents, fiabilité",
        status: "descriptor_first",
        supportedClaim: "Lire les contraintes de production et de fiabilité",
      },
      {
        label: "Architecture",
        meta: "Systèmes internes, flux, dette",
        status: "descriptor_first",
        supportedClaim: "Rendre les arbitrages techniques plus décidables",
      },
      {
        label: "Positionnement",
        meta: "Freelance, contenu, perception marché",
        status: "descriptor_first",
        supportedClaim: "Clarifier la perception stratégique d'un profil senior",
      },
    ] satisfies ProofItem[],
  },
  work: {
    tag: "Session",
    title: "Une offre principale: 60 minutes de clarification.",
    intro:
      "Pas trois offres qui se battent entre elles. Une session centrale, puis des cas typiques où elle est utile quand un problème technique, organisationnel ou de positionnement reste mal nommé.",
    featured: {
      kicker: "main.sh",
      meta: "60 minutes / cas réel / clarification",
      title: "Réserver 60 minutes pour grep le bon problème avant de chercher la bonne solution.",
      body:
        "Tu arrives avec un sujet qui tourne en boucle. On le met à plat, on distingue ce qui relève de la production, des arbitrages, des contraintes d'équipe ou de la perception marché, puis on extrait les vraies questions qui doivent guider la suite.",
    },
    cards: [
      {
        kicker: "WARN",
        title: "Incident fantôme, dette infra",
        body:
          "Pour comprendre pourquoi un système reste fragile, coûteux à opérer ou difficile à reprendre malgré les outils déjà en place.",
      },
      {
        kicker: "TRACE",
        title: "Signal, dashboards, alerting",
        body:
          "Pour distinguer ce qui aide une équipe à décider de ce qui occupe seulement l'interface et les rituels.",
      },
      {
        kicker: "SIDE QUEST",
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
        title: "tail -f le réel",
        body:
          "Tu présentes le contexte, les contraintes, ce qui bloque et ce que tu as déjà essayé ou envisagé.",
      },
      {
        index: "02",
        title: "grep les causes",
        body:
          "On sépare les symptômes, les causes possibles, les tensions d'équipe, les enjeux de décision et les hypothèses qui empêchent de voir le vrai sujet.",
      },
      {
        index: "03",
        title: "ship la décision",
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
        status: "testimonial_quote",
        supportedClaim: "Vision stratégique de l'observabilité",
      },
      {
        quote:
          "Travailler avec Amine, c'est l'assurance d'élever le niveau des discussions, tant sur le plan technique que stratégique.",
        attribution: "Valentin",
        meta: "Expert Observabilité & SRE Freelance · Enedis",
        status: "testimonial_quote",
        supportedClaim: "Élévation du niveau de discussion technique et stratégique",
      },
      {
        quote:
          "Amine est un SRE expérimenté que je recommande pour tout projet de solution ou plateformes à échelle.",
        attribution: "Hichem",
        meta: "Software Architect / Engineering Manager · Orange",
        status: "testimonial_quote",
        supportedClaim: "Crédibilité SRE et plateformes à échelle",
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
    title: "Réserve 60 minutes pour clarifier le problème avant de lancer la machine.",
    bullets: [
      "Un sujet de fiabilité, d'observabilité, d'architecture ou de dette opérationnelle à clarifier",
      "Une trajectoire freelance, contenu ou positionnement à rendre plus lisible",
      "Une conversation exigeante pour mieux définir le problème avant de décider quoi faire",
    ],
    primaryCta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
    secondaryCta: {
      label: "Voir les témoignages",
      href: "#testimonials",
    },
    note:
      "Placeholder de réservation actuel: email direct en attendant une URL de booking dédiée. Format V1: 60 minutes en visio, autour d'un cas réel, pour mieux comprendre avant d'agir.",
  },
} as const;
