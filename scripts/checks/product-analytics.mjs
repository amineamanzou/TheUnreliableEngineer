import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const modeArg = process.argv.find((argument) => argument.startsWith("--mode="));
const mode = modeArg?.split("=", 2)[1] ?? "off";
if (!new Set(["off", "on"]).has(mode)) throw new Error(`Unsupported product analytics check mode: ${mode}`);

const root = process.cwd();
const dist = path.join(root, "dist");

async function filesUnder(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(async (entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? filesUnder(fullPath) : [fullPath];
  }))).flat();
}

const files = await filesUnder(dist);
const textFiles = files.filter((file) => /\.(?:html|js|css)$/.test(file));
const rows = await Promise.all(textFiles.map(async (file) => ({
  file: path.relative(dist, file),
  content: await readFile(file, "utf8"),
})));
const html = rows.filter((row) => row.file.endsWith(".html"));
const js = rows.filter((row) => row.file.endsWith(".js"));
const all = rows.map((row) => row.content).join("\n");
const applicationJs = js.filter((row) => !row.file.includes("module.no-external")).map((row) => row.content).join("\n");
const privacySource = await readFile(path.join(root, "src/components/PrivacyPage.astro"), "utf8");
const deployWorkflow = await readFile(path.join(root, ".github/workflows/deploy-production.yml"), "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countOccurrences(content, value) {
  if (value === "") return 0;
  return content.split(value).length - 1;
}

if (mode === "off") {
  for (const marker of ["data-analytics-consent", "eu.i.posthog.com", "phc_"]) {
    assert(!all.includes(marker), `Product analytics marker present in off build: ${marker}`);
  }
} else {
  assert(html.some((row) => row.content.includes("data-analytics-consent")), "Consent UI is missing from enabled build");
  assert(html.some((row) => row.content.includes("data-page-type=\"article\"")), "Article page type is missing");
  assert(html.some((row) => row.content.includes("data-page-type=\"home\"")), "Home page type is missing");
  const offerPages = [
    ["offres/bilan-positionnement-freelance/index.html", "positioning_review", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub", "Réserver un appel de cadrage"],
    ["en/offers/freelance-positioning-review/index.html", "positioning_review", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1Rytny_Yre1wqvKXrSGN_RYY0tREhg1hLmzpKEX8m10n6R3KuWu8bC04wH68DVLp9ZnTJD2Sub", "Book an intro call"],
    ["offres/suivi-progression-tech/index.html", "tech_progression", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG", "Planifier le premier échange"],
    ["en/offers/tech-progression-follow-up/index.html", "tech_progression", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0NZJrE96yGmfPFONgZzpAQv0CUuGIqDK2qzuy8g25PULTwAMHJTLu-ZT1Ke_mkXsIt5EjSWYAG", "Schedule the first conversation"],
    ["offres/etude-de-cas-tech/index.html", "tech_case_study", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5", "Proposer mon étude de cas"],
    ["en/offers/tech-case-study/index.html", "tech_case_study", "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ3B5zabC1lnStSQv7F1_0yShTT7d3Pkduw76XFOksfUSpF_f9QRNcfLdHIYMaZbCso9B4uNq-f5", "Propose a case study"],
  ];
  for (const [file, offerId, bookingUrl, bookingLabel] of offerPages) {
    const page = html.find((row) => row.file === file);
    assert(page?.content.includes('data-page-type="offer"'), `Offer page type is missing from ${file}`);
    assert(page?.content.includes(`data-analytics-offer-id="${offerId}"`), `Offer ID ${offerId} is missing from ${file}`);
    assert((page?.content.match(/data-analytics-cta-id="book_offer"/g) ?? []).length === 2, `Both offer booking CTAs are required in ${file}`);
    assert(page?.content.includes('data-analytics-placement="offer_hero"'), `Offer hero placement is missing from ${file}`);
    assert(page?.content.includes('data-analytics-placement="offer_closing"'), `Offer closing placement is missing from ${file}`);
    assert(!page?.content.includes('data-analytics-cta-id="contact_offer"'), `Historical contact_offer CTA must not be emitted by ${file}`);
    assert(countOccurrences(page?.content ?? "", bookingUrl) === 2, `Exact Calendar URL is required on both CTAs in ${file}`);
    assert(countOccurrences(page?.content ?? "", bookingLabel) >= 2, `Exact booking label is required on both CTAs in ${file}`);
  }
  assert(applicationJs.includes("1.2.0"), "Analytics schema version 1.2.0 is missing from the application bundle");
  assert(html.every((row) => !row.content.includes("module.no-external")), "PostHog SDK chunk is statically referenced by HTML");
  assert(js.some((row) => row.file.includes("module.no-external")), "Dynamic PostHog SDK chunk was not emitted");
  for (const required of [
    "autocapture:!1",
    "capture_pageview:!1",
    "disable_session_recording:!0",
    "person_profiles:`never`",
    "advanced_disable_flags:!0",
  ]) {
    assert(applicationJs.includes(required), `Hardened PostHog option missing from application bundle: ${required}`);
  }
  for (const forbidden of [
    "business.lead_created",
    "business.lead_qualified",
    "business.opportunity_proposed",
    "business.opportunity_declined",
    "business.meeting_booked",
    "business.engagement_won",
  ]) {
    assert(!all.includes(forbidden), `Browser bundle contains forbidden business event: ${forbidden}`);
  }
  for (const required of [
    "Un clic vers une page de réservation n’est jamais compté comme un lead ou un rendez-vous.",
    "A click to a booking page is never counted as a lead or a meeting.",
    "ils ne prouvent pas qu’une campagne a causé une conversion.",
    "they do not prove that a campaign caused a conversion.",
    "ce plafond n’est pas encore vérifié comme une règle techniquement appliquée",
    "this limit has not yet been verified as a technically enforced rule",
    "admin@itart.studio",
  ]) {
    assert(privacySource.includes(required), `Product analytics governance notice is missing: ${required}`);
  }
  assert(deployWorkflow.includes("if: github.event_name == 'push' || inputs.product_analytics"), "Production pushes must verify the enabled product analytics contract");
  assert(deployWorkflow.includes("(github.event_name == 'push' || inputs.product_analytics) && 'true' || 'false'"), "Production pushes must keep product analytics enabled while manual dispatch remains the rollback switch");
}

console.log(JSON.stringify({ ok: true, mode, files: textFiles.length }, null, 2));
