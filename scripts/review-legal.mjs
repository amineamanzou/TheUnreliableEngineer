import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const originArg = args.find((arg) => !arg.startsWith("--")) ?? "http://127.0.0.1:4321/";
const requiredConsent = args.find((arg) => arg.startsWith("--require="))?.split("=")[1] ?? "none";
const allowedConsentRequirements = new Set(["none", "rum", "analytics", "both"]);
if (!allowedConsentRequirements.has(requiredConsent)) {
  throw new Error(`Unknown --require value "${requiredConsent}". Use none, rum, analytics or both.`);
}

const origin = new URL(originArg);
const canonicalOrigin = new URL("https://theunreliable.engineer/");
const outputDir = path.resolve("artifacts/review");
const executablePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const documents = [
  { id: "privacy-fr", path: "/confidentialite/", alternate: "/en/privacy/", title: "Politique de confidentialité" },
  { id: "privacy-en", path: "/en/privacy/", alternate: "/confidentialite/", title: "Privacy policy" },
  { id: "terms-fr", path: "/conditions-utilisation/", alternate: "/en/terms/", title: "Conditions d’utilisation" },
  { id: "terms-en", path: "/en/terms/", alternate: "/conditions-utilisation/", title: "Terms of service" },
  { id: "deletion-fr", path: "/suppression-des-donnees/", alternate: "/en/data-deletion/", title: "Instructions de suppression des données" },
  { id: "deletion-en", path: "/en/data-deletion/", alternate: "/suppression-des-donnees/", title: "Data deletion instructions" },
];

const viewports = [
  { id: "desktop", width: 1512, height: 982 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "mobile-wide", width: 430, height: 932 },
  { id: "mobile", width: 390, height: 844 },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const results = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });

    for (const document of documents) {
      const page = await context.newPage();
      const url = new URL(document.path, origin).toString();
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 });

      const metrics = await page.evaluate(({ expectedTitle, expectedAlternate, compact }) => {
        const h1s = Array.from(document.querySelectorAll("h1"));
        const legalNav = Array.from(document.querySelectorAll(".legal-document-nav a"));
        const tocLinks = Array.from(document.querySelectorAll(".legal-toc-desktop a"));
        const missingTargets = tocLinks
          .map((link) => link.getAttribute("href"))
          .filter((href) => !href || !document.querySelector(href));
        const rumRoot = document.querySelector("[data-rum-consent]");
        const analyticsRoot = document.querySelector("[data-analytics-consent]");
        const rumPanel = document.querySelector("[data-rum-panel]");
        const analyticsPanel = document.querySelector("[data-analytics-panel]");
        const h1Rect = h1s[0]?.getBoundingClientRect();
        const legalTag = document.querySelector(".legal-tag");
        const legalTagRect = legalTag?.getBoundingClientRect();
        const alternate = document.querySelector(".language-switch")?.getAttribute("href");
        const languageSwitch = document.querySelector(".language-switch");
        const languageSwitchVisible = languageSwitch ? getComputedStyle(languageSwitch).display !== "none" && languageSwitch.getBoundingClientRect().width > 0 : false;
        const rumSettings = document.querySelector("[data-rum-settings]");
        const analyticsSettings = document.querySelector("[data-analytics-settings]");
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
        const bodyText = document.body.textContent ?? "";
        const topbarTargets = Array.from(document.querySelectorAll(".topbar a, .topbar button"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return {
              label: element.getAttribute("aria-label") ?? element.textContent?.trim() ?? element.tagName,
              visible: style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0,
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          })
          .filter((target) => target.visible);
        const overflowing = Array.from(document.querySelectorAll("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return {
              element: `${element.tagName.toLowerCase()}.${Array.from(element.classList).join(".")}`,
              left: Math.round(rect.left),
              right: Math.round(rect.right),
              width: Math.round(rect.width),
              scrollWidth: element.scrollWidth,
              clientWidth: element.clientWidth,
            };
          })
          .filter((item) => item.right > window.innerWidth + 1 || item.left < -1 || item.scrollWidth > item.clientWidth + 1)
          .slice(0, 12);

        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          h1Count: h1s.length,
          h1Text: h1s[0]?.textContent?.trim() ?? "",
          h1Fits: h1Rect ? h1Rect.left >= 0 && h1Rect.right <= window.innerWidth : false,
          legalTagFits: legalTag && legalTagRect ? legalTag.scrollWidth <= legalTag.clientWidth + 1 && legalTagRect.left >= 0 && legalTagRect.right <= window.innerWidth : false,
          legalNavCount: legalNav.length,
          legalCurrentCount: legalNav.filter((link) => link.getAttribute("aria-current") === "page").length,
          blogIsCurrent: document.querySelector(".nav-blog")?.getAttribute("aria-current") === "page",
          sectionCount: document.querySelectorAll(".legal-document > .legal-section").length,
          missingTargets,
          alternate,
          languageSwitchVisible,
          expectedAlternate,
          canonical,
          hasRumRoot: Boolean(rumRoot),
          hasAnalyticsRoot: Boolean(analyticsRoot),
          rumSettingsOnly: !rumRoot || rumRoot.getAttribute("data-settings-only") === "true",
          analyticsSettingsOnly: !analyticsRoot || analyticsRoot.getAttribute("data-settings-only") === "true",
          rumPanelHidden: !rumPanel || rumPanel.hasAttribute("hidden"),
          analyticsPanelHidden: !analyticsPanel || analyticsPanel.hasAttribute("hidden"),
          floatingSettingsHidden: (!rumSettings || getComputedStyle(rumSettings).display === "none") && (!analyticsSettings || getComputedStyle(analyticsSettings).display === "none"),
          desktopTocVisible: compact || getComputedStyle(document.querySelector(".legal-toc-desktop")).display !== "none",
          mobileTocVisible: !compact || getComputedStyle(document.querySelector(".legal-toc-mobile")).display !== "none",
          hasPlaceholder: /\b(?:TODO|TBD|PLACEHOLDER)\b/i.test(bodyText),
          footerLegalLinks: document.querySelectorAll('.site-footer a[href*="privacy"], .site-footer a[href*="confidentialite"], .site-footer a[href*="terms"], .site-footer a[href*="conditions-utilisation"], .site-footer a[href*="data-deletion"], .site-footer a[href*="suppression-des-donnees"]').length,
          undersizedTopbarTargets: topbarTargets.filter((target) => target.width < 44 || target.height < 44),
          overflowing,
          expectedTitle,
        };
      }, { expectedTitle: document.title, expectedAlternate: document.alternate, compact: viewport.width <= 980 });

      assert(metrics.scrollWidth <= metrics.innerWidth, `${document.id} ${viewport.id}: horizontal overflow (${metrics.scrollWidth}px > ${metrics.innerWidth}px): ${JSON.stringify(metrics.overflowing)}`);
      assert(metrics.h1Count === 1 && metrics.h1Text === document.title, `${document.id} ${viewport.id}: invalid H1`);
      assert(metrics.h1Fits, `${document.id} ${viewport.id}: H1 is clipped`);
      assert(metrics.legalTagFits, `${document.id} ${viewport.id}: legal tag is clipped`);
      assert(metrics.legalNavCount === 3 && metrics.legalCurrentCount === 1, `${document.id} ${viewport.id}: legal navigation state is invalid`);
      assert(!metrics.blogIsCurrent, `${document.id} ${viewport.id}: Blog is incorrectly marked current`);
      assert(metrics.sectionCount >= 8, `${document.id} ${viewport.id}: legal document is incomplete`);
      assert(metrics.missingTargets.length === 0, `${document.id} ${viewport.id}: TOC target is missing`);
      assert(metrics.alternate === document.alternate, `${document.id} ${viewport.id}: language alternate is wrong (${metrics.alternate})`);
      assert(metrics.languageSwitchVisible, `${document.id} ${viewport.id}: language switch is hidden`);
      const expectedCanonical = new URL(document.path, canonicalOrigin).toString();
      assert(metrics.canonical === expectedCanonical, `${document.id} ${viewport.id}: canonical is wrong (${metrics.canonical}); build with SITE_URL=https://theunreliable.engineer before running review:legal`);
      assert(requiredConsent === "none" || requiredConsent === "analytics" || metrics.hasRumRoot, `${document.id} ${viewport.id}: Browser RUM consent root is required but absent`);
      assert(requiredConsent === "none" || requiredConsent === "rum" || metrics.hasAnalyticsRoot, `${document.id} ${viewport.id}: product analytics consent root is required but absent`);
      assert(metrics.rumSettingsOnly && metrics.analyticsSettingsOnly, `${document.id} ${viewport.id}: consent component is not settings-only`);
      assert(metrics.rumPanelHidden && metrics.analyticsPanelHidden, `${document.id} ${viewport.id}: a consent panel opened automatically`);
      assert(metrics.floatingSettingsHidden, `${document.id} ${viewport.id}: floating consent settings obstruct the legal page`);
      assert(metrics.desktopTocVisible && metrics.mobileTocVisible, `${document.id} ${viewport.id}: responsive TOC is unavailable`);
      assert(!metrics.hasPlaceholder, `${document.id} ${viewport.id}: placeholder copy is visible`);
      assert(metrics.footerLegalLinks === 3, `${document.id} ${viewport.id}: footer legal links are incomplete`);
      if (viewport.width <= 980) {
        assert(metrics.undersizedTopbarTargets.length === 0, `${document.id} ${viewport.id}: topbar target below 44px: ${JSON.stringify(metrics.undersizedTopbarTargets)}`);
      }

      await page.screenshot({
        path: path.join(outputDir, `legal-${document.id}-${viewport.id}.png`),
        fullPage: false,
      });

      if (viewport.width <= 980) {
        const details = page.locator(".legal-toc-mobile");
        await details.locator("summary").click();
        assert(await details.getAttribute("open") !== null, `${document.id}: mobile TOC does not open`);
      }

      if (document.id === "privacy-fr") {
        for (const consent of [
          { root: "[data-rum-consent]", trigger: "[data-open-rum-settings]", panel: "[data-rum-panel]", close: "[data-rum-close]" },
          { root: "[data-analytics-consent]", trigger: "[data-open-analytics-settings]", panel: "[data-analytics-panel]", close: "[data-analytics-close]" },
        ]) {
          if (await page.locator(consent.root).count() === 0) continue;
          const trigger = page.locator(`.site-footer ${consent.trigger}`);
          const panel = page.locator(consent.panel);
          await trigger.click();
          assert(await panel.getAttribute("hidden") === null, `${document.id}: consent settings did not open`);
          assert(await panel.evaluate((node) => node.contains(document.activeElement)), `${document.id}: consent dialog did not receive focus`);
          const closeButton = panel.locator(consent.close);
          const closeBox = await closeButton.boundingBox();
          assert(closeBox && closeBox.width >= 44 && closeBox.height >= 44, `${document.id} ${viewport.id}: consent close target is below 44px`);
          await closeButton.click();
          assert(await panel.getAttribute("hidden") !== null, `${document.id}: consent settings did not close`);
          assert(await trigger.evaluate((node) => node === document.activeElement), `${document.id}: consent trigger did not regain focus`);
        }
      }

      results.push({ document: document.id, viewport: viewport.id, sections: metrics.sectionCount });
      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ ok: true, results }, null, 2));
