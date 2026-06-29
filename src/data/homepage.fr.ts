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

export type TestimonialCard = {
  quote: string;
  attribution: string;
  meta: string;
  status: "testimonial_quote";
  supportedClaim: string;
};

export const homepageFr = {
  meta: {
    title: "The Unreliable Engineer | IA, contenu et clarification tech",
    description:
      "Clarification, cadrage, contenu IA et accompagnement pour rendre un problème technique, stratégique ou commercial assez net pour décider.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "",
    nav: [
      { label: "Offres", href: "#work" },
      { label: "Preuves", href: "#proof" },
      { label: "Témoignages", href: "#testimonials" },
      { label: "Commencer ici", href: "#contact" },
    ] satisfies NavItem[],
    cta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
  },
  hero: {
    eyebrow: "Amine · The Unreliable Engineer",
    title: "Je clarifie le problème avant de lancer la machine.",
    audience:
      "Pour les équipes tech, profils seniors, indépendants et décideurs qui sentent qu'un sujet résiste aux réponses rapides.",
    offerLine: "Le point d'entrée: 60 minutes pour clarifier avant de choisir le format.",
    body:
      "J'aide à formuler ce qui bloque: un sujet IA, contenu, observabilité, architecture, fiabilité, positionnement ou mise en relation commerciale.",
    primaryCta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
    secondaryCta: {
      label: "Voir les preuves",
      href: "#proof",
    },
    bubble: {
      kicker: "Point d'entrée",
      body:
        "Tu viens avec un problème réel, mal cadré ou bloqué. On le rend assez net pour choisir la suite: diagnostic, contenu, introduction, accompagnement ou rien de plus.",
    },
    consultation: {
      label: "Clarifier le problème",
      caption: "60 minutes est le point d'entrée, pas la limite du travail.",
      body:
        "On part du réel: contexte, contraintes, tensions, signaux faibles. Puis on distingue le sujet à clarifier de ce qui demande un cadrage, une introduction, du contenu ou un accompagnement.",
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
          value: "Une suite lisible: décider, cadrer, rencontrer, produire ou arrêter.",
        },
      ],
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
    tag: "Offres",
    title: "Quatre façons d'avancer quand le problème devient lisible.",
    intro:
      "La session de 60 minutes sert de point d'entrée. Selon ce qui apparaît, la suite peut être courte, commerciale, éditoriale ou plus longue.",
    featured: {
      kicker: "Entrée",
      meta: "60 minutes / cas réel / clarification",
      title: "Clarification 60 minutes: isoler le vrai problème avant de lancer la machine.",
      body:
        "Tu arrives avec un sujet qui tourne en boucle. On le met à plat, on distingue les symptômes des contraintes, puis on sort avec une formulation plus nette et une prochaine action raisonnable.",
    },
    cards: [
      {
        kicker: "Cadrage",
        title: "Diagnostic court",
        body:
          "Quelques jours ou semaines pour cadrer un sujet de fiabilité, d'observabilité, d'architecture, de dette opérationnelle, d'IA ou de contenu avant de mobiliser plus lourd.",
      },
      {
        kicker: "Business",
        title: "Apport d'affaires et mise en relation",
        body:
          "Pour rendre une valeur technique plus lisible, créer les bonnes conversations et connecter un profil, une équipe ou une offre aux bons interlocuteurs.",
      },
      {
        kicker: "Long cours",
        title: "Accompagnement régulier",
        body:
          "Pour garder un regard externe sur les décisions, le positionnement, les contenus, les arbitrages techniques et la transformation de la clarté en mouvement.",
      },
    ] satisfies WorkCard[],
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
  contact: {
    tag: "Commencer ici",
    title: "Commence par 60 minutes. On verra ensuite si la suite mérite d'exister.",
    bullets: [
      "Un sujet IA, contenu, fiabilité, observabilité, architecture ou dette opérationnelle à clarifier",
      "Une offre, une trajectoire freelance ou une mise en relation à rendre plus lisible",
      "Une conversation exigeante pour décider s'il faut cadrer, produire, connecter ou s'arrêter là",
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
