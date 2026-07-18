export type BrowserObservabilityConfig = {
  apiKey: string;
  endpoint: string;
  environment: string;
  service: string;
  site: string;
  version: string;
};

const SAFE_ERROR_NAMES = new Set([
  "Error",
  "EvalError",
  "RangeError",
  "ReferenceError",
  "SyntaxError",
  "TypeError",
  "URIError",
]);

const SAFE_RESOURCE_TYPES = new Set([
  "audio",
  "embed",
  "iframe",
  "img",
  "link",
  "object",
  "script",
  "source",
  "track",
  "video",
]);

let initPromise: Promise<void> | undefined;

function validateConfig(config: BrowserObservabilityConfig): void {
  const missing = Object.entries(config)
    .filter(([, value]) => value.trim() === "")
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Browser observability is enabled but missing: ${missing.join(", ")}`);
  }

  const endpoint = new URL(config.endpoint);
  if (endpoint.protocol !== "https:" && endpoint.hostname !== "localhost" && endpoint.hostname !== "127.0.0.1") {
    throw new Error("Browser observability endpoint must use HTTPS outside local development");
  }
}

function safeRoute(): string {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";

  if (path === "/") return "/";
  if (path === "/en") return "/en/";
  if (path === "/blog") return "/blog/";
  if (path === "/en/blog") return "/en/blog/";
  if (path === "/confidentialite") return "/confidentialite/";
  if (path === "/en/privacy") return "/en/privacy/";
  if (path === "/conditions-utilisation") return "/conditions-utilisation/";
  if (path === "/en/terms") return "/en/terms/";
  if (path === "/suppression-des-donnees") return "/suppression-des-donnees/";
  if (path === "/en/data-deletion") return "/en/data-deletion/";
  if (path === "/offres/bilan-positionnement-freelance") return "/offres/bilan-positionnement-freelance/";
  if (path === "/en/offers/freelance-positioning-review") return "/en/offers/freelance-positioning-review/";
  if (path === "/offres/suivi-progression-tech") return "/offres/suivi-progression-tech/";
  if (path === "/en/offers/tech-progression-follow-up") return "/en/offers/tech-progression-follow-up/";
  if (path === "/offres/etude-de-cas-tech") return "/offres/etude-de-cas-tech/";
  if (path === "/en/offers/tech-case-study") return "/en/offers/tech-case-study/";
  if (/^\/blog\/[^/]+$/.test(path)) return "/blog/:slug/";
  if (/^\/en\/blog\/[^/]+$/.test(path)) return "/en/blog/:slug/";
  return "/other/";
}

function safeErrorName(value: unknown): string {
  if (!(value instanceof Error)) return "UnknownError";
  return SAFE_ERROR_NAMES.has(value.name) ? value.name : "Error";
}

function safeResourceType(target: EventTarget | null): string {
  if (!(target instanceof Element)) return "other";
  const type = target.tagName.toLowerCase();
  return SAFE_RESOURCE_TYPES.has(type) ? type : "other";
}

export function initBrowserObservability(config: BrowserObservabilityConfig): Promise<void> {
  if (initPromise) return initPromise;

  initPromise = (async () => {
    validateConfig(config);

    // This import is intentionally below the consent and runtime validation
    // gates. Loading a page alone must never request the HyperDX SDK chunk.
    const { default: HyperDX } = await import("@hyperdx/browser");

    HyperDX.init({
      advancedNetworkCapture: false,
      apiKey: config.apiKey,
      consoleCapture: false,
      disableIntercom: true,
      disableReplay: true,
      instrumentations: {
        connectivity: false,
        console: false,
        document: true,
        errors: false,
        fetch: false,
        interactions: false,
        longtask: true,
        postload: false,
        socketio: false,
        visibility: false,
        webvitals: true,
        websocket: false,
        xhr: false,
      },
      maskAllInputs: true,
      maskAllText: true,
      recordCanvas: false,
      service: config.service,
      tracePropagationTargets: [],
      tracesUrl: `${config.endpoint.replace(/\/$/, "")}/v1/traces`,
      otelResourceAttributes: {
        "deployment.environment": config.environment,
        "deployment.environment.name": config.environment,
        "service.namespace": "web-frontend",
        "service.version": config.version,
        "site.name": config.site,
        "page.route": safeRoute(),
      },
    });

    window.addEventListener("error", (event) => {
      if (!(event.error instanceof Error)) return;
      HyperDX.addAction("browser.error", {
        "error.type": safeErrorName(event.error),
        "page.route": safeRoute(),
      });
    });

    const handleResourceError = (event: Event) => {
      if (!(event.target instanceof Element)) return;
      HyperDX.addAction("browser.resource.error", {
        "page.route": safeRoute(),
        "resource.type": safeResourceType(event.target),
      });
    };
    document.addEventListener("error", handleResourceError, true);

    window.addEventListener("unhandledrejection", (event) => {
      HyperDX.addAction("browser.unhandledrejection", {
        "error.type": safeErrorName(event.reason),
        "page.route": safeRoute(),
      });
    });
  })().catch((error) => {
    initPromise = undefined;
    throw error;
  });

  return initPromise;
}
