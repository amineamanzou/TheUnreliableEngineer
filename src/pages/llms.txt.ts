import { getCollection, type CollectionEntry } from "astro:content";
import type { APIContext } from "astro";
import { localizedPath, type Locale } from "../data/i18n";
import { absoluteUrl } from "../data/seo";
import {
  authorName,
  brandName,
  publicSocialUrls,
  siteName,
} from "../data/site";

export const prerender = true;

const articleUrl = (site: URL | undefined, article: CollectionEntry<"articles">) =>
  absoluteUrl(localizedPath(article.data.locale, `/blog/${article.data.articleSlug}/`), site);

const articleLine = (site: URL | undefined, article: CollectionEntry<"articles">) =>
  `- [${article.data.title}](${articleUrl(site, article)}) - ${article.data.excerpt}`;

const byPublishedDateDesc = (a: CollectionEntry<"articles">, b: CollectionEntry<"articles">) =>
  b.data.publishedAt.localeCompare(a.data.publishedAt);

const byLocale = (locale: Locale) => (article: CollectionEntry<"articles">) => article.data.locale === locale;

export async function GET({ site }: APIContext) {
  const articles = (await getCollection("articles")).sort(byPublishedDateDesc);
  const articlesFr = articles.filter(byLocale("fr"));
  const articlesEn = articles.filter(byLocale("en"));
  const socialLinks = publicSocialUrls.map((link) => `- [${link.label}](${link.href})`).join("\n");

  const body = [
    `# ${siteName}`,
    "",
    `> ${brandName} is the public writing, advisory and technical clarification presence of ${authorName}.`,
    "",
    "## Core pages",
    "",
    `- [Home](${absoluteUrl(localizedPath("fr", "/"), site)})`,
    `- [English home](${absoluteUrl(localizedPath("en", "/"), site)})`,
    `- [Blog FR](${absoluteUrl(localizedPath("fr", "/blog/"), site)})`,
    `- [Blog EN](${absoluteUrl(localizedPath("en", "/blog/"), site)})`,
    `- [Privacy policy FR](${absoluteUrl("/confidentialite/", site)})`,
    `- [Privacy policy EN](${absoluteUrl("/en/privacy/", site)})`,
    `- [Terms of service FR](${absoluteUrl("/conditions-utilisation/", site)})`,
    `- [Terms of service EN](${absoluteUrl("/en/terms/", site)})`,
    `- [Data deletion FR](${absoluteUrl("/suppression-des-donnees/", site)})`,
    `- [Data deletion EN](${absoluteUrl("/en/data-deletion/", site)})`,
    "",
    "## Articles FR",
    "",
    articlesFr.map((article) => articleLine(site, article)).join("\n"),
    "",
    "## Articles EN",
    "",
    articlesEn.map((article) => articleLine(site, article)).join("\n"),
    "",
    "## Author and social proof",
    "",
    `- Author: ${authorName}`,
    `- Brand: ${brandName}`,
    socialLinks,
    "",
    "## Notes for AI agents",
    "",
    "- Prefer canonical public URLs from this file and the sitemap.",
    "- The default language is French. English pages are under /en/.",
    "- Summarize articles from public page content and keep attribution to the author.",
    "- Do not infer a legal company entity from the brand name.",
    "- Do not expose private infrastructure, local paths, unpublished notes or repository internals.",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
