import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const mode = process.argv.find((argument) => argument.startsWith("--mode="))?.split("=")[1];
if (mode !== "off" && mode !== "on") {
  throw new Error("Usage: npm run check:browser-observability -- --mode=off|on");
}

const root = process.cwd();
const dist = join(root, "dist");
const source = readFileSync(join(root, "src/scripts/browser-observability.ts"), "utf8");
const component = readFileSync(join(root, "src/components/BrowserObservability.astro"), "utf8");
const privacySource = readFileSync(join(root, "src/components/PrivacyPage.astro"), "utf8");
const dockerfile = readFileSync(join(root, "Dockerfile"), "utf8");
const deployWorkflow = readFileSync(join(root, ".github/workflows/deploy-production.yml"), "utf8");
const ciWorkflow = readFileSync(join(root, ".github/workflows/ci.yml"), "utf8");
const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const lockfile = JSON.parse(readFileSync(join(root, "package-lock.json"), "utf8"));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(packageJson.dependencies?.["@hyperdx/browser"] === "0.24.0", "@hyperdx/browser must be pinned exactly to 0.24.0");
assert(packageJson.overrides?.protobufjs === "7.6.5", "protobufjs security override must be pinned exactly to 7.6.5");
assert(packageJson.overrides?.["@opentelemetry/semantic-conventions"] === "1.42.0", "Semantic conventions must remain on a release older than the 48h gate");
assert(lockfile.packages?.["node_modules/protobufjs"]?.version === "7.6.5", "Lockfile must resolve protobufjs to 7.6.5");
const semanticConventionVersions = Object.entries(lockfile.packages)
  .filter(([path]) => path.endsWith("node_modules/@opentelemetry/semantic-conventions"))
  .map(([, metadata]) => metadata.version);
assert(semanticConventionVersions.length > 0 && semanticConventionVersions.every((version) => version === "1.42.0"), "Every semantic-conventions lockfile instance must resolve to 1.42.0");
assert(source.includes('await import("@hyperdx/browser")'), "HyperDX must stay behind a dynamic import");
assert(source.indexOf("validateConfig(config)") < source.indexOf('await import("@hyperdx/browser")'), "Runtime config must be validated before loading the SDK chunk");
assert(source.includes("if (!(event.error instanceof Error)) return;"), "Runtime error actions must ignore non-Error payloads");
assert(source.includes('"deployment.environment": config.environment'), "Browser resources must carry the deployment environment");

for (const setting of ["disableReplay: true", "disableIntercom: true", "consoleCapture: false", "advancedNetworkCapture: false", "maskAllInputs: true", "maskAllText: true", "recordCanvas: false"]) {
  assert(source.includes(setting), `Missing privacy gate: ${setting}`);
}
for (const instrumentation of ["connectivity", "console", "errors", "fetch", "interactions", "postload", "socketio", "visibility", "websocket", "xhr"]) {
  assert(source.includes(`${instrumentation}: false`), `${instrumentation} instrumentation must be disabled`);
}
for (const instrumentation of ["document", "longtask", "webvitals"]) {
  assert(source.includes(`${instrumentation}: true`), `${instrumentation} instrumentation must be enabled`);
}
for (const action of ["browser.error", "browser.unhandledrejection", "browser.resource.error"]) {
  assert(source.includes(`addAction("${action}"`), `Missing privacy-safe action: ${action}`);
}
for (const route of ["/", "/en/", "/blog/", "/en/blog/", "/confidentialite/", "/en/privacy/", "/blog/:slug/", "/en/blog/:slug/", "/other/"]) {
  assert(source.includes(`"${route}"`), `Closed route vocabulary is missing: ${route}`);
}
for (const forbidden of ["event.message", "event.filename", "window.location.href", "window.location.search", "window.location.hash", "recordException(", "userEmail", "userName", "terminal-command", "blog-terminal-input"]) {
  assert(!source.includes(forbidden), `Forbidden high-risk browser field or API found: ${forbidden}`);
}
for (const gate of ["__rum_sid", "__rum_optout", "15 minutes", "4 hours", "30 days", "browser-public", "ClickStack", "JSON.stringify(decision)", "window.location.reload()"] ) {
  assert(component.includes(gate), `Consent gate is missing: ${gate}`);
}
assert(component.includes('if (readCookie(optOutCookie) === consentVersion) return "denied"'), "Verified opt-out must take priority over local consent");
assert(component.includes('return readConsent() === state'), "Consent writes must be read back before SDK start");
assert(component.includes('if (!writeConsent("granted"))'), "SDK start must stop when grant persistence fails");
assert(component.includes('persisted && readConsent() === "denied"'), "Withdrawal reload requires a verified persisted denial");
assert(component.includes("showSettings();"), "Initialization and persistence failures must leave visible settings");
assert(component.includes("requestAnimationFrame(() => accept?.focus())"), "Initial consent must focus the primary choice");
for (const disclosure of ["aucun corps de requête n’est journalisé", "transitoirement une URL complète", "user-agent", "taille d’écran", "événements techniques", "ingress first-party", "supprime avant stockage dans ClickStack", "request bodies are not logged", "transiently include a complete URL", "screen size", "before ClickStack storage"]) {
  assert(component.includes(disclosure) || privacySource.includes(disclosure), `Privacy disclosure is missing: ${disclosure}`);
}
assert(privacySource.includes("__rum_optout"), "Full privacy notice must document the opt-out fallback");

assert(dockerfile.includes("npm ci && npm audit --omit=dev --audit-level=high"), "Docker build must reject high production dependency vulnerabilities");
assert(dockerfile.includes("COPY scripts ./scripts"), "Docker build must include contract and review scripts");
assert(dockerfile.includes("PUBLIC_BROWSER_OBSERVABILITY_ENABLED=false"), "Docker production build must force Browser RUM off");
assert(!dockerfile.includes("ARG PUBLIC_BROWSER_OBSERVABILITY_ENABLED"), "Docker must not expose a Browser RUM activation argument before the rollout gate");
assert(dockerfile.includes("check:browser-observability -- --mode=off"), "Docker build must run the exact off contract");
assert(dockerfile.includes("npm run review:static"), "Docker build must run the static review");
assert(!deployWorkflow.includes("browser_observability:"), "Production workflow must not expose a Browser RUM activation input");
assert(!deployWorkflow.includes('PUBLIC_BROWSER_OBSERVABILITY_ENABLED: "true"'), "Production workflow must never build enabled Browser RUM");
assert(deployWorkflow.includes('PUBLIC_BROWSER_OBSERVABILITY_ENABLED: "false"'), "Production workflow must explicitly force Browser RUM off");
assert(deployWorkflow.includes("npm audit --omit=dev --audit-level=high"), "Production workflow must reject high dependency vulnerabilities");
assert(deployWorkflow.includes("check:browser-observability -- --mode=off"), "Production workflow must verify the exact off contract");
assert(ciWorkflow.includes('PUBLIC_BROWSER_OBSERVABILITY_ENABLED: "true"'), "CI must retain a non-publishing enabled contract build");
assert(!ciWorkflow.includes("docker/build-push-action"), "Enabled CI contract must not publish an image");

assert(existsSync(join(dist, "index.html")), "Build output is missing; run npm run build first");
const home = readFileSync(join(dist, "index.html"), "utf8");
const privacyFr = readFileSync(join(dist, "confidentialite/index.html"), "utf8");
const privacyEn = readFileSync(join(dist, "en/privacy/index.html"), "utf8");

if (mode === "off") {
  assert(!home.includes("data-rum-consent"), "Ordinary builds must not render the consent surface");
  assert(!home.includes("BrowserObservability.astro"), "Ordinary builds must not load the observability client entry");
  assert(!home.includes("data-open-rum-settings"), "Ordinary builds must not render a dead measurement control");
} else {
  for (const expected of ["data-rum-consent", "the-unreliable-engineer-frontend", "web-frontend", "theunreliable.engineer", "browser-public"]) {
    assert(home.includes(expected) || source.includes(expected), `Enabled build is missing: ${expected}`);
  }
  assert(privacyFr.includes("Confidentialité et mesure de fiabilité"), "French privacy page is missing");
  assert(privacyEn.includes("Privacy and reliability measurement"), "English privacy page is missing");
  assert(privacyFr.includes("data-open-rum-settings"), "Privacy page must expose a persistent consent control");

  const assetsDir = join(dist, "_astro");
  const jsAssets = existsSync(assetsDir) ? readdirSync(assetsDir).filter((file) => file.endsWith(".js")) : [];
  const sdkAssets = jsAssets.filter((file) => readFileSync(join(assetsDir, file), "utf8").includes("OpenTelemetry Session Recorder"));
  assert(sdkAssets.length > 0, "Enabled build must emit a separate HyperDX SDK chunk");
  for (const asset of sdkAssets) {
    assert(!home.includes(`src=\"/_astro/${asset}`), `SDK chunk ${asset} must not load before consent`);
    assert(!home.includes(`href=\"/_astro/${asset}`), `SDK chunk ${asset} must not be preloaded before consent`);
  }
}

console.log(`Browser observability ${mode} contract passed`);
