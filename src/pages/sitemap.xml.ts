import { getCollection, type CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import { localizedPath, type Locale } from "../data/i18n";
import { absoluteUrl } from "../data/seo";

export const prerender = true;

type SitemapAlternate = {
  locale: Locale | "x-default";
  href: string;
};

type SitemapEntry = {
  path: string;
  lastmod?: string;
  alternates?: SitemapAlternate[];
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const getArticlePath = (article: CollectionEntry<"articles">) =>
  localizedPath(article.data.locale, `/blog/${article.data.articleSlug}/`);

const getTranslatedArticlePairs = (articles: CollectionEntry<"articles">[]) => {
  const byTranslationKey = new Map<string, Partial<Record<Locale, CollectionEntry<"articles">>>>();

  for (const article of articles) {
    const group = byTranslationKey.get(article.data.translationKey) ?? {};
    group[article.data.locale] = article;
    byTranslationKey.set(article.data.translationKey, group);
  }

  return byTranslationKey;
};

export async function GET({ site }: APIContext) {
  const articles = await getCollection("articles");
  const translatedArticles = getTranslatedArticlePairs(articles);
  const homeFr = localizedPath("fr", "/");
  const homeEn = localizedPath("en", "/");
  const blogFr = localizedPath("fr", "/blog/");
  const blogEn = localizedPath("en", "/blog/");
  const entries: SitemapEntry[] = [
    {
      path: homeFr,
      alternates: [
        { locale: "fr", href: absoluteUrl(homeFr, site) },
        { locale: "en", href: absoluteUrl(homeEn, site) },
        { locale: "x-default", href: absoluteUrl(homeFr, site) },
      ],
    },
    {
      path: homeEn,
      alternates: [
        { locale: "fr", href: absoluteUrl(homeFr, site) },
        { locale: "en", href: absoluteUrl(homeEn, site) },
        { locale: "x-default", href: absoluteUrl(homeFr, site) },
      ],
    },
    {
      path: blogFr,
      alternates: [
        { locale: "fr", href: absoluteUrl(blogFr, site) },
        { locale: "en", href: absoluteUrl(blogEn, site) },
        { locale: "x-default", href: absoluteUrl(blogFr, site) },
      ],
    },
    {
      path: blogEn,
      alternates: [
        { locale: "fr", href: absoluteUrl(blogFr, site) },
        { locale: "en", href: absoluteUrl(blogEn, site) },
        { locale: "x-default", href: absoluteUrl(blogFr, site) },
      ],
    },
  ];

  for (const article of articles.sort((a, b) => a.data.locale.localeCompare(b.data.locale))) {
    const translations = translatedArticles.get(article.data.translationKey);
    const alternates =
      translations?.fr && translations.en
        ? [
            { locale: "fr" as const, href: absoluteUrl(getArticlePath(translations.fr), site) },
            { locale: "en" as const, href: absoluteUrl(getArticlePath(translations.en), site) },
            { locale: "x-default" as const, href: absoluteUrl(getArticlePath(translations.fr), site) },
          ]
        : undefined;

    entries.push({
      path: getArticlePath(article),
      lastmod: article.data.publishedAt,
      alternates,
    });
  }

  const urlEntries = entries
    .map((entry) => {
      const alternates = entry.alternates
        ?.map(
          (alternate) =>
            `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.locale)}" href="${escapeXml(
              alternate.href,
            )}" />`,
        )
        .join("\n");

      return [
        "  <url>",
        `    <loc>${escapeXml(absoluteUrl(entry.path, site))}</loc>`,
        entry.lastmod ? `    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : undefined,
        alternates,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
      urlEntries,
      "</urlset>",
    ].join("\n"),
    {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
      },
    },
  );
}
