import { existsSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { chromium } from "playwright-core";

const pageUrl = process.env.PRODUCT_ANALYTICS_QA_URL ?? "http://127.0.0.1:4321/";
const endpointOrigin = "https://eu.i.posthog.com";
const timeout = 20_000;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitFor(predicate, message) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    if (predicate()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(message);
}

const playwrightExecutablePath = chromium.executablePath();
const relative = playwrightExecutablePath.match(/(?:^|\/)(chromium-\d+\/.*)$/)?.[1];
const candidates = [
  process.env.CHROME_PATH,
  relative && process.env.HOME ? `${process.env.HOME}/Library/Caches/ms-playwright/${relative}` : undefined,
  relative && process.env.HOME ? `${process.env.HOME}/.cache/ms-playwright/${relative}` : undefined,
  playwrightExecutablePath,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].filter(Boolean);
const executablePath = candidates.find(existsSync);
assert(executablePath, `Chrome executable not found; checked ${candidates.join(", ")}`);

const browser = await chromium.launch({ executablePath, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage"] });

async function installEndpointRoute(page, records) {
  await page.route(`${endpointOrigin}/**`, async (route) => {
    const request = route.request();
    const body = request.postDataBuffer() ?? Buffer.alloc(0);
    const decodedBody = body[0] === 0x1f && body[1] === 0x8b ? gunzipSync(body).toString("utf8") : body.toString("utf8");
    records.push({ method: request.method(), url: request.url(), body: decodedBody, headers: request.headers() });
    const cors = {
      "access-control-allow-origin": new URL(pageUrl).origin,
      "access-control-allow-methods": "POST, OPTIONS, GET",
      "access-control-allow-headers": "content-type",
    };
    if (request.method() === "OPTIONS") await route.fulfill({ status: 204, headers: cors, body: "" });
    else await route.fulfill({ status: 200, headers: cors, contentType: "application/json", body: "{}" });
  });
}

async function resolveRumPromptIfPresent(page) {
  const root = page.locator("[data-rum-consent]");
  if (await root.count() === 0) return;
  const panel = page.locator("[data-rum-panel]");
  await panel.waitFor({ state: "visible", timeout });
  assert(await page.locator("[data-analytics-panel]").isHidden(), "Product analytics opened before the Browser RUM decision closed");
  await page.locator("[data-rum-decline]").click();
  await panel.waitFor({ state: "hidden", timeout });
}

try {
  const browserUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36";
  const context = await browser.newContext({ userAgent: browserUserAgent });
  await context.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { configurable: true, get: () => false });
  });
  const page = await context.newPage();
  const requests = [];
  const scriptRequests = [];
  const pageErrors = [];
  const consoleMessages = [];
  const allRequests = [];
  page.on("request", (request) => {
    allRequests.push(`${request.method()} ${request.url()}`);
    if (request.resourceType() === "script") scriptRequests.push(request.url());
  });
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => consoleMessages.push(`${message.type()}: ${message.text()}`));
  await installEndpointRoute(page, requests);

  await page.goto(`${pageUrl}?utm_source=linkedin&utm_campaign=p2-qa&email=secret@example.test#private`, { waitUntil: "networkidle", timeout });
  await resolveRumPromptIfPresent(page);
  await page.locator("[data-analytics-panel]").waitFor({ state: "visible", timeout });
  assert(requests.length === 0, "PostHog endpoint contacted before consent");
  assert(!scriptRequests.some((url) => url.includes("module.no-external")), "PostHog SDK chunk loaded before consent");
  assert(!(await context.cookies()).some((cookie) => cookie.name.startsWith("ph_")), "PostHog cookie created before consent");

  await page.locator("[data-analytics-accept]").click();
  await waitFor(() => scriptRequests.some((url) => url.includes("module.no-external")), "PostHog SDK chunk did not load after consent");
  await page.waitForTimeout(1500);
  if (!requests.some((request) => request.method === "POST")) {
    const storage = await page.evaluate(() => Object.fromEntries(Object.keys(localStorage).map((key) => [key, localStorage.getItem(key)])));
    throw new Error(`PostHog did not receive the manual pageview: ${JSON.stringify({ requests, pageErrors, consoleMessages, storage, allRequests })}`);
  }

  await page.evaluate(() => {
    document.querySelector("[data-analytics-cta-id='view_offers']")?.addEventListener("click", (event) => event.preventDefault(), { once: true });
  });
  const requestsBeforeClick = requests.filter((request) => request.method === "POST").length;
  await page.locator("[data-analytics-placement='hero'][data-analytics-cta-id='view_offers']").click();
  await waitFor(
    () => requests.filter((request) => request.method === "POST").length === requestsBeforeClick + 1,
    "One CTA click did not emit exactly one additional request",
  );

  await page.evaluate(() => {
    document.querySelector("[data-analytics-cta-id='view_offer'][data-analytics-offer-id='positioning_review']")
      ?.addEventListener("click", (event) => event.preventDefault(), { once: true });
  });
  const requestsBeforeOfferSelection = requests.filter((request) => request.method === "POST").length;
  await page.locator("[data-analytics-cta-id='view_offer'][data-analytics-offer-id='positioning_review']").click();
  await waitFor(
    () => requests.filter((request) => request.method === "POST").length === requestsBeforeOfferSelection + 1,
    "One offer selection did not emit exactly one additional request",
  );

  const offerPages = [
    ["offres/bilan-positionnement-freelance/", "positioning_review", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub", "Réserver un appel de cadrage"],
    ["offres/suivi-progression-tech/", "tech_progression", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG", "Planifier le premier échange"],
    ["offres/etude-de-cas-tech/", "tech_case_study", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5", "Proposer mon étude de cas"],
  ];
  for (const [path, offerId, bookingUrl, bookingLabel] of offerPages) {
    const requestsBeforeOfferPage = requests.filter((request) => request.method === "POST").length;
    await page.goto(new URL(path, pageUrl).toString(), { waitUntil: "networkidle", timeout });
    await waitFor(
      () => requests.filter((request) => request.method === "POST").length > requestsBeforeOfferPage,
      `Offer pageview was not emitted for ${offerId}`,
    );
    for (const placement of ["offer_hero", "offer_closing"]) {
      const bookingCta = page.locator(
        `[data-analytics-placement='${placement}'][data-analytics-cta-id='book_offer'][data-analytics-offer-id='${offerId}']`,
      );
      assert(await bookingCta.getAttribute("href") === bookingUrl, `Unexpected Calendar URL for ${offerId} at ${placement}`);
      assert((await bookingCta.textContent())?.trim() === bookingLabel, `Unexpected booking label for ${offerId} at ${placement}`);
      await page.evaluate(({ currentOfferId, currentPlacement }) => {
        const cta = document.querySelector(
          `[data-analytics-placement='${currentPlacement}'][data-analytics-cta-id='book_offer'][data-analytics-offer-id='${currentOfferId}']`,
        );
        cta?.setAttribute("href", "https://calendar.google.com/calendar/appointments/schedules/private-test-url");
        cta?.addEventListener("click", (event) => event.preventDefault(), { once: true });
      }, { currentOfferId: offerId, currentPlacement: placement });
      const requestsBeforeOfferBooking = requests.filter((request) => request.method === "POST").length;
      await page.locator(
        `[data-analytics-placement='${placement}'][data-analytics-cta-id='book_offer'][data-analytics-offer-id='${offerId}']`,
      ).click();
      await waitFor(
        () => requests.filter((request) => request.method === "POST").length === requestsBeforeOfferBooking + 1,
        `Offer booking did not emit exactly one event for ${offerId} at ${placement}`,
      );
    }

    const requestsBeforeInvalidBooking = requests.filter((request) => request.method === "POST").length;
    await page.evaluate(() => {
      const invalidCta = document.createElement("button");
      invalidCta.dataset.analyticsEvent = "site.cta_click";
      invalidCta.dataset.analyticsPlacement = "offer_hero";
      invalidCta.dataset.analyticsCtaId = "book_offer";
      document.body.append(invalidCta);
      invalidCta.click();
      invalidCta.remove();
    });
    await page.waitForTimeout(250);
    assert(
      requests.filter((request) => request.method === "POST").length === requestsBeforeInvalidBooking,
      `book_offer without offer_id emitted an event for ${offerId}`,
    );

    await page.evaluate((currentOfferId) => {
      const invalidPlacementCta = document.createElement("button");
      invalidPlacementCta.dataset.analyticsEvent = "site.cta_click";
      invalidPlacementCta.dataset.analyticsPlacement = "footer";
      invalidPlacementCta.dataset.analyticsCtaId = "book_offer";
      invalidPlacementCta.dataset.analyticsOfferId = currentOfferId;
      document.body.append(invalidPlacementCta);
      invalidPlacementCta.click();
      invalidPlacementCta.remove();
    }, offerId);
    await page.waitForTimeout(250);
    assert(
      requests.filter((request) => request.method === "POST").length === requestsBeforeInvalidBooking,
      `book_offer with an invalid placement emitted an event for ${offerId}`,
    );

    await page.evaluate((currentOfferId) => {
      const historicalCta = document.createElement("button");
      historicalCta.dataset.analyticsEvent = "site.cta_click";
      historicalCta.dataset.analyticsPlacement = "offer_hero";
      historicalCta.dataset.analyticsCtaId = "contact_offer";
      historicalCta.dataset.analyticsOfferId = currentOfferId;
      document.body.append(historicalCta);
      historicalCta.click();
      historicalCta.remove();
    }, offerId);
    await page.waitForTimeout(250);
    assert(
      requests.filter((request) => request.method === "POST").length === requestsBeforeInvalidBooking,
      `Historical contact_offer emitted an event for ${offerId}`,
    );
  }

  const requestsBeforeBlog = requests.filter((request) => request.method === "POST").length;
  await page.goto(new URL("blog/", pageUrl).toString(), { waitUntil: "networkidle", timeout });
  await waitFor(
    () => requests.filter((request) => request.method === "POST").length > requestsBeforeBlog,
    "Blog pageview was not emitted for the consented visitor",
  );
  const requestsBeforeSearch = requests.filter((request) => request.method === "POST").length;
  await page.locator("[data-terminal-form] input").fill("rg super-secret-terminal-query");
  await page.locator("[data-terminal-form]").evaluate((form) => form.requestSubmit());
  await waitFor(
    () => requests.filter((request) => request.method === "POST").length === requestsBeforeSearch + 1,
    "Terminal search did not emit exactly one privacy-safe event",
  );

  const serialized = requests.map((request) => {
    try {
      return decodeURIComponent(`${request.url}\n${request.body}`.replaceAll("+", " "));
    } catch {
      return `${request.url}\n${request.body}`;
    }
  }).join("\n");
  for (const forbidden of ["secret@example.test", "super-secret-terminal-query", "contact@theunreliable.engineer", "subject=", "email=", "#private", "$current_url", "$referrer", "calendar.google.com", "private-test-url", "business.lead_created", "contact_offer"]) {
    assert(!serialized.includes(forbidden), `Forbidden analytics data reached the endpoint: ${forbidden}`);
  }
  assert(serialized.includes("site.cta_click"), "CTA event name is missing from PostHog payload");
  assert(serialized.includes("view_offers"), "Offer section CTA id is missing from PostHog payload");
  assert(serialized.includes("view_offer"), "Offer selection CTA id is missing from PostHog payload");
  assert(serialized.includes("book_offer"), "Offer booking CTA id is missing from PostHog payload");
  for (const offerId of ["positioning_review", "tech_progression", "tech_case_study"]) {
    assert(serialized.includes(offerId), `Offer ID is missing from PostHog payload: ${offerId}`);
  }
  assert(serialized.includes("1.2.0"), "Analytics schema version 1.2.0 is missing from PostHog payload");
  assert(serialized.includes("site.blog_search"), "Terminal analytics event is missing from PostHog payload");
  assert(serialized.includes("25-64"), "Terminal query length bucket is missing from PostHog payload");
  assert(serialized.includes("p2-qa"), "Normalized campaign attribution is missing");

  await page.locator("[data-analytics-settings]").click();
  const navigated = page.waitForEvent("framenavigated");
  await page.locator("[data-analytics-withdraw]").click();
  await navigated;
  await page.waitForLoadState("networkidle");
  const denied = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((candidate) => candidate.startsWith("tue-product-analytics-consent-"));
    return key ? JSON.parse(localStorage.getItem(key) ?? "null") : null;
  });
  assert(denied?.state === "denied", "Withdrawal did not persist denied state");
  assert(!(await context.cookies()).some((cookie) => cookie.name.startsWith("ph_")), "PostHog cookie remained after withdrawal");
  await context.close();

  const privacyContext = await browser.newContext({ userAgent: browserUserAgent });
  await privacyContext.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, "webdriver", { configurable: true, get: () => false });
    Object.defineProperty(Navigator.prototype, "globalPrivacyControl", { configurable: true, get: () => true });
  });
  const privacyPage = await privacyContext.newPage();
  const privacyRequests = [];
  await installEndpointRoute(privacyPage, privacyRequests);
  await privacyPage.goto(pageUrl, { waitUntil: "networkidle", timeout });
  await resolveRumPromptIfPresent(privacyPage);
  await privacyPage.locator("[data-analytics-settings]").click();
  assert(await privacyPage.locator("[data-analytics-accept]").isDisabled(), "GPC did not disable analytics opt-in");
  assert(privacyRequests.length === 0, "PostHog endpoint contacted under GPC");
  await privacyContext.close();

  assert(pageErrors.length === 0, `Browser errors: ${pageErrors.join(" | ")}`);
  console.log(JSON.stringify({
    ok: true,
    phases: ["pre-consent", "manual-events", "withdrawal", "gpc"],
    postRequests: requests.filter((request) => request.method === "POST").length,
    sdkLoadedOnlyAfterConsent: true,
    sensitiveValuesExcluded: true,
  }, null, 2));
} finally {
  await browser.close();
}
