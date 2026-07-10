import { chromium } from "playwright-core";

const url = process.argv[2] ?? "http://127.0.0.1:4321/";
const executablePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const endpointOrigin = "https://otel.theunreliable.engineer";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const endpointRequests = [];
  const javascriptRequests = [];

  await page.route(`${endpointOrigin}/**`, async (route) => {
    endpointRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  page.on("request", (request) => {
    if (request.resourceType() === "script") javascriptRequests.push(request.url());
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator("[data-rum-panel]").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.hasAttribute("data-rum-accept"));

  const scriptsBeforeConsent = [...javascriptRequests];
  const cookiesBeforeConsent = await context.cookies();
  assert(endpointRequests.length === 0, "OTLP request observed before consent");
  assert(!cookiesBeforeConsent.some((cookie) => cookie.name === "__rum_sid"), "RUM cookie observed before consent");

  await page.locator("[data-rum-accept]").click();
  await page.waitForFunction(() => document.cookie.includes("__rum_sid="), undefined, { timeout: 10000 });
  await page.waitForTimeout(6000);

  const scriptsAfterConsent = [...javascriptRequests];
  const cookiesAfterConsent = await context.cookies();
  assert(scriptsAfterConsent.length > scriptsBeforeConsent.length, "No additional SDK chunk loaded after consent");
  assert(cookiesAfterConsent.some((cookie) => cookie.name === "__rum_sid"), "RUM cookie missing after consent");
  assert(endpointRequests.some((requestUrl) => requestUrl === `${endpointOrigin}/v1/traces`), "Expected OTLP traces request was not attempted after consent");

  await page.locator("[data-rum-settings]").click();
  const reloaded = page.waitForEvent("framenavigated");
  await page.locator("[data-rum-withdraw]").click();
  await reloaded;
  await page.waitForLoadState("networkidle");

  const cookiesAfterWithdrawal = await context.cookies();
  const decision = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((candidate) => candidate.startsWith("tue-browser-observability-consent-"));
    return key ? JSON.parse(localStorage.getItem(key) ?? "null") : null;
  });
  assert(!cookiesAfterWithdrawal.some((cookie) => cookie.name === "__rum_sid"), "RUM cookie remained after withdrawal");
  assert(decision?.state === "denied", "Withdrawal did not persist the denied decision");

  const blockedContext = await browser.newContext();
  const blockedPage = await blockedContext.newPage();
  const blockedEndpointRequests = [];
  await blockedPage.addInitScript(() => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key.startsWith("tue-browser-observability-consent-")) {
        throw new DOMException("Storage blocked", "SecurityError");
      }
      return originalSetItem.call(this, key, value);
    };
  });
  await blockedPage.route(`${endpointOrigin}/**`, async (route) => {
    blockedEndpointRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  await blockedPage.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await blockedPage.locator("[data-rum-accept]").click();
  await blockedPage.waitForTimeout(500);
  assert(await blockedPage.locator("[data-rum-panel]").isVisible(), "Failed grant persistence hid the consent panel");
  assert((await blockedPage.locator("[data-rum-status]").textContent())?.trim(), "Failed grant persistence did not show a message");
  assert(blockedEndpointRequests.length === 0, "SDK started after grant persistence failed");
  assert(!(await blockedContext.cookies()).some((cookie) => cookie.name === "__rum_sid"), "RUM cookie created after grant persistence failed");
  await blockedContext.close();

  const initFailureContext = await browser.newContext();
  const initFailurePage = await initFailureContext.newPage();
  await initFailurePage.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  await initFailurePage.route("**/_astro/*.js", (route) => route.abort("blockedbyclient"));
  await initFailurePage.locator("[data-rum-accept]").click();
  await initFailurePage.locator("[data-rum-status]").waitFor({ state: "visible" });
  assert(await initFailurePage.locator("[data-rum-panel]").isVisible(), "SDK init failure did not reopen visible settings");
  assert((await initFailurePage.locator("[data-rum-status]").textContent())?.trim(), "SDK init failure did not show a message");
  assert(!(await initFailureContext.cookies()).some((cookie) => cookie.name === "__rum_sid"), "SDK init failure left a RUM cookie");
  await initFailureContext.close();

  const optOutContext = await browser.newContext();
  await optOutContext.addCookies([{
    name: "__rum_optout",
    value: "2026-07-10",
    url,
    sameSite: "Strict",
  }]);
  const optOutPage = await optOutContext.newPage();
  const optOutEndpointRequests = [];
  await optOutPage.addInitScript(() => {
    localStorage.setItem("tue-browser-observability-consent-2026-07-10", JSON.stringify({
      state: "granted",
      version: "2026-07-10",
      decidedAt: new Date().toISOString(),
    }));
  });
  await optOutPage.route(`${endpointOrigin}/**`, async (route) => {
    optOutEndpointRequests.push(route.request().url());
    await route.abort("blockedbyclient");
  });
  await optOutPage.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  assert(await optOutPage.locator("[data-rum-settings]").isVisible(), "Opt-out did not resolve to the denied settings state");
  assert(optOutEndpointRequests.length === 0, "Local grant overrode the first-party opt-out fallback");
  assert(!(await optOutContext.cookies()).some((cookie) => cookie.name === "__rum_sid"), "Opt-out priority still created a RUM cookie");
  await optOutContext.close();

  console.log(JSON.stringify({
    ok: true,
    scriptsBeforeConsent: scriptsBeforeConsent.length,
    scriptsAfterConsent: scriptsAfterConsent.length,
    endpointRequests: endpointRequests.length,
    withdrawalState: decision.state,
    failedGrantStayedClosed: true,
    initFailureStayedVisible: true,
    optOutPriority: true,
  }, null, 2));
} finally {
  await browser.close();
}
