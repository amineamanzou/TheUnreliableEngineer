import { defineCollection, z } from "astro:content";

const articles = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    locale: z.enum(["fr", "en"]),
    articleSlug: z.string(),
    translationKey: z.string(),
    publishedAt: z.string(),
    label: z.string(),
    readTime: z.string(),
    excerpt: z.string(),
    sourceUrl: z.string().url(),
    heroImage: z.string().optional(),
  }),
});

export const collections = { articles };
