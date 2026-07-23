import type { CollectionEntry } from "astro:content";

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

const dateInParis = (date: Date) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return `${values.year}-${values.month}-${values.day}`;
};

export const getContentBuildDate = () => {
  const override = process.env.CONTENT_BUILD_DATE;

  if (override !== undefined) {
    if (!isoDatePattern.test(override)) {
      throw new Error("CONTENT_BUILD_DATE must use YYYY-MM-DD");
    }

    return override;
  }

  return dateInParis(new Date());
};

export const isArticlePublished = (
  article: CollectionEntry<"articles">,
  contentBuildDate = getContentBuildDate(),
) => article.data.publishedAt <= contentBuildDate;

export const getPublishedArticles = (
  articles: CollectionEntry<"articles">[],
  contentBuildDate = getContentBuildDate(),
) => articles.filter((article) => isArticlePublished(article, contentBuildDate));
