import type { Locale } from "./i18n";

export type OfferKey = "positioning" | "progress" | "case-study";
export type OfferBookingId = "positioning_review" | "tech_progression" | "tech_case_study";
type OfferBookingUrl = `https://calendar.google.com/calendar/u/0/appointments/schedules/${string}`;

export const offerBookingUrls = {
  positioning_review:
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub",
  tech_progression:
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG",
  tech_case_study:
    "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5",
} as const satisfies Record<OfferBookingId, OfferBookingUrl>;

export type OfferCopy = {
  key: OfferKey;
  locale: Locale;
  path: string;
  alternatePath: string;
  meta: {
    title: string;
    description: string;
  };
  eyebrow: string;
  title: string;
  promise: string;
  audience: string;
  format: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  situationTitle: string;
  situations: string[];
  bringTitle: string;
  bring: string[];
  leaveTitle: string;
  leave: string[];
  processTitle: string;
  process: Array<{ title: string; body: string }>;
  boundaryTitle: string;
  boundaries: string[];
  closingTitle: string;
  closingBody: string;
};

export const offersFr: Record<OfferKey, OfferCopy> = {
  positioning: {
    key: "positioning",
    locale: "fr",
    path: "/offres/bilan-positionnement-freelance/",
    alternatePath: "/en/offers/freelance-positioning-review/",
    meta: {
      title: "Bilan de positionnement freelance tech | The Unreliable Engineer",
      description:
        "Un entretien et une restitution écrite pour mieux présenter, référencer et vendre un profil freelance tech.",
    },
    eyebrow: "Bilan de positionnement freelance",
    title: "Rendre votre profil assez clair pour être trouvé par les bonnes missions.",
    promise:
      "Après un entretien sur votre parcours et vos objectifs, vous recevez une stratégie concrète pour présenter votre valeur et améliorer votre référencement.",
    audience:
      "Pour les freelances tech dont le CV ou le profil LinkedIn décrit les compétences sans rendre leur valeur évidente pour un client.",
    format: "Questionnaire · entretien de 60 minutes · restitution écrite · mise en relation éventuelle",
    primaryCta: {
      label: "Réserver un appel de cadrage",
      href: offerBookingUrls.positioning_review,
    },
    secondaryCta: { label: "Voir les trois offres", href: "/#work" },
    situationTitle: "Ce bilan est utile si",
    situations: [
      "votre CV énumère des tâches sans montrer les problèmes que vous savez résoudre",
      "les recruteurs comprennent votre stack mais positionnent mal votre niveau",
      "votre profil apparaît peu dans les recherches qui correspondent à votre expérience",
      "vous ciblez trop de rôles, de secteurs ou de types de missions à la fois",
    ],
    bringTitle: "À préparer",
    bring: [
      "votre CV et votre profil LinkedIn actuels",
      "deux ou trois expériences dont vous connaissez précisément le contexte et le résultat",
      "vos objectifs de mission, contraintes, disponibilité et TJM",
    ],
    leaveTitle: "La restitution",
    leave: [
      "un positionnement compréhensible par un client non spécialiste",
      "les expériences et preuves à mettre en avant",
      "des recommandations pour le CV, LinkedIn et les plateformes freelance",
      "un plan de recherche et de prise de contact adapté à votre cible",
    ],
    processTitle: "Le déroulé",
    process: [
      {
        title: "Préparer",
        body: "Le questionnaire rassemble votre profil, vos objectifs et les missions que vous voulez réellement accepter.",
      },
      {
        title: "Creuser",
        body: "Pendant l'entretien, on revient sur les responsabilités, les résultats et les contraintes que le profil actuel laisse de côté.",
      },
      {
        title: "Restituer",
        body: "Vous recevez les corrections prioritaires et une stratégie de présentation, de référencement et de recherche.",
      },
      {
        title: "Mettre en relation",
        body: "Si une demande correspond ensuite à votre profil, je vous présente au client concerné.",
      },
    ],
    boundaryTitle: "Limites",
    boundaries: [
      "le bilan ne garantit ni mission ni délai de signature",
      "je n'envoie pas de messages ou de candidatures en votre nom",
      "une introduction dépend toujours d'un besoin réel côté client",
      "la mise en relation et la commission d'apport d'affaires sont contractualisées séparément avec l'entreprise",
    ],
    closingTitle: "Avant le bilan",
    closingBody: "Cet appel de 30 minutes sert à vérifier votre situation et à cadrer le bilan. Il ne réserve pas encore l'entretien de 60 minutes.",
  },
  progress: {
    key: "progress",
    locale: "fr",
    path: "/offres/suivi-progression-tech/",
    alternatePath: "/en/offers/tech-progression-follow-up/",
    meta: {
      title: "Suivi de progression tech, SRE et freelance | The Unreliable Engineer",
      description:
        "Un suivi de trois mois pour prendre du recul sur une mission ou un poste, documenter sa progression et préparer la suite.",
    },
    eyebrow: "Suivi de progression tech",
    title: "Rendre votre progression visible, mission après mission.",
    promise:
      "Pendant trois mois, un point régulier permet de suivre vos objectifs, les difficultés rencontrées et les preuves utiles pour la suite de votre parcours.",
    audience:
      "Pour les SRE, freelances et salariés tech qui commencent une mission, changent de rôle ou veulent rendre leur progression plus visible.",
    format: "3 mois · 1 point mensuel · journal de progression · plan d'action",
    primaryCta: {
      label: "Planifier le premier échange",
      href: offerBookingUrls.tech_progression,
    },
    secondaryCta: { label: "Voir les trois offres", href: "/#work" },
    situationTitle: "Ce suivi est utile si",
    situations: [
      "vous commencez une nouvelle mission sans objectif de progression explicite",
      "vous passez vers un rôle SRE ou freelance et devez construire de nouveaux repères",
      "votre travail est utile mais reste difficile à montrer au client ou au management",
      "vous enchaînez les sujets sans conserver les preuves de ce que vous apprenez",
    ],
    bringTitle: "À chaque point",
    bring: [
      "les objectifs fixés au démarrage de la mission ou du poste",
      "une situation récente qui a demandé un choix, un apprentissage ou une prise de responsabilité",
      "les retours reçus et les résultats que vous pouvez documenter",
    ],
    leaveTitle: "Vous conservez",
    leave: [
      "un objectif professionnel suivi sur trois mois",
      "les actions décidées à la fin de chaque rendez-vous",
      "un journal des compétences, responsabilités et résultats acquis",
      "des preuves réutilisables pour un bilan, un CV ou une prochaine mission",
    ],
    processTitle: "La cadence",
    process: [
      {
        title: "Fixer le cap",
        body: "Le premier rendez-vous définit une progression observable dans le contexte de la mission ou du poste.",
      },
      {
        title: "Faire le point",
        body: "Chaque mois, on relit les situations vécues, les retours reçus et les blocages qui ralentissent l'objectif.",
      },
      {
        title: "Garder les preuves",
        body: "On documente les résultats, les nouvelles responsabilités et la prochaine action à tester.",
      },
    ],
    boundaryTitle: "Limites",
    boundaries: [
      "ce suivi ne remplace pas un audit technique ou l'encadrement de votre équipe",
      "je ne prends pas les décisions d'architecture ou de management à votre place",
      "aucune promotion, augmentation de TJM ou nouvelle mission n'est garantie",
      "les échanges restent limités aux rendez-vous et documents convenus",
    ],
    closingTitle: "Avant le suivi",
    closingBody: "Ce premier échange de 30 minutes sert à cadrer votre objectif et à vérifier si le suivi de trois mois correspond à la situation.",
  },
  "case-study": {
    key: "case-study",
    locale: "fr",
    path: "/offres/etude-de-cas-tech/",
    alternatePath: "/en/offers/tech-case-study/",
    meta: {
      title: "Étude de cas tech au téléphone | The Unreliable Engineer",
      description:
        "Un appel de proposition pour une situation tech ou carrière réelle, avant une étude éditoriale gratuite ou une future consultation privée.",
    },
    eyebrow: "Étude de cas tech",
    title: "Un problème réel, analysé au téléphone.",
    promise:
      "L'appel de proposition permet de vérifier si le cas relève de la version éditoriale gratuite ou d'une future consultation privée. La consultation privée de 60 minutes n'est pas encore réservable.",
    audience:
      "Pour une infrastructure fragile, un projet qui dérive, un travail mal valorisé ou un passage du salariat au freelance.",
    format: "Appel de proposition de 30 minutes · version éditoriale gratuite · consultation privée à venir",
    primaryCta: {
      label: "Proposer mon étude de cas",
      href: offerBookingUrls.tech_case_study,
    },
    secondaryCta: { label: "Voir les trois offres", href: "/#work" },
    situationTitle: "Cas recherchés",
    situations: [
      "une infrastructure qui fonctionne encore mais que personne n'ose modifier",
      "un projet où le planning, la dette et les responsabilités ne sont plus alignés",
      "un lead ou un salarié qui n'arrive pas à rendre son travail visible",
      "un salarié qui veut préparer sérieusement son passage au freelance",
    ],
    bringTitle: "À préparer",
    bring: [
      "une situation actuelle et suffisamment précise pour être analysée",
      "les faits, documents et tentatives déjà réalisés",
      "les informations publiables et celles qui doivent rester privées",
    ],
    leaveTitle: "À la fin de la consultation",
    leave: [
      "une formulation plus claire du problème",
      "les angles morts repérés pendant la conversation",
      "des actions ou vérifications à mener ensuite",
      "pour la version éditoriale, une validation de l'anonymisation avant publication",
    ],
    processTitle: "Le déroulé",
    process: [
      {
        title: "Proposer le cas",
        body: "Pendant un appel de 30 minutes, vous décrivez les faits, la question à traiter et les éléments qui doivent rester confidentiels.",
      },
      {
        title: "Choisir le format",
        body: "Un cas retenu pour publication est gratuit. La consultation privée sera payante lorsqu'elle pourra être réservée après paiement.",
      },
      {
        title: "Enregistrer l'appel",
        body: "La conversation dure 60 minutes et reste centrée sur une situation existante, ses contraintes et ses conséquences.",
      },
      {
        title: "Anonymiser et publier",
        body: "La voix, les noms, l'entreprise et les détails sensibles suivent le niveau d'anonymisation validé avant diffusion.",
      },
    ],
    boundaryTitle: "Limites",
    boundaries: [
      "aucun enregistrement ou extrait n'est publié par surprise",
      "la sélection éditoriale a lieu avant la réservation de la version gratuite",
      "la consultation privée payante de 60 minutes n'est pas encore réservable",
      "une heure ne suffit pas à résoudre une organisation entière",
      "le format exclut les conseils juridiques, médicaux ou financiers",
    ],
    closingTitle: "Proposer une étude de cas",
    closingBody: "L'appel de 30 minutes sert à qualifier le cas et à choisir la suite. Il ne réserve pas la consultation privée de 60 minutes.",
  },
};

export const offersEn: Record<OfferKey, OfferCopy> = {
  positioning: {
    ...offersFr.positioning,
    locale: "en",
    path: "/en/offers/freelance-positioning-review/",
    alternatePath: "/offres/bilan-positionnement-freelance/",
    meta: {
      title: "Freelance tech positioning review | The Unreliable Engineer",
      description:
        "An interview and written review to improve how a freelance tech profile is presented, indexed and sold.",
    },
    eyebrow: "Freelance positioning review",
    title: "Make your profile clear enough to be found for the right missions.",
    promise:
      "After an interview about your experience and goals, you receive a concrete strategy to present your value and improve discoverability.",
    audience:
      "For tech freelancers whose CV or LinkedIn profile lists skills without making their value obvious to a client.",
    format: "Questionnaire · 60-minute interview · written review · optional introduction",
    primaryCta: {
      label: "Book an intro call",
      href: offerBookingUrls.positioning_review,
    },
    secondaryCta: { label: "See all three offers", href: "/en/#work" },
    situationTitle: "This review is useful if",
    situations: [
      "your CV lists tasks without showing the problems you can solve",
      "recruiters understand your stack but misread your level",
      "your profile rarely appears in searches that match your experience",
      "you target too many roles, sectors or mission types at once",
    ],
    bringTitle: "Prepare",
    bring: [
      "your current CV and LinkedIn profile",
      "two or three experiences where you know the context and result precisely",
      "mission goals, constraints, availability and rate",
    ],
    leaveTitle: "The review",
    leave: [
      "positioning a non-specialist client can understand",
      "the experience and proof to lead with",
      "recommendations for your CV, LinkedIn and freelance platforms",
      "a search and outreach plan aligned with your target",
    ],
    processTitle: "How it works",
    process: [
      {
        title: "Prepare",
        body: "The questionnaire captures your profile, goals and the missions you would actually accept.",
      },
      {
        title: "Investigate",
        body: "During the interview, we revisit responsibilities, results and constraints your current profile leaves out.",
      },
      {
        title: "Review",
        body: "You receive the priority changes and a strategy for presentation, discoverability and search.",
      },
      {
        title: "Introduce",
        body: "If a later request matches your profile, I introduce you to the relevant client.",
      },
    ],
    boundaryTitle: "Limits",
    boundaries: [
      "the review does not guarantee a mission or signing date",
      "I do not send messages or applications in your name",
      "an introduction always depends on a real client request",
      "introductions and referral fees are contracted separately with the company",
    ],
    closingTitle: "Before the review",
    closingBody: "This 30-minute call checks your situation and scopes the review. It does not book the 60-minute interview yet.",
  },
  progress: {
    ...offersFr.progress,
    locale: "en",
    path: "/en/offers/tech-progression-follow-up/",
    alternatePath: "/offres/suivi-progression-tech/",
    meta: {
      title: "Tech, SRE and freelance progression follow-up | The Unreliable Engineer",
      description:
        "A three-month follow-up to step back from a mission or role, document progress and prepare what comes next.",
    },
    eyebrow: "Tech progression follow-up",
    title: "Make your progress visible, mission after mission.",
    promise:
      "For three months, a regular session tracks your goals, difficulties and the proof that will matter for the next step in your career.",
    audience:
      "For SREs, freelancers and tech employees starting a mission, changing roles or trying to make their progress visible.",
    format: "3 months · 1 monthly session · progress log · action plan",
    primaryCta: {
      label: "Schedule the first conversation",
      href: offerBookingUrls.tech_progression,
    },
    secondaryCta: { label: "See all three offers", href: "/en/#work" },
    situationTitle: "This follow-up is useful if",
    situations: [
      "you start a new mission without an explicit progression goal",
      "you are moving into SRE or freelance work and need new reference points",
      "your work is useful but difficult to show to the client or management",
      "you move from topic to topic without keeping proof of what you learn",
    ],
    bringTitle: "At each session",
    bring: [
      "the goals set at the start of the mission or role",
      "a recent situation involving a choice, learning step or new responsibility",
      "feedback received and results you can document",
    ],
    leaveTitle: "You keep",
    leave: [
      "one professional goal tracked over three months",
      "the actions agreed at the end of each session",
      "a log of skills, responsibilities and results gained",
      "proof reusable in a review, CV or future mission",
    ],
    processTitle: "The cadence",
    process: [
      {
        title: "Set the direction",
        body: "The first session defines observable progress within the context of the mission or role.",
      },
      {
        title: "Review the month",
        body: "Each month, we revisit situations, feedback and blockers slowing the objective.",
      },
      {
        title: "Keep the proof",
        body: "We document results, new responsibilities and the next action to test.",
      },
    ],
    boundaryTitle: "Limits",
    boundaries: [
      "this follow-up does not replace a technical audit or your team's management",
      "I do not make architecture or management decisions for you",
      "no promotion, rate increase or new mission is guaranteed",
      "exchanges are limited to the agreed sessions and documents",
    ],
    closingTitle: "Before the follow-up",
    closingBody: "This first 30-minute conversation scopes your goal and checks whether the three-month follow-up fits the situation.",
  },
  "case-study": {
    ...offersFr["case-study"],
    locale: "en",
    path: "/en/offers/tech-case-study/",
    alternatePath: "/offres/etude-de-cas-tech/",
    meta: {
      title: "Phone-based tech case study | The Unreliable Engineer",
      description:
        "A proposal call about a real tech or career situation, before a free editorial case study or a future private consultation.",
    },
    eyebrow: "Tech case study",
    title: "A real problem, analysed over the phone.",
    promise:
      "The proposal call checks whether the case fits the free editorial format or a future private consultation. The private 60-minute consultation cannot be booked yet.",
    audience:
      "For fragile infrastructure, a drifting project, poorly recognised work or a move from employment to freelancing.",
    format: "30-minute proposal call · free editorial version · private consultation to come",
    primaryCta: {
      label: "Propose a case study",
      href: offerBookingUrls.tech_case_study,
    },
    secondaryCta: { label: "See all three offers", href: "/en/#work" },
    situationTitle: "Cases wanted",
    situations: [
      "infrastructure that still works but nobody dares modify",
      "a project where schedule, debt and ownership are no longer aligned",
      "a lead or employee who cannot make their work visible",
      "an employee seriously preparing a move into freelancing",
    ],
    bringTitle: "Prepare",
    bring: [
      "a current situation precise enough to analyse",
      "the facts, documents and attempts already made",
      "what may be published and what must remain private",
    ],
    leaveTitle: "At the end of the consultation",
    leave: [
      "a clearer statement of the problem",
      "blind spots found during the conversation",
      "actions or checks to carry out next",
      "for the editorial version, a review of anonymisation before publication",
    ],
    processTitle: "How it works",
    process: [
      {
        title: "Propose the case",
        body: "During a 30-minute call, describe the facts, the question to address and the details that must remain confidential.",
      },
      {
        title: "Choose the format",
        body: "A case selected for publication is free. The private consultation will be paid once it can be booked after payment.",
      },
      {
        title: "Record the call",
        body: "The conversation lasts 60 minutes and stays focused on an existing situation, its constraints and consequences.",
      },
      {
        title: "Anonymise and publish",
        body: "Voice, names, company and sensitive details follow the anonymisation level approved before publication.",
      },
    ],
    boundaryTitle: "Limits",
    boundaries: [
      "no recording or extract is published by surprise",
      "editorial selection happens before the free version is booked",
      "the paid private 60-minute consultation cannot be booked yet",
      "one hour cannot solve an entire organisation",
      "the format excludes legal, medical and financial advice",
    ],
    closingTitle: "Propose a case study",
    closingBody: "The 30-minute call qualifies the case and decides the next step. It does not book the private 60-minute consultation.",
  },
};

export const offersByLocale = { fr: offersFr, en: offersEn } as const;
