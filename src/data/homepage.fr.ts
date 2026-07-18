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
  href: string;
  linkLabel: string;
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
      { label: "Preuves", href: "#proof" },
      { label: "Offres", href: "#work" },
      { label: "Témoignages", href: "#testimonials" },
      { label: "Commencer ici", href: "#contact" },
    ] satisfies NavItem[],
    blog: { label: "Blog", href: "/blog/" } satisfies NavItem,
    cta: {
      label: "Voir les offres",
      href: "/#work",
    },
  },
  hero: {
    eyebrow: "Amine · The Unreliable Engineer",
    title: "Comprendre ce qui se passe vraiment dans la tech.",
    audience:
      "Pour les équipes tech, profils seniors et indépendants qui veulent lire un marché, une décision ou un système sans le vernis habituel.",
    offerLine: "Trois offres: clarifier votre positionnement, suivre votre progression, analyser un cas réel.",
    body:
      "Je parle d'IA, d'incidents, de leaks, de marché et de production. Puis j'aide sur les situations où ces sujets deviennent très concrets.",
    primaryCta: {
      label: "Voir les trois offres",
      href: "#work",
    },
    secondaryCta: {
      label: "Voir les preuves",
      href: "#proof",
    },
    consultation: {
      label: "Lire le vrai signal",
      caption: "L'actualité donne le bruit. Le terrain permet de comprendre ce qui compte.",
      body:
        "On part d'un profil qui décroche peu de missions, d'une progression difficile à montrer ou d'un problème tech précis. Ensuite on trie les faits, les contraintes et les prochaines actions.",
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
    tag: "Travailler ensemble",
    title: "Trois formats.",
    cards: [
      {
        kicker: "Avant la mission",
        title: "Bilan de positionnement freelance",
        body:
          "Un entretien et une restitution pour mieux présenter, référencer et vendre votre profil.",
        href: "/offres/bilan-positionnement-freelance/",
        linkLabel: "Voir l'offre",
      },
      {
        kicker: "Pendant la mission",
        title: "Suivi de progression tech",
        body:
          "Trois mois pour suivre vos objectifs, documenter les progrès et préparer la suite.",
        href: "/offres/suivi-progression-tech/",
        linkLabel: "Voir l'offre",
      },
      {
        kicker: "Sur un cas précis",
        title: "Étude de cas tech",
        body:
          "Une consultation gratuite si le cas devient un contenu anonymisé, payante s'il reste privé.",
        href: "/offres/etude-de-cas-tech/",
        linkLabel: "Voir l'offre",
      },
    ] satisfies WorkCard[],
  },
  boundaries: {
    tag: "Périmètre",
    title: "Ce qui reste hors périmètre.",
    items: [
      {
        title: "Mission garantie",
        body: "Le bilan améliore le positionnement. Il ne garantit ni mission ni délai de signature.",
      },
      {
        title: "Décision à votre place",
        body: "Le suivi aide à documenter la progression. Il ne remplace pas votre manager ou votre équipe.",
      },
      {
        title: "Introduction automatique",
        body: "Une mise en relation dépend d'un besoin réel et d'un accord séparé avec l'entreprise.",
      },
      {
        title: "Publication surprise",
        body: "Une étude de cas éditoriale est enregistrée, anonymisée et validée avant diffusion.",
      },
    ] satisfies BoundaryItem[],
  },
  testimonials: {
    tag: "Témoignages",
    title: "Leurs retours.",
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
    tag: "Commencer",
    title: "Choisissez votre point de départ.",
    bullets: [
      "Clarifier votre profil freelance",
      "Suivre votre progression pendant trois mois",
      "Analyser un cas tech au téléphone",
    ],
    primaryCta: {
      label: "Voir les trois offres",
      href: "#work",
    },
  },
  socialSignal: {
    tag: "Signal public",
    title: "Je fais aussi de la création de contenu.",
    intro:
      "Je publie sur l'IA, les incidents, les leaks, le marché tech, la production et le freelancing — avec assez de terrain pour ne pas seulement commenter la timeline.",
    stats: [
      {
        value: "409+",
        countTo: 409,
        suffix: "",
        label: "publications sur les plateformes",
      },
      {
        value: "527k+",
        countTo: 527032,
        suffix: "",
        label: "vues et impressions",
      },
      {
        value: "22,1k+",
        countTo: 22069,
        suffix: "",
        label: "interactions",
      },
    ] satisfies SocialStat[],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/amineamanzou/",
        meta: "65,2k impressions, 841 réactions, 156 commentaires",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@theunreliableengi",
        meta: "175,7k vues, 5,3k likes, 345 commentaires",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/theunreliableengineer/",
        meta: "226k vues, 14,3k interactions, 2,7k followers",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61570743494074",
        meta: "9,6k vues, 35 interactions, 12 followers",
      },
      {
        label: "X",
        href: "https://x.com/TheUnreliableEn",
        meta: "185 posts, build logs et veille informationnelle",
      },
      {
        label: "Threads",
        href: "https://www.threads.com/@theunreliableengineer",
        meta: "Posts courts et conversations tech",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@theunreliableengineer",
        meta: "50,5k vues, 559 likes, 84 contenus",
      },
      {
        label: "GitHub",
        href: "https://github.com/amineamanzou",
        meta: "Labs, dotfiles, prises de notes",
      },
    ] satisfies SocialLink[],
  },
} as const;
