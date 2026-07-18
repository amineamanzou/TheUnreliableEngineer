import { chromium } from "playwright-core";

const baseUrl = new URL(process.argv[2] ?? "http://127.0.0.1:4321/");
const executablePath = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const endpoint = new URL(process.env.BROWSER_OBSERVABILITY_OTLP_URL ?? "https://otel.theunreliable.engineer.test");
const endpointOrigin = endpoint.origin;
const tracesUrl = `${endpointOrigin}/v1/traces`;
const consentKeyPrefix = "tue-browser-observability-consent-";
const sessionCookieName = "__rum_sid";
const actionNames = ["browser.error", "browser.unhandledrejection", "browser.resource.error"];
const sentinels = {
  error: "rum-smoke-error-message-must-not-leak",
  rejection: "rum-smoke-rejection-message-must-not-leak",
  resource: "rum-smoke-resource-url-must-only-be-transient",
};
const sentinelValues = Object.values(sentinels);
const resourceSentinelPath = `/assets/${sentinels.resource}.png`;
const forbiddenActionAttributeKeys = new Set([
  "error.message",
  "event.filename",
  "event.message",
  "exception.message",
  "exception.stacktrace",
  "http.request.body",
  "http.response.body",
  "http.url",
  "location.hash",
  "location.search",
  "url.full",
  "url.path",
  "url.query",
]);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(endpoint.protocol === "https:", "The intercepted OTLP endpoint must use HTTPS");
assert(endpoint.hostname.endsWith(".test"), "Browser smoke OTLP endpoint must use the reserved .test TLD");
assert(endpoint.pathname === "/", "Browser smoke OTLP endpoint must not include a path");

const smokeUrl = new URL(baseUrl);

function decodeAnyValue(value = {}) {
  if ("stringValue" in value) return value.stringValue;
  if ("boolValue" in value) return value.boolValue;
  if ("intValue" in value) return value.intValue;
  if ("doubleValue" in value) return value.doubleValue;
  if ("bytesValue" in value) return value.bytesValue;
  if (value.arrayValue?.values) return value.arrayValue.values.map(decodeAnyValue);
  if (value.kvlistValue?.values) return Object.fromEntries(value.kvlistValue.values.map(({ key, value: nested }) => [key, decodeAnyValue(nested)]));
  return undefined;
}

function decodeAttributes(attributes = []) {
  return Object.fromEntries(attributes.map(({ key, value }) => [key, decodeAnyValue(value)]));
}

function decodeBatches(payloads) {
  return payloads.flatMap((payload, batchIndex) => (payload.resourceSpans ?? []).flatMap((resourceSpans) => {
    const resourceAttributes = decodeAttributes(resourceSpans.resource?.attributes);
    const scopes = resourceSpans.scopeSpans ?? resourceSpans.instrumentationLibrarySpans ?? [];
    return scopes.flatMap((scopeSpans) => (scopeSpans.spans ?? []).map((span) => ({
      batchIndex,
      resourceAttributes,
      ...span,
      attributes: decodeAttributes(span.attributes),
      events: (span.events ?? []).map((event) => ({ ...event, attributes: decodeAttributes(event.attributes) })),
      links: span.links ?? [],
    })));
  }));
}

function decodeSessionCookie(cookie) {
  assert(cookie, "RUM session cookie is missing");
  let value = cookie.value;
  try {
    value = decodeURIComponent(value);
  } catch {
    // Playwright can already expose a decoded value.
  }
  let session;
  try {
    session = JSON.parse(value);
  } catch {
    throw new Error("RUM session cookie is not valid JSON");
  }
  assert(typeof session.id === "string" && /^[0-9a-f]{32}$/.test(session.id), "RUM session cookie does not contain a 32-hex session ID");
  return session;
}

function assertTransientPayloadPrivacy(payloads, actionSpans) {
  let transientLocationObserved = false;
  let resourceUrlSentinelCount = 0;
  const sanitizedPayloads = structuredClone(payloads);

  for (const payload of sanitizedPayloads) {
    for (const resourceSpans of payload.resourceSpans ?? []) {
      for (const scopeSpans of resourceSpans.scopeSpans ?? resourceSpans.instrumentationLibrarySpans ?? []) {
        for (const span of scopeSpans.spans ?? []) {
          for (const attribute of span.attributes ?? []) {
            const value = decodeAnyValue(attribute.value);
            if (attribute.key === "location.href" && typeof value === "string" && value.startsWith(smokeUrl.origin)) {
              transientLocationObserved = true;
              assert(!sentinelValues.some((sentinel) => value.includes(sentinel)), "Transient location.href contains a smoke sentinel");
            }
            if (typeof value !== "string" || !value.includes(sentinels.resource)) continue;
            assert(span.name === "resourceFetch" && attribute.key === "http.url", `Resource URL sentinel escaped through ${span.name}.${attribute.key}`);
            resourceUrlSentinelCount += 1;
            attribute.value = { stringValue: "[allowed transient resourceFetch.http.url]" };
          }
        }
      }
    }
  }

  const serializedPayload = JSON.stringify(sanitizedPayloads);
  for (const sentinel of sentinelValues) {
    assert(!serializedPayload.includes(sentinel), `Sensitive sentinel escaped into the raw OTLP payload: ${sentinel}`);
  }
  assert(resourceUrlSentinelCount === 1, `Expected one transient resourceFetch.http.url sentinel, observed ${resourceUrlSentinelCount}`);
  assert(transientLocationObserved, "The raw SDK payload did not expose the disclosed transient location.href attribute");

  for (const span of actionSpans) {
    for (const [key, value] of Object.entries(span.attributes)) {
      const normalizedKey = key.toLowerCase();
      assert(!forbiddenActionAttributeKeys.has(normalizedKey), `${span.name} contains forbidden attribute ${key}`);
      assert(!normalizedKey.startsWith("user.") && !normalizedKey.startsWith("target."), `${span.name} contains high-risk attribute ${key}`);
      assert(!sentinelValues.some((sentinel) => JSON.stringify(value).includes(sentinel)), `${span.name}.${key} contains a smoke sentinel`);
    }
  }
}

async function installOtlpInterceptor(page) {
  const state = { requests: [], payloads: [], failures: [] };

  await page.route(`${endpointOrigin}/**`, async (route) => {
    const request = route.request();
    const requestUrl = request.url();
    state.requests.push({ method: request.method(), url: requestUrl });

    const corsHeaders = {
      "access-control-allow-origin": request.headers().origin ?? smokeUrl.origin,
      "access-control-allow-methods": "POST, OPTIONS",
      "access-control-allow-headers": "content-type, authorization",
    };

    if (request.method() === "OPTIONS") {
      if (requestUrl !== tracesUrl) {
        state.failures.push(`Unexpected OTLP preflight path: ${requestUrl}`);
        await route.fulfill({ status: 404, headers: corsHeaders });
        return;
      }
      await route.fulfill({ status: 204, headers: corsHeaders });
      return;
    }

    let status = 200;
    try {
      assert(request.method() === "POST", `Unexpected OTLP method: ${request.method()}`);
      assert(requestUrl === tracesUrl, `Unexpected OTLP path: ${requestUrl}`);
      const contentType = (await request.headerValue("content-type")) ?? "";
      assert(/^application\/json(?:;\s*charset=utf-8)?$/i.test(contentType), `OTLP Content-Type is not strict JSON: ${contentType}`);
      const contentEncoding = ((await request.headerValue("content-encoding")) ?? "identity").toLowerCase();
      assert(contentEncoding === "identity", `Compressed OTLP request cannot be inspected fail-closed: ${contentEncoding}`);
      const body = request.postDataBuffer();
      assert(body?.length, "OTLP JSON request has no body");
      const payload = JSON.parse(body.toString("utf8"));
      assert(Array.isArray(payload.resourceSpans), "OTLP JSON payload has no resourceSpans array");
      state.payloads.push(payload);
    } catch (error) {
      status = 400;
      state.failures.push(error instanceof Error ? error.message : String(error));
    }

    await route.fulfill({
      status,
      headers: { ...corsHeaders, "content-type": "application/json" },
      body: status === 200 ? "{}" : JSON.stringify({ error: "invalid smoke payload" }),
    });
  });

  return state;
}

async function installResourceSentinelRoute(page) {
  const state = { requests: 0 };
  await page.route(`${smokeUrl.origin}${resourceSentinelPath}`, async (route) => {
    state.requests += 1;
    await route.fulfill({
      status: 404,
      headers: { "cache-control": "no-store", "content-type": "image/png" },
      body: "",
    });
  });
  return state;
}

async function readDecision(page) {
  return page.evaluate((prefix) => {
    const key = Object.keys(localStorage).find((candidate) => candidate.startsWith(prefix));
    return key ? JSON.parse(localStorage.getItem(key) ?? "null") : null;
  }, consentKeyPrefix);
}

async function triggerPrivacySafeActions(page) {
  await page.evaluate(({ sentinels }) => {
    setTimeout(() => {
      throw new TypeError(sentinels.error);
    }, 0);
    Promise.reject(new RangeError(sentinels.rejection));
    const image = document.createElement("img");
    image.src = `/assets/${sentinels.resource}.png`;
    image.hidden = true;
    document.body.append(image);
  }, { sentinels });
}

async function waitForActions(state, timeout = 20000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const names = new Set(decodeBatches(state.payloads).map((span) => span.name));
    if (actionNames.every((name) => names.has(name))) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for privacy-safe action spans; observed: ${[...new Set(decodeBatches(state.payloads).map((span) => span.name))].join(", ")}`);
}

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});

try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const endpointState = await installOtlpInterceptor(page);
  const resourceStimuli = await installResourceSentinelRoute(page);
  const javascriptRequests = [];
  page.on("request", (request) => {
    if (request.resourceType() === "script") javascriptRequests.push(request.url());
  });

  await page.goto(smokeUrl.href, { waitUntil: "networkidle", timeout: 30000 });
  await page.locator("[data-rum-panel]").waitFor({ state: "visible" });
  await page.waitForFunction(() => document.activeElement?.hasAttribute("data-rum-accept"));

  const scriptsBeforeConsent = [...javascriptRequests];
  await triggerPrivacySafeActions(page);
  await page.waitForTimeout(5500);
  const cookiesBeforeConsent = await context.cookies();
  assert(endpointState.requests.length === 0, "OTLP request observed before consent");
  assert(!cookiesBeforeConsent.some((cookie) => cookie.name === sessionCookieName), "RUM cookie observed before consent");
  assert(javascriptRequests.length === scriptsBeforeConsent.length, "A script chunk loaded after pre-consent faults");
  assert(resourceStimuli.requests === 1, `Pre-consent resource stimulus did not execute exactly once: ${resourceStimuli.requests}`);

  const runtimeConfig = await page.locator("[data-rum-consent]").evaluate((element) => ({
    service: element.dataset.service,
    version: element.dataset.version,
  }));
  assert(runtimeConfig.service, "Enabled build has no browser service name");
  assert(runtimeConfig.version && /^[0-9a-f]{40}$/.test(runtimeConfig.version), "Enabled build service.version is not a 40-hex Git SHA");

  await page.locator("[data-rum-accept]").click();
  await page.waitForFunction(() => document.cookie.includes("__rum_sid="), undefined, { timeout: 10000 });
  await triggerPrivacySafeActions(page);
  await waitForActions(endpointState);
  assert(resourceStimuli.requests === 2, `Consented resource stimulus did not execute exactly once: ${resourceStimuli.requests}`);

  const scriptsAfterConsent = [...javascriptRequests];
  const cookiesAfterConsent = await context.cookies();
  const session = decodeSessionCookie(cookiesAfterConsent.find((cookie) => cookie.name === sessionCookieName));
  const sdkScripts = [...new Set(scriptsAfterConsent.slice(scriptsBeforeConsent.length))];
  assert(sdkScripts.length > 0, "No additional SDK chunk loaded after consent");
  assert(endpointState.requests.some(({ method, url: requestUrl }) => method === "POST" && requestUrl === tracesUrl), "Expected OTLP traces request was not intercepted after consent");
  assert(endpointState.failures.length === 0, `OTLP interception failed closed: ${endpointState.failures.join("; ")}`);
  assert(endpointState.payloads.length >= 1, "Expected at least one OTLP JSON batch");

  const spans = decodeBatches(endpointState.payloads);
  const actionSpans = spans.filter((span) => actionNames.includes(span.name));
  assert(actionNames.every((name) => actionSpans.filter((span) => span.name === name).length === 1), "Expected exactly one span per privacy-safe action");
  assert(spans.every((span) => /^[0-9a-f]{32}$/.test(span.traceId ?? "") && !/^0+$/.test(span.traceId)), "An emitted span has an invalid trace ID");
  assert(spans.every((span) => /^[0-9a-f]{16}$/.test(span.spanId ?? "") && !/^0+$/.test(span.spanId)), "An emitted span has an invalid span ID");
  assert(spans.every((span) => span.links.length === 0), "A browser span contains links and would be rejected by the collector");
  assert(spans.every((span) => span.resourceAttributes["service.version"] === runtimeConfig.version), "service.version is missing or inconsistent across OTLP batches");
  assert(spans.every((span) => span.resourceAttributes["page.route"] === "/"), "Closed page.route is missing or inconsistent across OTLP batches");
  assert(spans.every((span) => span.resourceAttributes["rum.sessionId"] === session.id), "rum.sessionId does not match the first-party session cookie");
  assert(actionSpans.every((span) => span.events.length === 0), "Privacy-safe action spans must not carry exception events");
  assert(actionSpans.find((span) => span.name === "browser.error")?.attributes["error.type"] === "TypeError", "browser.error lost its safe error.type");
  assert(actionSpans.find((span) => span.name === "browser.unhandledrejection")?.attributes["error.type"] === "RangeError", "browser.unhandledrejection lost its safe error.type");
  assert(actionSpans.find((span) => span.name === "browser.resource.error")?.attributes["resource.type"] === "img", "browser.resource.error lost its safe resource.type");
  assert(actionSpans.every((span) => span.attributes["page.route"] === "/"), "Privacy-safe action spans must use the closed page.route vocabulary");
  assertTransientPayloadPrivacy(endpointState.payloads, actionSpans);

  await page.locator("[data-rum-settings]").click();
  const reloaded = page.waitForEvent("framenavigated");
  await page.locator("[data-rum-withdraw]").click();
  await reloaded;
  await page.waitForLoadState("networkidle");

  const cookiesAfterWithdrawal = await context.cookies();
  const decision = await readDecision(page);
  assert(!cookiesAfterWithdrawal.some((cookie) => cookie.name === sessionCookieName), "RUM cookie remained after withdrawal");
  assert(decision?.state === "denied", "Withdrawal did not persist the denied decision");

  // The previous page may flush one last exporter batch during pagehide. Only
  // establish the denied baseline after that bounded exporter window.
  await page.waitForTimeout(5500);
  const deniedPostBaseline = endpointState.requests.filter(({ method }) => method === "POST").length;
  const deniedScriptBaseline = javascriptRequests.length;
  await triggerPrivacySafeActions(page);
  await page.waitForTimeout(5500);
  const deniedPostCount = endpointState.requests.filter(({ method }) => method === "POST").length;
  const scriptsAfterDeniedFaults = javascriptRequests.slice(deniedScriptBaseline);
  assert(deniedPostCount === deniedPostBaseline, "OTLP restarted after faults in the denied state");
  assert(!scriptsAfterDeniedFaults.some((requestUrl) => sdkScripts.includes(requestUrl)), "SDK chunk reloaded after faults in the denied state");
  assert(resourceStimuli.requests === 3, `Denied resource stimulus did not execute exactly once: ${resourceStimuli.requests}`);

  const blockedContext = await browser.newContext();
  const blockedPage = await blockedContext.newPage();
  const blockedEndpointState = await installOtlpInterceptor(blockedPage);
  await blockedPage.addInitScript((prefix) => {
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function setItem(key, value) {
      if (key.startsWith(prefix)) throw new DOMException("Storage blocked", "SecurityError");
      return originalSetItem.call(this, key, value);
    };
  }, consentKeyPrefix);
  await blockedPage.goto(smokeUrl.href, { waitUntil: "networkidle", timeout: 30000 });
  await blockedPage.locator("[data-rum-accept]").click();
  await blockedPage.waitForTimeout(500);
  assert(await blockedPage.locator("[data-rum-panel]").isVisible(), "Failed grant persistence hid the consent panel");
  assert((await blockedPage.locator("[data-rum-status]").textContent())?.trim(), "Failed grant persistence did not show a message");
  assert(blockedEndpointState.requests.length === 0, "SDK started after grant persistence failed");
  assert(!(await blockedContext.cookies()).some((cookie) => cookie.name === sessionCookieName), "RUM cookie created after grant persistence failed");
  await blockedContext.close();

  const initFailureContext = await browser.newContext();
  const initFailurePage = await initFailureContext.newPage();
  const initFailureEndpointState = await installOtlpInterceptor(initFailurePage);
  await initFailurePage.goto(smokeUrl.href, { waitUntil: "networkidle", timeout: 30000 });
  await initFailurePage.route("**/_astro/*.js", (route) => route.abort("blockedbyclient"));
  await initFailurePage.locator("[data-rum-accept]").click();
  await initFailurePage.locator("[data-rum-status]").waitFor({ state: "visible" });
  assert(await initFailurePage.locator("[data-rum-panel]").isVisible(), "SDK init failure did not reopen visible settings");
  assert((await initFailurePage.locator("[data-rum-status]").textContent())?.trim(), "SDK init failure did not show a message");
  assert(initFailureEndpointState.requests.length === 0, "SDK init failure still attempted OTLP export");
  assert(!(await initFailureContext.cookies()).some((cookie) => cookie.name === sessionCookieName), "SDK init failure left a RUM cookie");
  await initFailureContext.close();

  const optOutContext = await browser.newContext();
  await optOutContext.addCookies([{
    name: "__rum_optout",
    value: "2026-07-10",
    url: `${smokeUrl.origin}/`,
    sameSite: "Strict",
  }]);
  const optOutPage = await optOutContext.newPage();
  const optOutEndpointState = await installOtlpInterceptor(optOutPage);
  await optOutPage.addInitScript(() => {
    localStorage.setItem("tue-browser-observability-consent-2026-07-10", JSON.stringify({
      state: "granted",
      version: "2026-07-10",
      decidedAt: new Date().toISOString(),
    }));
  });
  await optOutPage.goto(smokeUrl.href, { waitUntil: "networkidle", timeout: 30000 });
  assert(await optOutPage.locator("[data-rum-settings]").isVisible(), "Opt-out did not resolve to the denied settings state");
  assert(optOutEndpointState.requests.length === 0, "Local grant overrode the first-party opt-out fallback");
  assert(!(await optOutContext.cookies()).some((cookie) => cookie.name === sessionCookieName), "Opt-out priority still created a RUM cookie");
  await optOutContext.close();

  console.log(JSON.stringify({
    ok: true,
    endpoint: endpointOrigin,
    scriptsBeforeConsent: scriptsBeforeConsent.length,
    scriptsAfterConsent: scriptsAfterConsent.length,
    otlpBatches: endpointState.payloads.length,
    spans: spans.length,
    actionSpans: actionSpans.map((span) => span.name),
    serviceVersion: runtimeConfig.version,
    sessionIdShape: "32-hex",
    traceIdShape: "32-hex",
    resourceStimuli: resourceStimuli.requests,
    withdrawalState: decision.state,
    deniedReloadStayedClosed: true,
    failedGrantStayedClosed: true,
    initFailureStayedVisible: true,
    optOutPriority: true,
  }, null, 2));
} finally {
  await browser.close();
}
