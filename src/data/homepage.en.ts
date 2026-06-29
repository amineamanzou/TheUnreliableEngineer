import type {
  BoundaryItem,
  LogoItem,
  NavItem,
  ProofItem,
  SocialLink,
  SocialStat,
  TestimonialCard,
  WorkCard,
} from "./homepage.fr";

export const homepageEn = {
  meta: {
    title: "The Unreliable Engineer | Technical clarification and readable strategy",
    description:
      "Independent advisory to make a confusing technical or strategic situation readable enough to decide the right next step.",
  },
  topbar: {
    brand: "The Unreliable Engineer",
    meta: "",
    nav: [
      { label: "Paths", href: "#work" },
      { label: "Proof", href: "#proof" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Start here", href: "#contact" },
    ] satisfies NavItem[],
    blog: { label: "Blog", href: "/en/blog/" } satisfies NavItem,
    cta: {
      label: "Book 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=60-minute%20clarification%20session",
    },
  },
  hero: {
    eyebrow: "Amine · The Unreliable Engineer",
    title: "Clarify the real issue before starting the machine.",
    audience:
      "For tech teams, senior profiles, independents and decision-makers who need to make a confused situation readable and decidable.",
    offerLine: "Entry point: 60 minutes to leave with a sharper decision.",
    body:
      "I help untangle situations where architecture, observability, AI, content and market perception get mixed too quickly.",
    primaryCta: {
      label: "Book 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=60-minute%20clarification%20session",
    },
    secondaryCta: {
      label: "See proof",
      href: "#proof",
    },
    consultation: {
      label: "Clarify the problem",
      caption: "A blurry situation does not need a bigger plan first. It needs to become readable.",
      body:
        "We start from reality: context, constraints, tensions, weak signals. Then we separate what needs framing, support, positioning, an opportunity, or a qualified introduction.",
      points: [
        {
          label: "Symptom",
          value: "What the team keeps repeating without being able to decide.",
        },
        {
          label: "Constraint",
          value: "What makes the topic politically, technically or commercially sensitive.",
        },
        {
          label: "Decision",
          value: "What must become arbitrable before time, budget or a relationship is committed.",
        },
        {
          label: "Output",
          value: "Clarify, frame, support, connect, or stop cleanly.",
        },
      ],
    },
  },
  proof: {
    tag: "Proof",
    intro:
      "The work is grounded in real contexts: large accounts, energy, telecom, critical production, operational debt and shared responsibilities.",
    callout:
      "The expected value is not one more opinion. It is a clearer reading of the problem, its constraints and what it makes possible.",
    logos: [
      {
        label: "Orange",
        src: "/brand/logos/orange.jpeg",
        context: "Telecom / production",
        status: "approved_logo",
        supportedClaim: "Production and large-account experience",
      },
      {
        label: "Odigo",
        src: "/brand/logos/odigo.jpeg",
        context: "Operational systems",
        status: "approved_logo",
        supportedClaim: "Operational systems and reliability",
      },
      {
        label: "Enedis",
        src: "/brand/logos/enedis.jpeg",
        context: "Energy / large-scale IT",
        status: "approved_logo",
        supportedClaim: "Energy, large-scale IT and observability",
      },
    ] satisfies LogoItem[],
    items: [
      {
        label: "Observability",
        meta: "Signal, alerting, team practices",
        status: "descriptor_first",
        supportedClaim: "Clarify useful signal before adding dashboards",
      },
      {
        label: "SRE / DevOps",
        meta: "Production, incidents, reliability",
        status: "descriptor_first",
        supportedClaim: "Read production and reliability constraints",
      },
      {
        label: "Architecture",
        meta: "Internal systems, flows, debt",
        status: "descriptor_first",
        supportedClaim: "Make technical trade-offs more decidable",
      },
      {
        label: "Positioning",
        meta: "Freelance, content, market perception",
        status: "descriptor_first",
        supportedClaim: "Clarify the strategic perception of a senior profile",
      },
    ] satisfies ProofItem[],
  },
  work: {
    tag: "Possible paths",
    title: "One entry point, four possible paths.",
    intro:
      "This page does not sell a competing menu of services. It sells one capability: make the topic readable, then choose the right next step.",
    featured: {
      kicker: "Entry",
      meta: "60 minutes / real case / clarification",
      title: "60-minute clarification",
      body:
        "A short session to formulate the problem, constraints, blind spots and the next useful decision.",
    },
    cards: [
      {
        kicker: "Framing",
        title: "Technical framing",
        body:
          "A few days to turn a reliability, observability, architecture, debt or AI topic into a usable decision plan.",
      },
      {
        kicker: "Ongoing",
        title: "Senior support",
        body:
          "A regular cadence to challenge trade-offs, technical narrative, priorities and weak signals.",
      },
      {
        kicker: "Positioning",
        title: "Positioning and opportunities",
        body:
          "Make an offer, story or senior trajectory more readable before opening an opportunity or producing content.",
      },
      {
        kicker: "Qualified signal",
        title: "Qualified introductions",
        body:
          "Open a conversation only when context, value and signal are clear enough for both sides.",
      },
    ] satisfies WorkCard[],
  },
  boundaries: {
    tag: "What it is not",
    title: "Not a service menu. Not a magic promise.",
    intro:
      "Framing protects as much as action does: sometimes the right next step is to launch nothing, or to avoid opening a conversation too early.",
    items: [
      {
        title: "Not a 40-page audit",
        body: "The useful deliverable is a clearer decision, not a document that reassures without changing what happens next.",
      },
      {
        title: "Not a magic AI promise",
        body: "If AI is not the right lever, we say it before building around a buzzword.",
      },
      {
        title: "Not vague coaching",
        body: "The discussion starts from a real case: constraints, signals, trade-offs, next actions.",
      },
      {
        title: "Not automatic networking",
        body: "An introduction has value only when the signal is clear for both sides.",
      },
    ] satisfies BoundaryItem[],
  },
  testimonials: {
    tag: "Testimonials",
    title: "What people remember from the work.",
    intro:
      "The recommendations mostly point to one thing: the ability to raise the quality of reading, technically and strategically.",
    cards: [
      {
        quote:
          "Amine is exceptionally technically competent and carries a first-rate strategic vision of observability.",
        attribution: "Amin",
        meta: "Project management · Enedis",
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "Strategic vision of observability",
      },
      {
        quote:
          "Working with Amine guarantees that the level of discussion rises, both technically and strategically.",
        attribution: "Valentin",
        meta: "Observability & SRE Expert Freelance · Enedis",
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "Higher-quality technical and strategic discussion",
      },
      {
        quote:
          "Amine is an experienced SRE I recommend for any solution or platform project at scale.",
        attribution: "Hichem",
        meta: "Software Architect / Engineering Manager · Orange",
        href: "https://www.linkedin.com/in/amineamanzou/details/recommendations/",
        status: "testimonial_quote",
        supportedClaim: "SRE credibility and platforms at scale",
      },
    ] satisfies TestimonialCard[],
  },
  contact: {
    tag: "Start here",
    title: "We start by naming the topic. Then we choose the format.",
    bullets: [
      "A technical or strategic problem to make arbitrable",
      "An offer or senior trajectory to make more readable",
      "An opportunity or introduction to qualify before opening the right conversations",
    ],
    primaryCta: {
      label: "Book 60 minutes",
      href: "mailto:contact@theunreliable.engineer?subject=60-minute%20clarification%20session",
    },
    note:
      "Current format: 60 minutes on video, around a real case, to understand better before acting.",
  },
  socialSignal: {
    tag: "Public signal",
    title: "Content is also a lab.",
    intro:
      "I publish to test angles, document systems and expose real frictions: observability, AI agents, production, freelancing and homemade tooling.",
    stats: [
      {
        value: "409+",
        countTo: 409,
        suffix: "",
        label: "posts across platforms",
      },
      {
        value: "527k+",
        countTo: 527032,
        suffix: "",
        label: "views and impressions",
      },
      {
        value: "22.1k+",
        countTo: 22069,
        suffix: "",
        label: "interactions",
      },
    ] satisfies SocialStat[],
    links: [
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/amineamanzou/",
        meta: "65.2k impressions, 841 reactions, 156 comments",
      },
      {
        label: "TikTok",
        href: "https://www.tiktok.com/@theunreliableengi",
        meta: "175.7k views, 5.3k likes, 345 comments",
      },
      {
        label: "Instagram",
        href: "https://www.instagram.com/theunreliableengineer/",
        meta: "226k views, 14.3k interactions, 2.7k followers",
      },
      {
        label: "Facebook",
        href: "https://www.facebook.com/profile.php?id=61570743494074",
        meta: "9.6k views, 35 interactions, 12 followers",
      },
      {
        label: "X",
        href: "https://x.com/TheUnreliableEn",
        meta: "185 posts, build logs and information watch",
      },
      {
        label: "Threads",
        href: "https://www.threads.com/@theunreliableengineer",
        meta: "Short posts and tech conversations",
      },
      {
        label: "YouTube",
        href: "https://www.youtube.com/@theunreliableengineer",
        meta: "50.5k views, 559 likes, 84 pieces of content",
      },
      {
        label: "GitHub",
        href: "https://github.com/amineamanzou",
        meta: "Labs, dotfiles, notes",
      },
    ] satisfies SocialLink[],
  },
} as const;
