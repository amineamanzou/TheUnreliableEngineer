import { readFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const distDir = path.resolve(process.cwd(), "dist");
const siteUrl = "https://theunreliable.engineer";

const failures = [];

function fail(message) {
  failures.push(message);
}

async function readDistFile(relativePath, missingMessage = `${relativePath} is missing`) {
  const filePath = path.join(distDir, relativePath);

  if (!existsSync(filePath)) {
    fail(missingMessage);
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

function decodeEntities(value) {
  const namedEntities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
  };

  return value.replace(
    /&(?:#(\d+)|#x([\da-f]+)|(amp|lt|gt|quot|apos));/gi,
    (entity, decimal, hexadecimal, named) => {
      if (decimal) {
        return String.fromCodePoint(Number(decimal));
      }
      if (hexadecimal) {
        return String.fromCodePoint(Number.parseInt(hexadecimal, 16));
      }
      return namedEntities[named.toLowerCase()] ?? entity;
    },
  );
}

function parseAttributes(source) {
  const attributes = {};
  const pattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

  for (const match of source.matchAll(pattern)) {
    attributes[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? "");
  }

  return attributes;
}

function parseXmlDocument(xml) {
  const document = { name: "#document", attributes: {}, children: [], text: "" };
  const stack = [document];
  const tokenPattern = /<\?[\s\S]*?\?>|<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>/g;
  let cursor = 0;

  for (const match of xml.matchAll(tokenPattern)) {
    stack.at(-1).text += decodeEntities(xml.slice(cursor, match.index));
    cursor = match.index + match[0].length;

    const token = match[0];
    if (token.startsWith("<?") || token.startsWith("<!")) {
      continue;
    }

    if (token.startsWith("</")) {
      const name = token.slice(2, -1).trim();
      const current = stack.at(-1);

      if (current === document || current.name !== name) {
        throw new Error(`unexpected closing tag </${name}>`);
      }

      stack.pop();
      continue;
    }

    const selfClosing = /\/\s*>$/.test(token);
    const body = token.slice(1, selfClosing ? token.lastIndexOf("/") : -1).trim();
    const nameMatch = body.match(/^([^\s/>]+)/);

    if (!nameMatch) {
      throw new Error(`invalid tag ${token}`);
    }

    const node = {
      name: nameMatch[1],
      attributes: parseAttributes(body.slice(nameMatch[0].length)),
      children: [],
      text: "",
    };
    stack.at(-1).children.push(node);

    if (!selfClosing) {
      stack.push(node);
    }
  }

  stack.at(-1).text += decodeEntities(xml.slice(cursor));
  if (stack.length !== 1) {
    throw new Error(`unclosed tag <${stack.at(-1).name}>`);
  }

  return document;
}

function localName(name) {
  return name.includes(":") ? name.slice(name.lastIndexOf(":") + 1) : name;
}

function getChild(node, name) {
  return node.children.find((child) => localName(child.name) === name);
}

function getChildren(node, name) {
  return node.children.filter((child) => localName(child.name) === name);
}

function parseSitemapEntries(xml) {
  if (xml === null) {
    return [];
  }

  let document;
  try {
    document = parseXmlDocument(xml);
  } catch (error) {
    fail(`sitemap.xml must be valid XML: ${error.message}`);
    return [];
  }

  const urlset = getChild(document, "urlset");
  if (!urlset) {
    fail("sitemap.xml must contain a urlset root element");
    return [];
  }

  return getChildren(urlset, "url").flatMap((urlNode, index) => {
    const loc = getChild(urlNode, "loc")?.text.trim();
    if (!loc) {
      fail(`sitemap.xml url entry ${index + 1} must contain loc`);
      return [];
    }

    const alternates = getChildren(urlNode, "link")
      .filter((link) => link.attributes.rel?.toLowerCase() === "alternate")
      .map((link) => ({
        hreflang: link.attributes.hreflang,
        href: link.attributes.href,
      }));

    return [{ loc, alternates }];
  });
}

function getTagAttributes(html, tagName) {
  if (html === null) {
    return [];
  }

  const tags = [];
  const pattern = new RegExp(`<${tagName}\\b([^>]*)>`, "gi");
  for (const match of html.matchAll(pattern)) {
    tags.push(parseAttributes(match[1]));
  }

  return tags;
}

function getAlternateLinks(html) {
  return getTagAttributes(html, "link")
    .filter((attributes) => attributes.rel?.toLowerCase() === "alternate")
    .map((attributes) => ({
      hreflang: attributes.hreflang,
      href: attributes.href,
    }));
}

function hasNoindex(html) {
  return getTagAttributes(html, "meta").some((attributes) => {
    if (attributes.name?.toLowerCase() !== "robots") {
      return false;
    }

    return (attributes.content ?? "")
      .toLowerCase()
      .split(/[\s,]+/)
      .includes("noindex");
  });
}

function parseUrl(value, label) {
  try {
    return new URL(value);
  } catch {
    fail(`${label} must be an absolute URL; found ${JSON.stringify(value)}`);
    return null;
  }
}

function distPathForUrl(url, label) {
  if (url.origin !== siteUrl) {
    fail(`${label} must use ${siteUrl}; found ${url.origin}`);
    return null;
  }

  if (url.search || url.hash) {
    fail(`${label} must not contain a query string or fragment`);
    return null;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    fail(`${label} has an invalid encoded pathname: ${url.pathname}`);
    return null;
  }

  const relativePath = pathname.replace(/^\/+/, "");
  if (relativePath.split("/").includes("..")) {
    fail(`${label} must not traverse outside dist: ${url.pathname}`);
    return null;
  }

  if (pathname.endsWith("/")) {
    return path.posix.join(relativePath, "index.html");
  }

  return path.posix.extname(relativePath) ? relativePath : `${relativePath}.html`;
}

function assertUniqueAlternates(alternates, label) {
  const languages = new Set();

  for (const alternate of alternates) {
    if (!alternate.hreflang || !alternate.href) {
      fail(`${label} alternate links must contain hreflang and href`);
      continue;
    }

    const language = alternate.hreflang.toLowerCase();
    if (languages.has(language)) {
      fail(`${label} must not declare hreflang ${alternate.hreflang} more than once`);
    }
    languages.add(language);
  }
}

function normalizeAlternates(alternates) {
  return new Map(
    alternates
      .filter((alternate) => alternate.hreflang && alternate.href)
      .map((alternate) => [alternate.hreflang.toLowerCase(), alternate.href]),
  );
}

function assertMatchingAlternates(actual, expected, label) {
  assertUniqueAlternates(actual, label);
  const actualByLanguage = normalizeAlternates(actual);
  const expectedByLanguage = normalizeAlternates(expected);

  for (const [language, href] of expectedByLanguage) {
    if (actualByLanguage.get(language) !== href) {
      fail(`${label} hreflang ${language} must link to ${href}`);
    }
  }

  for (const [language, href] of actualByLanguage) {
    if (!expectedByLanguage.has(language)) {
      fail(`${label} declares unexpected hreflang ${language} linking to ${href}`);
    }
  }
}

async function listHtmlFiles(directory = distDir, prefix = "") {
  const files = [];

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(path.join(directory, entry.name), relativePath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(relativePath);
    }
  }

  return files;
}

function urlForDistHtml(relativePath) {
  const pathname = relativePath === "index.html"
    ? "/"
    : relativePath.endsWith("/index.html")
      ? `/${relativePath.slice(0, -"index.html".length)}`
      : `/${relativePath}`;

  return new URL(pathname, siteUrl).href;
}

async function assertCompleteSitemapInventory(sitemap) {
  if (sitemap === null) {
    return;
  }

  const entries = parseSitemapEntries(sitemap);
  const inventory = new Map();
  const pageDetails = new Map();

  for (const entry of entries) {
    const url = parseUrl(entry.loc, "sitemap.xml loc");
    if (!url) {
      continue;
    }

    const relativePath = distPathForUrl(url, `sitemap.xml loc ${entry.loc}`);
    if (!relativePath) {
      continue;
    }

    if (inventory.has(url.href)) {
      fail(`sitemap.xml must list ${url.href} only once`);
      continue;
    }

    inventory.set(url.href, entry);
    assertUniqueAlternates(entry.alternates, `sitemap.xml entry ${url.href}`);

    const html = await readDistFile(
      relativePath,
      `sitemap URL ${url.href} has no HTML output at ${relativePath}`,
    );
    if (html === null) {
      continue;
    }

    const canonicals = getTagAttributes(html, "link")
      .filter((attributes) => attributes.rel?.toLowerCase() === "canonical")
      .map((attributes) => attributes.href)
      .filter(Boolean);

    if (canonicals.length !== 1) {
      fail(
        `${relativePath} for ${url.href} must contain exactly one canonical link; found ${canonicals.length}`,
      );
    } else if (canonicals[0] !== url.href) {
      fail(`${relativePath} for ${url.href} must self-canonicalize; found ${canonicals[0]}`);
    }

    const pageAlternates = getAlternateLinks(html);
    assertMatchingAlternates(
      pageAlternates,
      entry.alternates,
      `${relativePath} for sitemap entry ${url.href}`,
    );
    pageDetails.set(url.href, { relativePath, alternates: pageAlternates });
  }

  for (const [sourceUrl, entry] of inventory) {
    const alternates = normalizeAlternates(entry.alternates);
    if (alternates.size > 0 && ![...alternates.entries()].some(
      ([language, href]) => language !== "x-default" && href === sourceUrl,
    )) {
      fail(`sitemap.xml entry ${sourceUrl} must include a self-referencing hreflang alternate`);
    }

    for (const [language, alternateHref] of alternates) {
      if (language === "x-default") {
        continue;
      }

      const alternateUrl = parseUrl(
        alternateHref,
        `sitemap.xml hreflang ${language} for ${sourceUrl}`,
      );
      if (!alternateUrl || alternateUrl.origin !== siteUrl) {
        continue;
      }

      const reciprocalEntry = inventory.get(alternateUrl.href);
      if (!reciprocalEntry) {
        fail(
          `sitemap.xml hreflang ${language} for ${sourceUrl} targets unlisted URL ${alternateUrl.href}`,
        );
        continue;
      }

      const reciprocalAlternates = normalizeAlternates(reciprocalEntry.alternates);
      if (![...reciprocalAlternates.values()].includes(sourceUrl)) {
        fail(
          `sitemap.xml hreflang ${language} between ${sourceUrl} and ${alternateUrl.href} is not reciprocal`,
        );
      }

      const reciprocalPage = pageDetails.get(alternateUrl.href);
      if (
        reciprocalPage &&
        ![...normalizeAlternates(reciprocalPage.alternates).values()].includes(sourceUrl)
      ) {
        fail(`${reciprocalPage.relativePath} must link back to hreflang alternate ${sourceUrl}`);
      }
    }
  }

  for (const relativePath of await listHtmlFiles()) {
    const html = await readFile(path.join(distDir, relativePath), "utf8");
    const outputUrl = urlForDistHtml(relativePath);
    if (hasNoindex(html) && inventory.has(outputUrl)) {
      fail(
        `intentional noindex output ${relativePath} must not be listed in sitemap.xml as ${outputUrl}`,
      );
    }
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
await assertCompleteSitemapInventory(sitemap);

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
