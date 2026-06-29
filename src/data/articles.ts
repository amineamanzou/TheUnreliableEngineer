import type { CollectionEntry } from "astro:content";
import type { Locale } from "./i18n";
import { assetPath, localizedPath, uiByLocale } from "./i18n";

export type ArticleCard = {
  slug: string;
  label: string;
  title: string;
  publishedAt: string;
  date: string;
  readTime: string;
  excerpt: string;
  href: string;
};

export const formatArticleDate = (isoDate: string, locale: Locale) =>
  new Intl.DateTimeFormat(uiByLocale[locale].home.formatLocale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${isoDate}T00:00:00`));

export const getArticleHref = (article: CollectionEntry<"articles">) =>
  assetPath(localizedPath(article.data.locale, `/blog/${article.data.articleSlug}/`));

export const getArticleCards = (articles: CollectionEntry<"articles">[], locale: Locale): ArticleCard[] =>
  articles
    .filter((article) => article.data.locale === locale)
    .sort((a, b) => b.data.publishedAt.localeCompare(a.data.publishedAt))
    .map((article) => ({
      slug: article.data.articleSlug,
      label: article.data.label,
      title: article.data.title,
      publishedAt: article.data.publishedAt,
      date: formatArticleDate(article.data.publishedAt, locale),
      readTime: article.data.readTime,
      excerpt: article.data.excerpt,
      href: getArticleHref(article),
    }));
