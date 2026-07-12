import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const dist = join(process.cwd(), "dist");
const requiredFiles = [
  "index.html",
  "en/index.html",
  "blog/index.html",
  "en/blog/index.html",
  "confidentialite/index.html",
  "en/privacy/index.html",
  "conditions-utilisation/index.html",
  "en/terms/index.html",
  "suppression-des-donnees/index.html",
  "en/data-deletion/index.html",
  "sitemap.xml",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const file of requiredFiles) {
  assert(existsSync(join(dist, file)), `Missing static artifact: ${file}`);
}

const home = readFileSync(join(dist, "index.html"), "utf8");
const homeEn = readFileSync(join(dist, "en/index.html"), "utf8");
const privacy = readFileSync(join(dist, "confidentialite/index.html"), "utf8");
const privacyEn = readFileSync(join(dist, "en/privacy/index.html"), "utf8");
const terms = readFileSync(join(dist, "conditions-utilisation/index.html"), "utf8");
const termsEn = readFileSync(join(dist, "en/terms/index.html"), "utf8");
const deletion = readFileSync(join(dist, "suppression-des-donnees/index.html"), "utf8");
const deletionEn = readFileSync(join(dist, "en/data-deletion/index.html"), "utf8");
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");

assert(home.includes("site-footer"), "French home is missing the global footer");
assert(homeEn.includes("site-footer"), "English home is missing the global footer");
assert(home.includes("/conditions-utilisation/"), "French footer is missing the terms link");
assert(home.includes("/suppression-des-donnees/"), "French footer is missing the data deletion link");
assert(homeEn.includes("/en/terms/"), "English footer is missing the terms link");
assert(homeEn.includes("/en/data-deletion/"), "English footer is missing the data deletion link");
assert(privacy.includes("__rum_optout"), "French privacy notice must document the opt-out fallback");
assert(privacyEn.includes("__rum_optout"), "English privacy notice must document the opt-out fallback");
assert(privacy.includes("avant stockage dans ClickStack"), "French notice must document pre-storage minimisation");
assert(privacyEn.includes("before ClickStack storage"), "English notice must document pre-storage minimisation");
for (const permission of ["pages_show_list", "pages_read_engagement", "read_insights", "instagram_basic", "instagram_manage_insights"]) {
  assert(privacy.includes(permission), `French privacy notice is missing Meta permission ${permission}`);
  assert(privacyEn.includes(permission), `English privacy notice is missing Meta permission ${permission}`);
}
assert(terms.includes("en lecture seule"), "French terms must state the read-only boundary in French");
assert(termsEn.includes("read-only"), "English terms must state the read-only boundary");
assert(deletion.includes("délai maximal est d’un mois"), "French deletion instructions must state the response ceiling");
assert(deletionEn.includes("maximum period is one month"), "English deletion instructions must state the response ceiling");
assert(deletion.includes("admin@itart.studio"), "French deletion instructions must expose a public request channel");
assert(deletionEn.includes("admin@itart.studio"), "English deletion instructions must expose a public request channel");
for (const html of [privacy, privacyEn, terms, termsEn, deletion, deletionEn]) {
  assert(html.includes("IT ART STUDIO"), "Every legal page must identify IT ART STUDIO");
  assert(html.includes("915 019 129") || html.includes("915&nbsp;019&nbsp;129"), "Every legal page must expose the company registration number");
}
assert(deletion.includes("aucune fonction de rappel de suppression"), "French deletion instructions must disclose the manual-only process");
assert(deletionEn.includes("no Meta data-deletion callback"), "English deletion instructions must disclose the manual-only process");

for (const html of [privacy, privacyEn, terms, termsEn, deletion, deletionEn]) {
  assert(!/\b(?:TODO|TBD|PLACEHOLDER)\b/i.test(html), "Legal pages must not contain placeholders");
}

for (const route of [
  "/confidentialite/",
  "/en/privacy/",
  "/conditions-utilisation/",
  "/en/terms/",
  "/suppression-des-donnees/",
  "/en/data-deletion/",
]) {
  assert(sitemap.includes(route), `Sitemap is missing legal route ${route}`);
}

console.log("Static site review passed");
