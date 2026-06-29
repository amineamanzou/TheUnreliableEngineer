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

export type BoundaryItem = {
  title: string;
  body: string;
};

export type TestimonialCard = {
  quote: string;
  attribution: string;
  meta: string;
  href: string;
  status: "testimonial_quote";
  supportedClaim: string;
};

export type SocialStat = {
  value: string;
  countTo: number;
  suffix: string;
  label: string;
};

export type SocialLink = {
  label: string;
  href: string;
  meta: string;
};

export const homepageFr = {
  meta: {
    title: "The Unreliable Engineer | Clarification technique et stratégie lisible",
    description:
      "Conseil indépendant pour rendre une situation technique ou stratégique confuse assez lisible pour décider la bonne suite.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "",
    nav: [
      { label: "Suites", href: "#work" },
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
    title: "Clarifier le vrai sujet avant de lancer la machine.",
    audience:
      "Pour les équipes tech, profils seniors, indépendants et décideurs qui doivent rendre une situation confuse lisible et décidable.",
    offerLine: "Point d'entrée: 60 minutes pour sortir avec une décision plus nette.",
    body:
      "J'aide à démêler les sujets où architecture, observabilité, IA, contenu et perception marché se mélangent trop vite.",
    primaryCta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
    secondaryCta: {
      label: "Voir les preuves",
      href: "#proof",
    },
    consultation: {
      label: "Clarifier le problème",
      caption: "Une situation floue n'a pas besoin d'un gros plan. Elle a d'abord besoin d'être lisible.",
      body:
        "On part du réel: contexte, contraintes, tensions, signaux faibles. Puis on distingue ce qui relève d'un cadrage, d'un accompagnement, d'un positionnement, d'une opportunité ou d'une mise en relation qualifiée.",
      points: [
        {
          label: "Symptôme",
          value: "Ce que l'équipe répète sans réussir à trancher.",
        },
        {
          label: "Contrainte",
          value: "Ce qui rend le sujet politique, technique ou commercialement sensible.",
        },
        {
          label: "Décision",
          value: "Ce qui doit devenir arbitrable avant d'engager du temps, du budget ou une relation.",
        },
        {
          label: "Sortie",
          value: "Clarifier, cadrer, accompagner, connecter ou arrêter proprement.",
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
    tag: "Suites possibles",
    title: "Un point d'entrée, quatre suites possibles.",
    intro:
      "La page ne vend pas une liste de services concurrents. Elle vend une capacité: rendre le sujet lisible, puis choisir la bonne suite.",
    featured: {
      kicker: "Entrée",
      meta: "60 minutes / cas réel / clarification",
      title: "Clarification 60 minutes",
      body:
        "Une session courte pour formuler le problème, les contraintes, les angles morts et la prochaine décision utile.",
    },
    cards: [
      {
        kicker: "Cadrage",
        title: "Cadrage technique",
        body:
          "Quelques jours pour transformer un sujet de fiabilité, observabilité, architecture, dette ou IA en plan de décision exploitable.",
      },
      {
        kicker: "Long cours",
        title: "Accompagnement senior",
        body:
          "Une cadence régulière pour challenger les arbitrages, la narration technique, les priorités et les signaux faibles.",
      },
      {
        kicker: "Positionnement",
        title: "Positionnement et opportunités",
        body:
          "Rendre une offre, un récit ou une trajectoire senior plus lisible avant d'ouvrir une opportunité ou de produire du contenu.",
      },
      {
        kicker: "Signal qualifié",
        title: "Mise en relation qualifiée",
        body:
          "Ouvrir une conversation seulement quand le contexte, la valeur et le signal sont assez clairs pour les deux côtés.",
      },
    ] satisfies WorkCard[],
  },
  boundaries: {
    tag: "Ce que ce n'est pas",
    title: "Pas un menu de prestations. Pas une promesse magique.",
    intro:
      "Le cadrage protège autant que l'action: parfois la bonne suite est de ne rien lancer, ou de ne pas ouvrir une conversation trop tôt.",
    items: [
      {
        title: "Pas un audit de 40 pages",
        body: "Le livrable utile est une décision plus claire, pas un document qui rassure sans changer la suite.",
      },
      {
        title: "Pas une promesse IA magique",
        body: "Si l'IA n'est pas le bon levier, on le dit avant de construire autour d'un buzzword.",
      },
      {
        title: "Pas du coaching flou",
        body: "La discussion part d'un cas réel: contraintes, signaux, arbitrages, prochaines actions.",
      },
      {
        title: "Pas une mise en relation automatique",
        body: "Une introduction n'a de valeur que si le signal est clair pour les deux côtés.",
      },
    ] satisfies BoundaryItem[],
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
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "Vision stratégique de l'observabilité",
      },
      {
        quote:
          "Travailler avec Amine, c'est l'assurance d'élever le niveau des discussions, tant sur le plan technique que stratégique.",
        attribution: "Valentin",
        meta: "Expert Observabilité & SRE Freelance · Enedis",
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "Élévation du niveau de discussion technique et stratégique",
      },
      {
        quote:
          "Amine est un SRE expérimenté que je recommande pour tout projet de solution ou plateformes à échelle.",
        attribution: "Hichem",
        meta: "Software Architect / Engineering Manager · Orange",
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "Crédibilité SRE et plateformes à échelle",
      },
    ] satisfies TestimonialCard[],
  },
  contact: {
    tag: "Commencer ici",
    title: "On commence par nommer le sujet. Ensuite on choisit le format.",
    bullets: [
      "Un problème technique ou stratégique à rendre arbitrable",
      "Une offre ou une trajectoire senior à rendre plus lisible",
      "Une opportunité ou une introduction à qualifier avant d'ouvrir les bonnes conversations",
    ],
    primaryCta: {
      label: "Réserver 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=Session%2060%20minutes%20de%20clarification",
    },
    note:
      "Format actuel: 60 minutes en visio, autour d'un cas réel, pour mieux comprendre avant d'agir.",
  },
  socialSignal: {
    tag: "Signal public",
    title: "Le contenu est aussi un laboratoire.",
    intro:
      "Je publie pour tester les angles, documenter les systèmes et exposer les frictions réelles: observabilité, agents IA, production, freelance et outillage maison.",
    stats: [
      {
        value: "350+",
        countTo: 350,
        suffix: "",
        label: "publications visibles sur les plateformes",
      },
      {
        value: "326k+",
        countTo: 326000,
        suffix: "",
        label: "vues et impressions vérifiées",
      },
      {
        value: "550+",
        countTo: 550,
        suffix: "",
        label: "commentaires vérifiés",
      },
    ] satisfies SocialStat[],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/amineamanzou/",
        meta: "Recommandations, posts longs et angles observabilité",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@theunreliableengi",
        meta: "Shorts, tests d'angles et formats plus directs",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/theunreliableengineer/",
        meta: "Carrousels, stories et présence visuelle de marque",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61570743494074",
        meta: "Page The Unreliable Engineer",
      },
      {
        label: "X",
        href: "https://x.com/TheUnreliableEn",
        meta: "Notes courtes, build logs et signaux faibles",
      },
      {
        label: "Threads",
        href: "https://www.threads.com/@theunreliableengineer",
        meta: "Posts courts et conversations tech",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@theunreliableengineer",
        meta: "Vidéos longues, shorts et posts communauté",
      },
    ] satisfies SocialLink[],
  },
} as const;
