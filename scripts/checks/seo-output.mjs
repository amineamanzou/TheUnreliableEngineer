import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.cwd(), "dist");
const siteUrl = "https://theunreliable.engineer";

const failures = [];

function fail(message) {
  failures.push(message);
}

async function readDistFile(relativePath) {
  const filePath = path.join(distDir, relativePath);

  if (!existsSync(filePath)) {
    fail(`${relativePath} is missing`);
    return null;
  }

  return readFile(filePath, "utf8");
}

function assertIncludes(content, relativePath, needle, label = needle) {
  if (content !== null && !content.includes(needle)) {
    fail(`${relativePath} must contain ${label}`);
  }
}

function assertNotIncludes(content, relativePath, needle) {
  if (content !== null && content.includes(needle)) {
    fail(`${relativePath} must not contain ${needle}`);
  }
}

function assertMetaTags(html, relativePath) {
  if (html === null) {
    return;
  }

  const requiredTags = [
    "og:title",
    "og:description",
    "og:url",
    "og:image",
    "twitter:card",
  ];

  for (const tag of requiredTags) {
    const pattern = new RegExp(
      `<meta\\s+[^>]*(?:property|name)=["']${escapeRegExp(tag)}["'][^>]*>`,
      "i",
    );

    if (!pattern.test(html)) {
      fail(`${relativePath} must contain meta ${tag}`);
    }
  }
}

function getMetaContent(html, relativePath, attributeName, attributeValue) {
  if (html === null) {
    return null;
  }

  const pattern = new RegExp(
    `<meta\\s+[^>]*${attributeName}=["']${escapeRegExp(attributeValue)}["'][^>]*content=["']([^"']+)["'][^>]*>|<meta\\s+[^>]*content=["']([^"']+)["'][^>]*${attributeName}=["']${escapeRegExp(attributeValue)}["'][^>]*>`,
    "i",
  );
  const match = html.match(pattern);

  if (!match) {
    fail(`${relativePath} must contain meta ${attributeValue}`);
    return null;
  }

  return match[1] ?? match[2] ?? null;
}

function assertMetaUrlOnSite(html, relativePath, attributeName, attributeValue) {
  const value = getMetaContent(html, relativePath, attributeName, attributeValue);

  if (value !== null && !value.startsWith(`${siteUrl}/`)) {
    fail(`${relativePath} meta ${attributeValue} must use the canonical site URL`);
  }
}

function assertLinkHref(html, relativePath, attributes, expectedHref) {
  if (html === null) {
    return;
  }

  const attributeChecks = Object.entries(attributes)
    .map(([name, value]) => `(?=[^>]*${name}=["']${escapeRegExp(value)}["'])`)
    .join("");
  const pattern = new RegExp(`<link\\s+${attributeChecks}[^>]*href=["']${escapeRegExp(expectedHref)}["'][^>]*>`, "i");

  if (!pattern.test(html)) {
    fail(`${relativePath} must link ${JSON.stringify(attributes)} to ${expectedHref}`);
  }
}

function extractJsonLdTypes(value, types = []) {
  if (!value || typeof value !== "object") {
    return types;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      extractJsonLdTypes(item, types);
    }
    return types;
  }

  if (typeof value["@type"] === "string") {
    types.push(value["@type"]);
  } else if (Array.isArray(value["@type"])) {
    types.push(...value["@type"].filter((type) => typeof type === "string"));
  }

  if (Array.isArray(value["@graph"])) {
    extractJsonLdTypes(value["@graph"], types);
  }

  return types;
}

function assertJsonLdTypes(html, relativePath, expectedTypes) {
  if (html === null) {
    return;
  }

  const scripts = html.matchAll(
    /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  );
  const types = [];
  let count = 0;

  for (const script of scripts) {
    count += 1;
    const rawJson = script[1].trim();

    try {
      extractJsonLdTypes(JSON.parse(rawJson), types);
    } catch (error) {
      fail(`${relativePath} has invalid application/ld+json: ${error.message}`);
    }
  }

  if (count === 0) {
    fail(`${relativePath} must contain at least one application/ld+json script`);
    return;
  }

  const missingTypes = expectedTypes.filter((type) => !types.includes(type));
  if (missingTypes.length > 0) {
    fail(
      `${relativePath} ld+json must include @type ${missingTypes.join(
        ", ",
      )}; found ${types.length > 0 ? types.join(", ") : "none"}`,
    );
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const [
  sitemap,
  robots,
  llms,
  homeHtml,
  blogHtml,
  articleHtml,
  internetDeletedHtml,
  internetDeletedEnHtml,
] = await Promise.all([
  readDistFile("sitemap.xml"),
  readDistFile("robots.txt"),
  readDistFile("llms.txt"),
  readDistFile("index.html"),
  readDistFile("blog/index.html"),
  readDistFile("blog/opamp-fleet-management-agents/index.html"),
  readDistFile("blog/internet-deleted/index.html"),
  readDistFile("en/blog/internet-deleted/index.html"),
]);

assertIncludes(sitemap, "sitemap.xml", `${siteUrl}/`, "the canonical home URL");
if (
  sitemap !== null &&
  !new RegExp(`${escapeRegExp(siteUrl)}/blog/[^<\\s]+`).test(sitemap)
) {
  fail("sitemap.xml must contain canonical blog URLs");
}
assertNotIncludes(sitemap, "sitemap.xml", "/blog/internet-deleted/");

assertIncludes(
  robots,
  "robots.txt",
  `Sitemap: ${siteUrl}/sitemap.xml`,
  "the canonical sitemap directive",
);

assertIncludes(llms, "llms.txt", "# The Unreliable Engineer");
assertIncludes(llms, "llms.txt", `${siteUrl}/`, "the canonical home link");
assertIncludes(llms, "llms.txt", `${siteUrl}/blog/`, "the canonical blog link");
assertNotIncludes(llms, "llms.txt", "/blog/internet-deleted/");

assertMetaTags(homeHtml, "index.html");
assertMetaTags(articleHtml, "blog/opamp-fleet-management-agents/index.html");
assertMetaUrlOnSite(homeHtml, "index.html", "property", "og:url");
assertMetaUrlOnSite(articleHtml, "blog/opamp-fleet-management-agents/index.html", "property", "og:url");
assertLinkHref(homeHtml, "index.html", { rel: "canonical" }, `${siteUrl}/`);
assertLinkHref(homeHtml, "index.html", { rel: "alternate", hreflang: "en" }, `${siteUrl}/en/`);
assertLinkHref(articleHtml, "blog/opamp-fleet-management-agents/index.html", { rel: "canonical" }, `${siteUrl}/blog/opamp-fleet-management-agents/`);
assertLinkHref(
  articleHtml,
  "blog/opamp-fleet-management-agents/index.html",
  { rel: "alternate", hreflang: "en" },
  `${siteUrl}/en/blog/opamp-fleet-management-agents/`,
);

assertJsonLdTypes(homeHtml, "index.html", ["WebSite", "WebPage", "Person", "ProfessionalService"]);
assertJsonLdTypes(blogHtml, "blog/index.html", ["Blog"]);
assertJsonLdTypes(articleHtml, "blog/opamp-fleet-management-agents/index.html", [
  "BlogPosting",
]);
assertIncludes(
  internetDeletedHtml,
  "blog/internet-deleted/index.html",
  '<meta name="robots" content="noindex,follow">',
);
assertIncludes(
  internetDeletedEnHtml,
  "en/blog/internet-deleted/index.html",
  '<meta name="robots" content="noindex,follow">',
);

if (failures.length > 0) {
  console.error(`SEO output check failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log("SEO output check passed.");
