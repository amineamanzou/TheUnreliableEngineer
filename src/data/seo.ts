import type { CollectionEntry } from "astro:content";
import { assetPath, type Locale } from "./i18n";
import {
  authorName,
  brandName,
  defaultSocialImage,
  productionSiteUrl,
  publicSocialUrls,
  siteName,
} from "./site";

export type JsonLd = Record<string, unknown> | Array<Record<string, unknown>>;

export const defaultSocialImageAlt =
  "The Unreliable Engineer character thinking in front of a technical terminal";

export const publicSameAs = publicSocialUrls.map(({ href }) => href);

const siteBase = (site?: URL) => site ?? new URL(productionSiteUrl);

export const absoluteUrl = (path: string, site?: URL) => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return new URL(assetPath(path), siteBase(site)).toString();
};

export const pageId = (path: string, site?: URL) => `${absoluteUrl(path, site)}#webpage`;
export const personId = (site?: URL) => `${absoluteUrl("/", site)}#person`;
export const serviceId = (site?: URL) => `${absoluteUrl("/", site)}#professional-service`;
export const websiteId = (site?: URL) => `${absoluteUrl("/", site)}#website`;

export const personJsonLd = (site?: URL) => ({
  "@type": "Person",
  "@id": personId(site),
  name: authorName,
  url: absoluteUrl("/", site),
  sameAs: publicSameAs,
  brand: {
    "@id": serviceId(site),
  },
  knowsAbout: [
    "Observability",
    "SRE",
    "DevOps",
    "OpenTelemetry",
    "Technical strategy",
    "Technical communication",
  ],
});

export const professionalServiceJsonLd = (site?: URL) => ({
  "@type": "ProfessionalService",
  "@id": serviceId(site),
  name: brandName,
  url: absoluteUrl("/", site),
  founder: {
    "@id": personId(site),
  },
  sameAs: publicSameAs,
  areaServed: "France",
  serviceType: [
    "Technical clarification",
    "Observability advisory",
    "SRE and DevOps advisory",
    "Technical positioning",
  ],
});

export const websiteJsonLd = (site?: URL, locale: Locale = "fr") => ({
  "@type": "WebSite",
  "@id": websiteId(site),
  name: siteName,
  url: absoluteUrl("/", site),
  inLanguage: locale,
  publisher: {
    "@id": serviceId(site),
  },
});

export const webPageJsonLd = ({
  path,
  title,
  description,
  locale,
  site,
}: {
  path: string;
  title: string;
  description: string;
  locale: Locale;
  site?: URL;
}) => ({
  "@type": "WebPage",
  "@id": pageId(path, site),
  url: absoluteUrl(path, site),
  name: title,
  description,
  inLanguage: locale,
  isPartOf: {
    "@id": websiteId(site),
  },
  about: {
    "@id": serviceId(site),
  },
});

export const homeJsonLd = ({
  path,
  title,
  description,
  locale,
  site,
}: {
  path: string;
  title: string;
  description: string;
  locale: Locale;
  site?: URL;
}) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteJsonLd(site, locale),
    webPageJsonLd({ path, title, description, locale, site }),
    personJsonLd(site),
    professionalServiceJsonLd(site),
  ],
});

export const blogJsonLd = ({
  path,
  title,
  description,
  locale,
  site,
}: {
  path: string;
  title: string;
  description: string;
  locale: Locale;
  site?: URL;
}) => ({
  "@context": "https://schema.org",
  "@graph": [
    websiteJsonLd(site, locale),
    {
      "@type": "Blog",
      "@id": `${absoluteUrl(path, site)}#blog`,
      url: absoluteUrl(path, site),
      name: title,
      description,
      inLanguage: locale,
      isPartOf: {
        "@id": websiteId(site),
      },
      publisher: {
        "@id": serviceId(site),
      },
    },
  ],
});

export const articleJsonLd = ({
  article,
  path,
  image,
  site,
}: {
  article: CollectionEntry<"articles">;
  path: string;
  image?: string;
  site?: URL;
}) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": `${absoluteUrl(path, site)}#blogposting`,
  headline: article.data.title,
  description: article.data.excerpt,
  datePublished: article.data.publishedAt,
  dateModified: article.data.modifiedAt ?? article.data.publishedAt,
  author: personJsonLd(site),
  publisher: {
    "@id": serviceId(site),
    "@type": "ProfessionalService",
    name: brandName,
  },
  image: image ? [absoluteUrl(image, site)] : [absoluteUrl(defaultSocialImage, site)],
  inLanguage: article.data.locale,
  mainEntityOfPage: {
    "@id": pageId(path, site),
  },
  discussionUrl: article.data.sourceUrl,
});

export const localeToOgLocale = (locale: Locale) => (locale === "fr" ? "fr_FR" : "en_US");

export const localizedHomeImage = (locale: Locale) =>
  locale === "fr" ? defaultSocialImageAlt : "The Unreliable Engineer character thinking through a technical decision";

export const localizedBlogImageAlt = (locale: Locale) =>
  locale === "fr"
    ? "The Unreliable Engineer réfléchit devant le terminal du blog"
    : "The Unreliable Engineer thinking in front of the blog terminal";
