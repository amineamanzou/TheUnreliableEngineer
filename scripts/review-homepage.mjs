import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://127.0.0.1:4321/";
const outputDir = path.resolve("artifacts/review");
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const viewports = [
  { name: "desktop", viewport: { width: 1512, height: 982 } },
  { name: "mobile", viewport: { width: 430, height: 932 } },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const report = [];

for (const target of viewports) {
  const page = await browser.newPage({
    viewport: target.viewport,
    colorScheme: "light",
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  await page.locator(".hero").waitFor({ state: "visible" });
  await page.locator(".hero-character").waitFor({ state: "visible" });
  await page.locator(".hero-note").waitFor({ state: "visible" });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector(".hero");

    return {
      title: document.title,
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      sectionCount: document.querySelectorAll("main section").length,
      heroWidth: hero?.getBoundingClientRect().width ?? 0,
      hasBubble: Boolean(document.querySelector(".hero-bubble")),
      hasStickyNote: Boolean(document.querySelector(".hero-note")),
      hasPersona: Boolean(document.querySelector(".character-asset")),
    };
  });

  if (metrics.scrollWidth > metrics.innerWidth) {
    throw new Error(
      `${target.name}: horizontal overflow detected (${metrics.scrollWidth}px > ${metrics.innerWidth}px)`,
    );
  }

  if (metrics.heroWidth < metrics.innerWidth * 0.82) {
    throw new Error(
      `${target.name}: hero is too narrow for the viewport (${metrics.heroWidth}px < ${
        metrics.innerWidth * 0.82
      }px)`,
    );
  }

  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    const step = Math.max(window.innerHeight * 0.75, 320);
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  await page.screenshot({
    path: path.join(outputDir, `homepage-${target.name}.png`),
    fullPage: true,
  });

  report.push({ viewport: target.name, ...metrics });
  await page.close();
}

await browser.close();
await writeFile(path.join(outputDir, "homepage-report.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
