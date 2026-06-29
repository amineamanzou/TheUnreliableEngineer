import { mkdir, readFile, writeFile } from "node:fs/promises";
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

const cssSource = await readFile(path.resolve("src/styles/global.css"), "utf8");
const requiredHoverSelectors = [
  ".button:hover",
  ".panel:hover",
  ".client-logo-card:hover",
  ".proof-item:hover",
  ".work-card:hover",
];

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
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  await page.locator(".hero").waitFor({ state: "visible" });
  await page.locator(".hero-character").waitFor({ state: "visible" });
  await page.locator(".hero-clarifier-card").waitFor({ state: "visible" });
  await page.locator("#proof").waitFor({ state: "visible" });

  const metrics = await page.evaluate(() => {
    const hero = document.querySelector(".hero");
    const isAboveFold = (element) => {
      const rect = element?.getBoundingClientRect();
      return Boolean(rect) && rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0;
    };
    const textFor = (selector) =>
      Array.from(document.querySelectorAll(selector))
        .filter(isAboveFold)
        .map((element) => element.textContent ?? "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim()
        .toLowerCase();
    const offerText = textFor('[data-review="offer"], h1');
    const audienceText = textFor('[data-review="audience"]');
    const postureText = textFor('[data-review="credibility"], h1, .hero-text');
    const workSectionText = (document.querySelector("#work")?.textContent ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
    const workCardTitles = Array.from(document.querySelectorAll("#work .work-card .card-title")).map((element) =>
      (element.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase(),
    );
    const primaryBookingLink = Array.from(document.querySelectorAll("a")).find((link) =>
      /réserver|reserver/.test(link.textContent?.toLowerCase() ?? ""),
    );
    const primaryBookingRect = primaryBookingLink?.getBoundingClientRect();
    const primaryBookingAboveFold =
      Boolean(primaryBookingLink) &&
      Boolean(primaryBookingRect) &&
      primaryBookingRect.top < window.innerHeight &&
      primaryBookingRect.bottom > 0;

    const focusBefore =
      primaryBookingLink instanceof HTMLElement
        ? window.getComputedStyle(primaryBookingLink)
        : undefined;
    const focusBeforeBoxShadow = focusBefore?.boxShadow;

    if (primaryBookingLink instanceof HTMLElement) {
      primaryBookingLink.focus();
    }

    const focusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : undefined;
    const focusStyle = focusedElement ? window.getComputedStyle(focusedElement) : undefined;
    const hasVisibleFocus =
      Boolean(focusedElement) &&
      ((focusStyle?.outlineStyle !== "none" && focusStyle?.outlineWidth !== "0px") ||
        (focusStyle?.boxShadow !== "none" && focusStyle?.boxShadow !== focusBeforeBoxShadow));
    const proofElements = Array.from(
      document.querySelectorAll("#proof [data-proof-status], #proof [data-supported-claim]"),
    );
    const proofGovernance = proofElements.map((element) => ({
      status: element.getAttribute("data-proof-status"),
      supportedClaim: element.getAttribute("data-supported-claim"),
      text: (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 80),
    }));
    const hasCompleteProofGovernance =
      proofGovernance.length > 0 &&
      proofGovernance.every((item) => Boolean(item.status) && Boolean(item.supportedClaim));

    return {
      title: document.title,
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      sectionCount: document.querySelectorAll("main section").length,
      heroWidth: hero?.getBoundingClientRect().width ?? 0,
      hasPersona: Boolean(document.querySelector(".character-asset")),
      hasOfferAboveFold: offerText.includes("60 minutes"),
      hasAudienceAboveFold:
        audienceText.includes("équipes tech") &&
        audienceText.includes("profils seniors") &&
        audienceText.includes("indépendants") &&
        audienceText.includes("décideurs"),
      hasPostureAboveFold:
        postureText.includes("amine") ||
        postureText.includes("unreliable engineer") ||
        postureText.includes("problèmes flous"),
      hasCentralCapability:
        workSectionText.includes("elle vend une capacité") &&
        workSectionText.includes("rendre le sujet lisible") &&
        workSectionText.includes("choisir la bonne suite"),
      hasExpectedSuiteCount:
        workSectionText.includes("quatre suites possibles") &&
        workCardTitles.length === 4 &&
        workCardTitles.includes("cadrage technique") &&
        workCardTitles.includes("accompagnement senior") &&
        workCardTitles.includes("positionnement et opportunités") &&
        workCardTitles.includes("mise en relation qualifiée"),
      avoidsServiceMenuFraming:
        workSectionText.includes("ne vend pas une liste de services concurrents") &&
        !workSectionText.includes("trois suites possibles") &&
        !workSectionText.includes("menu de prestations"),
      workCardTitles,
      hasPrimaryBookingAboveFold: primaryBookingAboveFold,
      primaryBookingHref: primaryBookingLink?.getAttribute("href") ?? null,
      hasVisibleFocus,
      proofGovernance,
      hasCompleteProofGovernance,
      hasReducedMotionNeutralized:
        window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.getComputedStyle(document.querySelector(".signal-map")).transform === "none" &&
        window.getComputedStyle(document.body, "::after").opacity === "0",
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

  for (const [label, passed] of [
    ["60-minute offer above fold", metrics.hasOfferAboveFold],
    ["target audience above fold", metrics.hasAudienceAboveFold],
    ["person/posture above fold", metrics.hasPostureAboveFold],
    ["central capability framing", metrics.hasCentralCapability],
    ["four expected next-step suites", metrics.hasExpectedSuiteCount],
    ["no service-menu framing in suites", metrics.avoidsServiceMenuFraming],
    ["primary booking CTA above fold", metrics.hasPrimaryBookingAboveFold],
    ["visible focus treatment", metrics.hasVisibleFocus],
    ["complete proof governance", metrics.hasCompleteProofGovernance],
    ["reduced-motion neutralization", metrics.hasReducedMotionNeutralized],
  ]) {
    if (!passed) {
      throw new Error(`${target.name}: missing ${label}`);
    }
  }

  if (!metrics.primaryBookingHref || metrics.primaryBookingHref === "#top") {
    throw new Error(`${target.name}: primary booking CTA points to an invalid href`);
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
    const topbar = document.querySelector(".topbar");
    if (topbar instanceof HTMLElement) {
      topbar.style.position = "absolute";
      topbar.style.top = "0";
      topbar.style.left = "0";
      topbar.style.right = "0";
    }
  });

  await page.screenshot({
    path: path.join(outputDir, `homepage-${target.name}.png`),
    fullPage: true,
  });

  report.push({ viewport: target.name, ...metrics });
  await page.close();
}

const motionPage = await browser.newPage({
  viewport: { width: 1512, height: 982 },
  colorScheme: "light",
  reducedMotion: "no-preference",
  deviceScaleFactor: 1,
});

await motionPage.goto(url, { waitUntil: "networkidle", timeout: 30000 });
await motionPage.locator(".signal-map").waitFor({ state: "visible" });

const motionBefore = await motionPage.evaluate(() => ({
  pointerX: getComputedStyle(document.documentElement).getPropertyValue("--pointer-x").trim(),
  signalCoreAnimationName: getComputedStyle(document.querySelector(".signal-core")).animationName,
  signalMapTransform: getComputedStyle(document.querySelector(".signal-map")).transform,
}));

await motionPage.mouse.move(240, 180);
await motionPage.mouse.move(1100, 420);
await motionPage.waitForTimeout(80);

const pointerAfterMove = await motionPage.evaluate(() => ({
  pointerX: getComputedStyle(document.documentElement).getPropertyValue("--pointer-x").trim(),
  pointerNx: getComputedStyle(document.documentElement).getPropertyValue("--pointer-nx").trim(),
}));

const motionMetrics = {
  viewport: "motion",
  hasSignalAnimation: motionBefore.signalCoreAnimationName !== "none",
  hasSignalParallaxTransform: motionBefore.signalMapTransform !== "none",
  hasPointerTracking:
    motionBefore.pointerX !== pointerAfterMove.pointerX &&
    pointerAfterMove.pointerX.endsWith("px") &&
    Number.parseFloat(pointerAfterMove.pointerNx) > 0,
  hasHoverRuleCoverage: requiredHoverSelectors.every((selector) => cssSource.includes(selector)),
};

for (const [label, passed] of [
  ["signal animation", motionMetrics.hasSignalAnimation],
  ["signal parallax transform", motionMetrics.hasSignalParallaxTransform],
  ["pointer tracking", motionMetrics.hasPointerTracking],
  ["hover rule coverage", motionMetrics.hasHoverRuleCoverage],
]) {
  if (!passed) {
    throw new Error(`motion: missing ${label}`);
  }
}

report.push(motionMetrics);
await motionPage.close();

await browser.close();
await writeFile(path.join(outputDir, "homepage-report.json"), JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
