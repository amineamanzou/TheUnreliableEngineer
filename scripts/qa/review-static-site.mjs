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
const sitemap = readFileSync(join(dist, "sitemap.xml"), "utf8");

assert(home.includes("site-footer"), "French home is missing the global footer");
assert(homeEn.includes("site-footer"), "English home is missing the global footer");
assert(privacy.includes("__rum_optout"), "French privacy notice must document the opt-out fallback");
assert(privacyEn.includes("__rum_optout"), "English privacy notice must document the opt-out fallback");
assert(privacy.includes("avant stockage dans ClickStack"), "French notice must document pre-storage minimisation");
assert(privacyEn.includes("before ClickStack storage"), "English notice must document pre-storage minimisation");
assert(sitemap.includes("/confidentialite/"), "Sitemap is missing the French privacy route");
assert(sitemap.includes("/en/privacy/"), "Sitemap is missing the English privacy route");

console.log("Static site review passed");
