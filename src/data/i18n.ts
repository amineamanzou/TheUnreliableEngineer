import { homepageEn } from "./homepage.en";
import { homepageFr } from "./homepage.fr";

export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const homepageByLocale = {
  fr: homepageFr,
  en: homepageEn,
} as const;

export const uiByLocale = {
  fr: {
    language: {
      ariaLabel: "Changer de langue",
      fr: "FR",
      en: "EN",
    },
    topbar: {
      homeAria: "Accueil The Unreliable Engineer",
      navAria: "Navigation principale",
    },
    home: {
      signalNodes: ["symptôme", "contrainte", "décision"],
      characterAlt: "The Unreliable Engineer présente son point de vue éditorial",
      logoRailAria: "Références clients",
      testimonialsAria: "Lire le témoignage LinkedIn de",
      linkedInLabel: "Lire sur LinkedIn",
      socialStatsAria: "Statistiques de production de contenu",
      socialLinksAria: "Présence sur les réseaux sociaux",
      formatLocale: "fr-FR",
    },
    blog: {
      title: "Blog | The Unreliable Engineer",
      description:
        "Articles longs, notes techniques et retours d'expérience de The Unreliable Engineer, publiés hors plateforme sociale.",
      terminalAria: "Terminal de recherche du blog",
      terminalLabel: "Commande terminal",
      terminalHint:
        "Tab complète, ↑ ↓ rejouent l'historique, fzf ouvre une recherche interactive.",
      terminalTips: "Astuce: Tab complète les commandes et les articles.",
      terminalAsideAlt: "The Unreliable Engineer réfléchit devant le terminal du blog",
      terminalAsideAria: "The Unreliable Engineer réfléchit aux articles",
      terminalNoMatch: 'try rg "observabilité"',
      terminalEmptyPreview: "Change la recherche avec fzf &lt;texte&gt;.",
      terminalFileNotFound: "ls articles first",
      terminalUnknownCommand: "try fzf, ls, find, rg, ripgrep, open, read, cat, help",
      terminalResultsLabel: "résultat",
      terminalResultsPlural: "s",
      fzfTitle: "fzf articles",
      commandsAria: "Commandes disponibles",
      helpByCommand: {
        fzf: "Usage: fzf [query] · ouvre une recherche interactive, ↑ ↓ sélectionnent, Enter ouvre l'article.",
        ls: "Usage: ls · liste les articles par date de publication.",
        find: "Usage: find <texte> · filtre les titres, slugs, labels et extraits.",
        rg: "Usage: rg <texte> · cherche dans les titres, labels et extraits.",
        ripgrep: "Usage: ripgrep <texte> · alias bavard de rg.",
        open: "Usage: open <index|slug|texte> · ouvre l'article local correspondant.",
        read: "Usage: read <index|slug|texte> · ouvre l'article local correspondant.",
        cat: "Usage: cat <index|slug|texte> · ouvre l'article local correspondant.",
        help: "Usage: help [commande] · affiche les commandes disponibles ou l'aide d'une commande.",
      },
      articlesTag: "Articles",
      readMore: "Lire la suite",
      deletedHref: "/blog/internet-deleted/",
    },
    article: {
      sourceText: "Commentaires, réactions et discussion restent ouverts sur le post d'origine.",
      sourceCta: "Réagir sur LinkedIn",
    },
    deleted: {
      title: "Internet deleted | The Unreliable Engineer",
      description: "Easter egg terminal du blog The Unreliable Engineer.",
      lines: [
        ["internet", "deleted"],
        ["dns", "gone"],
        ["memes", "temporarily unavailable"],
        ["linkedin", "404, probably healthier this way"],
        ["rollback", "restore from cache?"],
      ],
      restoreBlog: "Restaurer le blog",
      backHome: "Retour au site",
    },
  },
  en: {
    language: {
      ariaLabel: "Change language",
      fr: "FR",
      en: "EN",
    },
    topbar: {
      homeAria: "Home The Unreliable Engineer",
      navAria: "Main navigation",
    },
    home: {
      signalNodes: ["symptom", "constraint", "decision"],
      characterAlt: "The Unreliable Engineer presents an editorial point of view",
      logoRailAria: "Client references",
      testimonialsAria: "Read LinkedIn testimonial from",
      linkedInLabel: "Read on LinkedIn",
      socialStatsAria: "Content production statistics",
      socialLinksAria: "Social media presence",
      formatLocale: "en-US",
    },
    blog: {
      title: "Blog | The Unreliable Engineer",
      description:
        "Long-form articles, technical notes and field notes from The Unreliable Engineer, published outside social platforms.",
      terminalAria: "Blog search terminal",
      terminalLabel: "Terminal command",
      terminalHint: "Tab completes, ↑ ↓ replay history, fzf opens interactive search.",
      terminalTips: "Tip: Tab completes commands and articles.",
      terminalAsideAlt: "The Unreliable Engineer thinking in front of the blog terminal",
      terminalAsideAria: "The Unreliable Engineer thinking about articles",
      terminalNoMatch: 'try rg "observability"',
      terminalEmptyPreview: "Change the search with fzf &lt;text&gt;.",
      terminalFileNotFound: "ls articles first",
      terminalUnknownCommand: "try fzf, ls, find, rg, ripgrep, open, read, cat, help",
      terminalResultsLabel: "result",
      terminalResultsPlural: "s",
      fzfTitle: "fzf articles",
      commandsAria: "Available commands",
      helpByCommand: {
        fzf: "Usage: fzf [query] · opens interactive search, ↑ ↓ select, Enter opens the article.",
        ls: "Usage: ls · lists articles by publication date.",
        find: "Usage: find <text> · filters titles, slugs, labels and excerpts.",
        rg: "Usage: rg <text> · searches titles, labels and excerpts.",
        ripgrep: "Usage: ripgrep <text> · verbose alias for rg.",
        open: "Usage: open <index|slug|text> · opens the matching local article.",
        read: "Usage: read <index|slug|text> · opens the matching local article.",
        cat: "Usage: cat <index|slug|text> · opens the matching local article.",
        help: "Usage: help [command] · shows available commands or help for one command.",
      },
      articlesTag: "Articles",
      readMore: "Read more",
      deletedHref: "/en/blog/internet-deleted/",
    },
    article: {
      sourceText: "Comments, reactions and discussion remain open on the original post.",
      sourceCta: "React on LinkedIn",
    },
    deleted: {
      title: "Internet deleted | The Unreliable Engineer",
      description: "Blog terminal easter egg from The Unreliable Engineer.",
      lines: [
        ["internet", "deleted"],
        ["dns", "gone"],
        ["memes", "temporarily unavailable"],
        ["linkedin", "404, probably healthier this way"],
        ["rollback", "restore from cache?"],
      ],
      restoreBlog: "Restore the blog",
      backHome: "Back to site",
    },
  },
} as const;

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const localizedPath = (locale: Locale, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return normalizedPath;
  }

  return normalizedPath === "/" ? `/${locale}/` : `/${locale}${normalizedPath}`;
};

export const otherLocale = (locale: Locale): Locale => (locale === "fr" ? "en" : "fr");

export const swapLocalePath = (locale: Locale, pathname: string) => {
  const cleanPath = pathname.replace(import.meta.env.BASE_URL, "/");
  if (locale === "fr") {
    return localizedPath("en", cleanPath);
  }

  return cleanPath.replace(/^\/en(?=\/|$)/, "") || "/";
};

export const assetPath = (path: string) =>
  path.startsWith("/") ? `${import.meta.env.BASE_URL}${path.slice(1)}` : path;
