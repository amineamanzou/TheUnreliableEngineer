import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright-core";

const baseUrl = (process.argv[2] ?? "http://127.0.0.1:4321").replace(/\/$/, "");
const outputDir = path.resolve("artifacts/review/offers");
const executablePath =
  process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const routes = [
  {
    slug: "positioning-fr",
    path: "/offres/bilan-positionnement-freelance/",
    offerId: "positioning_review",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub",
    bookingLabel: "Réserver un appel de cadrage",
    lang: "fr",
    title: "Rendre votre profil assez clair pour être trouvé par les bonnes missions.",
    required: ["restitution écrite", "appel de 30 minutes", "ne réserve pas encore l'entretien de 60 minutes"],
  },
  {
    slug: "progress-fr",
    path: "/offres/suivi-progression-tech/",
    offerId: "tech_progression",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG",
    bookingLabel: "Planifier le premier échange",
    lang: "fr",
    title: "Rendre votre progression visible, mission après mission.",
    required: ["3 mois", "premier échange de 30 minutes", "vérifier si le suivi de trois mois correspond"],
  },
  {
    slug: "case-study-fr",
    path: "/offres/etude-de-cas-tech/",
    offerId: "tech_case_study",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5",
    bookingLabel: "Proposer mon étude de cas",
    lang: "fr",
    title: "Un problème réel, analysé au téléphone.",
    required: ["appel de proposition de 30 minutes", "consultation privée à venir", "n'est pas encore réservable"],
  },
  {
    slug: "positioning-en",
    path: "/en/offers/freelance-positioning-review/",
    offerId: "positioning_review",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub",
    bookingLabel: "Book an intro call",
    lang: "en",
    title: "Make your profile clear enough to be found for the right missions.",
    required: ["written review", "30-minute call", "does not book the 60-minute interview yet"],
  },
  {
    slug: "progress-en",
    path: "/en/offers/tech-progression-follow-up/",
    offerId: "tech_progression",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG",
    bookingLabel: "Schedule the first conversation",
    lang: "en",
    title: "Make your progress visible, mission after mission.",
    required: ["3 months", "first 30-minute conversation", "checks whether the three-month follow-up fits"],
  },
  {
    slug: "case-study-en",
    path: "/en/offers/tech-case-study/",
    offerId: "tech_case_study",
    bookingUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5",
    bookingLabel: "Propose a case study",
    lang: "en",
    title: "A real problem, analysed over the phone.",
    required: ["30-minute proposal call", "private consultation to come", "cannot be booked yet"],
  },
];

const viewports = [
  { name: "desktop", width: 1512, height: 982 },
  { name: "mobile", width: 430, height: 932 },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

const report = [];
const failures = [];

for (const route of routes) {
  for (const viewport of viewports) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const response = await page.goto(`${baseUrl}${route.path}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.locator(".offer-page h1").waitFor({ state: "visible" });

    const metrics = await page.evaluate(() => {
      const h1 = document.querySelector(".offer-page h1");
      const primaryCta = document.querySelector(".offer-page .button-primary");
      const h1Rect = h1?.getBoundingClientRect();
      const ctaRect = primaryCta?.getBoundingClientRect();
      const bodyText = (document.querySelector(".offer-page")?.textContent ?? "")
        .replace(/\s+/g, " ")
        .trim();
      const analyticsCtas = Array.from(document.querySelectorAll(".offer-page [data-analytics-cta-id]"))
        .map((element) => ({
          ctaId: element.getAttribute("data-analytics-cta-id") ?? "",
          placement: element.getAttribute("data-analytics-placement") ?? "",
          offerId: element.getAttribute("data-analytics-offer-id") ?? "",
          href: element.getAttribute("href") ?? "",
          label: element.textContent?.replace(/\s+/g, " ").trim() ?? "",
        }));
      const overflow = Array.from(document.querySelectorAll(".offer-page *"))
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.right > window.innerWidth + 0.5 || rect.left < -0.5)
        .slice(0, 8)
        .map(({ element, rect }) => ({
          tag: element.tagName.toLowerCase(),
          className: element instanceof HTMLElement ? element.className : "",
          left: Math.round(rect.left * 10) / 10,
          right: Math.round(rect.right * 10) / 10,
        }));

      return {
        lang: document.documentElement.lang,
        documentTitle: document.title,
        h1: h1?.textContent?.replace(/\s+/g, " ").trim() ?? "",
        bodyText,
        innerWidth: window.innerWidth,
        scrollWidth: document.documentElement.scrollWidth,
        overflow,
        h1Visible: Boolean(h1Rect && h1Rect.width > 0 && h1Rect.height > 0),
        primaryCtaVisible: Boolean(ctaRect && ctaRect.width > 0 && ctaRect.height > 0),
        primaryCtaHref: primaryCta?.getAttribute("href") ?? "",
        analyticsCtas,
      };
    });

    const checks = {
      status: response?.status() === 200,
      lang: metrics.lang === route.lang,
      title: metrics.h1 === route.title,
      copy: route.required.every((fragment) => metrics.bodyText.toLowerCase().includes(fragment.toLowerCase())),
      noObsoleteNames: !/mission qualifiée|sparring senior|cas réel enregistré|qualified mission|senior sparring|recorded real case/i.test(
        metrics.bodyText,
      ),
      noOverflow: metrics.scrollWidth === metrics.innerWidth && metrics.overflow.length === 0,
      h1Visible: metrics.h1Visible,
      primaryCta:
        metrics.primaryCtaVisible
        && metrics.primaryCtaHref === route.bookingUrl
        && metrics.analyticsCtas.every((cta) => cta.href === route.bookingUrl && cta.label === route.bookingLabel),
      bookingAnalytics:
        metrics.analyticsCtas.length === 2
        && metrics.analyticsCtas.every((cta) => cta.ctaId === "book_offer" && cta.offerId === route.offerId)
        && new Set(metrics.analyticsCtas.map((cta) => cta.placement)).size === 2
        && metrics.analyticsCtas.some((cta) => cta.placement === "offer_hero")
        && metrics.analyticsCtas.some((cta) => cta.placement === "offer_closing"),
    };

    const failedChecks = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    if (failedChecks.length > 0) {
      failures.push({ route: route.path, viewport: viewport.name, failedChecks, metrics });
    }

    await page.screenshot({
      path: path.join(outputDir, `${route.slug}-${viewport.name}.png`),
      fullPage: true,
    });
    report.push({ route: route.path, viewport: viewport.name, checks, metrics });
    await page.close();
  }
}

await browser.close();

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0) {
  console.error(JSON.stringify({ failures }, null, 2));
  process.exit(1);
}
