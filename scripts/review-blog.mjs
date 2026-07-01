import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://127.0.0.1:4321/blog/";
const outputDir = path.resolve("artifacts/review");
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const page = await browser.newPage({
  viewport: { width: 430, height: 932 },
  reducedMotion: "reduce",
  deviceScaleFactor: 1,
});

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

const pageMetrics = await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  hasMetaLede: document.body.textContent?.includes("LinkedIn reste une surface") ?? false,
  hasArticleTitle: Array.from(document.querySelectorAll("h2")).some((node) =>
    /articles publiés/i.test(node.textContent ?? ""),
  ),
  hasArticleTag: Array.from(document.querySelectorAll(".section-tag")).some((node) =>
    /^Articles$/i.test((node.textContent ?? "").trim()),
  ),
  visibleArticleCards: document.querySelectorAll("[data-blog-list] .blog-card").length,
}));

if (pageMetrics.scrollWidth > pageMetrics.innerWidth) {
  throw new Error(`blog mobile overflow (${pageMetrics.scrollWidth}px > ${pageMetrics.innerWidth}px)`);
}

if (pageMetrics.hasMetaLede || pageMetrics.hasArticleTitle || !pageMetrics.hasArticleTag) {
  throw new Error("blog index still contains meta copy or redundant section title");
}

if (pageMetrics.visibleArticleCards > 5) {
  throw new Error(`blog should render at most 5 cards initially, saw ${pageMetrics.visibleArticleCards}`);
}

const terminalInput = page.locator("#blog-terminal-command");
for (const command of ["fzf", "ls", "find", "rg", "ripgrep", "open", "read", "cat", "help"]) {
  await terminalInput.fill(`${command} --help`);
  await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
  await page.getByText(`Usage: ${command}`).waitFor({ timeout: 5000 });
}

await terminalInput.fill("rg deck");
await terminalInput.press("Tab");
const completedSearch = await terminalInput.inputValue();
if (!/deck-tracker/i.test(completedSearch)) {
  throw new Error(`tab autocomplete did not complete article query, got: ${completedSearch}`);
}

await terminalInput.fill("ls");
await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
await terminalInput.fill("help");
await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
await terminalInput.press("ArrowUp");
if ((await terminalInput.inputValue()) !== "help") {
  throw new Error("ArrowUp should recall the latest command");
}
await terminalInput.press("ArrowUp");
if ((await terminalInput.inputValue()) !== "ls") {
  throw new Error("ArrowUp should walk command history");
}

await terminalInput.fill("fzf");
await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
await page.getByText("fzf articles").waitFor({ timeout: 5000 });
await terminalInput.pressSequentially("deck");
await page.locator(".terminal-fzf-query", { hasText: "query> deck" }).waitFor({ timeout: 5000 });
await page.locator(".terminal-fzf-row").filter({ hasText: /deck-tracker/ }).waitFor({
  timeout: 5000,
});
const fzfRowsAfterDeck = await page.locator(".terminal-fzf-row").evaluateAll((rows) =>
  rows.map((row) => row.textContent ?? ""),
);
if (!fzfRowsAfterDeck.every((row) => /deck/i.test(row))) {
  throw new Error(`fzf should filter rows by query "deck", saw: ${fzfRowsAfterDeck.join(" | ")}`);
}
await page.keyboard.press("Enter");
await page.waitForURL(/\/blog\/.*deck.*\/$/, { timeout: 5000 });

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
for (const command of ["open", "read", "cat"]) {
  await terminalInput.fill(`${command} opamp-fleet-management-agents`);
  await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
  await page.waitForURL("**/blog/opamp-fleet-management-agents/", { timeout: 5000 });
  if (command !== "cat") {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  }
}

const articleMetrics = await page.evaluate(() => ({
  paragraphs: document.querySelectorAll(".article-body p").length,
  images: document.querySelectorAll(".article-body img, .article-hero-image").length,
  hasReactionLink: Array.from(document.querySelectorAll("a")).some((link) =>
    /réagir sur linkedin|react on linkedin/i.test(link.textContent ?? ""),
  ),
  hasImportedWording: document.body.textContent?.includes("Version importée") ?? false,
}));

if (articleMetrics.paragraphs < 12 || articleMetrics.images < 1) {
  throw new Error(
    `article should be complete with local images, saw ${articleMetrics.paragraphs} paragraphs and ${articleMetrics.images} images`,
  );
}

if (!articleMetrics.hasReactionLink || articleMetrics.hasImportedWording) {
  throw new Error("article page should use LinkedIn only as a reaction/source link");
}

await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await terminalInput.fill("rm -rf /");
await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
await page.waitForURL("**/blog/internet-deleted/", { timeout: 5000 });
await page.getByText("rollback").waitFor({ timeout: 5000 });

await page.screenshot({ path: path.join(outputDir, "blog-mobile-reviewed.png"), fullPage: true });
await browser.close();

console.log(JSON.stringify({ ok: true, pageMetrics, articleMetrics }, null, 2));
