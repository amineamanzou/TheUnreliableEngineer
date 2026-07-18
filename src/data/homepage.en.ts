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
      { label: "Proof", href: "#proof" },
      { label: "Offers", href: "#work" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Start here", href: "#contact" },
    ] satisfies NavItem[],
    blog: { label: "Blog", href: "/en/blog/" } satisfies NavItem,
    cta: {
      label: "See the offers",
      href: "/en/#work",
    },
  },
  hero: {
    eyebrow: "Amine · The Unreliable Engineer",
    title: "Understand what is really happening in tech.",
    audience:
      "For tech teams, senior profiles and independents who want to read a market, decision or system without the usual varnish.",
    offerLine: "Three offers: clarify your positioning, track your progress, analyse a real case.",
    body:
      "I cover AI, incidents, leaks, the market and production. Then I help when these subjects become very concrete.",
    primaryCta: {
      label: "See all three offers",
      href: "#work",
    },
    secondaryCta: {
      label: "See proof",
      href: "#proof",
    },
    consultation: {
      label: "Read the real signal",
      caption: "News brings the noise. Field experience shows what matters.",
      body:
        "We start from a profile that attracts few missions, progress that is hard to show or a specific tech problem. Then we sort the facts, constraints and next actions.",
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
    tag: "Work together",
    title: "Three formats.",
    cards: [
      {
        kicker: "Before the mission",
        title: "Freelance positioning review",
        body:
          "An interview and written review to improve how your profile is presented, indexed and sold.",
        href: "/en/offers/freelance-positioning-review/",
        linkLabel: "View the offer",
      },
      {
        kicker: "During the mission",
        title: "Tech progression follow-up",
        body:
          "Three months to track goals, document progress and prepare what comes next.",
        href: "/en/offers/tech-progression-follow-up/",
        linkLabel: "View the offer",
      },
      {
        kicker: "One specific case",
        title: "Tech case study",
        body:
          "A free consultation when the case becomes anonymised content, paid when it stays private.",
        href: "/en/offers/tech-case-study/",
        linkLabel: "View the offer",
      },
    ] satisfies WorkCard[],
  },
  boundaries: {
    tag: "Scope",
    title: "What stays out of scope.",
    items: [
      {
        title: "Guaranteed mission",
        body: "The review improves positioning. It guarantees neither a mission nor a signing date.",
      },
      {
        title: "Decisions made for you",
        body: "The follow-up documents progress. It does not replace your manager or team.",
      },
      {
        title: "Automatic introduction",
        body: "An introduction depends on a real need and a separate agreement with the company.",
      },
      {
        title: "Surprise publication",
        body: "An editorial case study is recorded, anonymised and approved before publication.",
      },
    ] satisfies BoundaryItem[],
  },
  testimonials: {
    tag: "Testimonials",
    title: "Their feedback.",
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
    tag: "Start",
    title: "Choose your starting point.",
    bullets: [
      "Clarify your freelance profile",
      "Track your progress for three months",
      "Analyse a tech case over the phone",
    ],
    primaryCta: {
      label: "See all three offers",
      href: "#work",
    },
  },
  socialSignal: {
    tag: "Public signal",
    title: "I also create content.",
    intro:
      "I publish about AI, incidents, leaks, the tech market, production and freelancing — with enough field experience to do more than comment on the timeline.",
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
