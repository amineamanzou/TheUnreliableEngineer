import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const articles = defineCollection({
  loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    locale: z.enum(["fr", "en"]),
    articleSlug: z.string(),
    translationKey: z.string(),
    publishedAt: z.string(),
    modifiedAt: z.string().optional(),
    label: z.string(),
    readTime: z.string(),
    excerpt: z.string(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    sourceUrl: z.url().optional(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string(),
  }),
});

export const collections = { articles };
