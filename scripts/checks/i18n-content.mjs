import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const articlesDir = path.resolve("src/content/articles");
const expectedLocales = new Set(["fr", "en"]);

const frontmatterOf = (source, file) => {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`${file}: missing frontmatter`);
  }

  return Object.fromEntries(
    match[1]
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(":");
        const key = line.slice(0, separator).trim();
        const rawValue = line.slice(separator + 1).trim();
        return [key, rawValue.replace(/^["']|["']$/g, "")];
      }),
  );
};

const files = (await readdir(articlesDir)).filter((file) => file.endsWith(".md"));
const byKey = new Map();

for (const file of files) {
  const source = await readFile(path.join(articlesDir, file), "utf8");
  const frontmatter = frontmatterOf(source, file);
  const { locale, articleSlug, translationKey, sourceUrl } = frontmatter;

  if (!expectedLocales.has(locale)) {
    throw new Error(`${file}: locale must be fr or en`);
  }

  if (!articleSlug || !translationKey) {
    throw new Error(`${file}: missing articleSlug or translationKey`);
  }

  if (!sourceUrl?.startsWith("https://www.linkedin.com/")) {
    throw new Error(`${file}: sourceUrl must keep the LinkedIn source`);
  }

  const entries = byKey.get(translationKey) ?? [];
  entries.push({ file, locale, articleSlug });
  byKey.set(translationKey, entries);
}

for (const [key, entries] of byKey) {
  const locales = new Set(entries.map((entry) => entry.locale));
  for (const locale of expectedLocales) {
    if (!locales.has(locale)) {
      throw new Error(`${key}: missing ${locale} translation`);
    }
  }

  for (const locale of expectedLocales) {
    const localizedEntries = entries.filter((entry) => entry.locale === locale);
    if (localizedEntries.length > 1) {
      throw new Error(
        `${key}: duplicate ${locale} translation (${localizedEntries.map((entry) => entry.file).join(", ")})`,
      );
    }
  }
}

const slugsByLocale = new Map();
for (const entries of byKey.values()) {
  for (const entry of entries) {
    const scopedSlug = `${entry.locale}:${entry.articleSlug}`;
    const existing = slugsByLocale.get(scopedSlug);
    if (existing) {
      throw new Error(`${entry.file}: articleSlug duplicates ${existing} for ${entry.locale}`);
    }
    slugsByLocale.set(scopedSlug, entry.file);
  }
}

console.log(JSON.stringify({ ok: true, articles: files.length }, null, 2));
