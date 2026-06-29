# Design

## Direction

The homepage should move from a dense comic poster toward a sharper decision dossier for a technical brand: still red, yellow, black, frontal and anti-corporate, but more credible, more readable and more intentional.

The desired impression is an engineer arriving with a marker, cutting through noise and writing the real problem on the board. Less sticker energy. More signal.

## Art Direction Guardrail

The new direction is a clarification and decision dossier, not a stationery theme.

Keep the trust layer dominant:

- dark technical structure;
- strong typography;
- precise proof;
- controlled red/yellow signal;
- compact, legible sections.

Use persona, tags, speech bubbles, heavy shadows and sticker-like devices only where they create meaning, recognition or a useful interruption. They are not the default grammar of every section.

## Visual Theme

- Base: deep black canvas, paper surfaces for reading, red for tension, yellow for action and important annotations.
- Persona: keep the PNG character system as a brand signature, but limit it to high-value narrative moments.
- Frames: keep thick black outlines and offset shadows for major blocks only.
- Rhythm: alternate open dark canvas, focused proof bands, compact reading panels and decisive calls to action.
- Noise control: repeated card grids, repeated uppercase tags and decorative frames must be removed unless they create real scanning value.

## Color

Preserve the current brand tokens:

- `--ink`: `#101010`
- `--paper`: `#fff7e8`
- `--paper-soft`: `#f4dfbd`
- `--accent`: `#d82323`
- `--accent-deep`: `#7f1212`
- `--flannel-red`: `#b91818`
- `--signal`: `#ffd33d`
- `--page-background`: `#191919`

Usage rules:

- Yellow is for primary CTAs, decision markers and "remember this" moments.
- Red is for tension, problem framing and brand recognition.
- Paper is for reading.
- Black is for credibility, contrast and page structure.
- Avoid striped, noisy or repeated patterned backgrounds where they do not carry information.

## Typography

- Keep `Arial Black` / Impact for the brutal display voice.
- Use hero-scale type only for decisive statements: offer, problem, proof and conversion.
- Reduce long all-caps headings when they hurt mobile reading.
- Keep body copy plain, readable and precise.
- Use `text-wrap: balance` on major headings and `text-wrap: pretty` on longer prose.
- Avoid tiny uppercase labels as a repeated section scaffold. Labels must help scanning, not decorate the page.

## First Screen

The first screen must contain, without desktop scrolling at `1512x982`:

- a clear offer phrase: "60 minutes pour clarifier un probleme technique ou strategique";
- a primary audience statement: teams, senior technical profiles and decision-makers dealing with a badly framed problem;
- a credibility statement: SRE, observability, production, large-account contexts;
- a visible primary CTA: "Reserver 60 minutes";
- a quieter secondary CTA: "Voir les preuves".

Recommended composition:

- Left: offer line, H1, audience, credibility, CTAs.
- Right: one persona/decision module, not a collage.
- Near the fold: compact proof rail with Orange, Odigo, Enedis or descriptor-first alternatives, each with context.

## Sections

### Hero / Offer

- Reduce chips to two or three maximum.
- Remove competing bubbles if they repeat the offer.
- Replace "reserver une etude de cas" with the more immediate "Reserver 60 minutes".
- Show what the visitor brings and what they leave with.

### Proof

- Move proof close to the hero.
- Keep logos only when their display status is known.
- Pair each proof with context: telecom production, operational systems, energy-scale information systems, SRE/observability.
- Prefer qualitative proof over invented metrics.

### For Whom

- Keep the primary audience dominant: technical teams and decision-makers with unclear production, reliability, observability or architecture problems.
- Introduce senior/freelance positioning as a secondary use case after proof.
- Avoid a sea of labels; clear sentences beat many tags.

### Format

- Make the method read as a session contract: before, during, after.
- Three steps are enough if four cards dilute the point.
- Do not make the process look like a proprietary miracle method.

### Testimonials

- Keep three testimonials, each supporting a different claim: strategic level, collaboration quality, technical credibility.
- Give quotes enough air to read as proof.
- Avoid over-styled quote cards that compete with the words.

### Closing CTA

- Repeat the exact offer.
- Use one primary action.
- Do not point the final CTA to `#top` in a publishable version. Use a real booking URL or a documented placeholder constant until the real URL exists.

## Proof Rules

Every proof element must have one explicit status:

- approved logo;
- approved named reference;
- descriptor-first reference;
- testimonial quote;
- placeholder.

Do not ship uncertain logos. Pair proof with the claim it supports. Descriptor-first proof is better than pretending anonymity is a logo gap.

## Reduction Rules

Target structure:

1. one hero offer module;
2. one proof rail;
3. one audience/use-case module;
4. one method module;
5. one testimonial proof module;
6. one final CTA.

Remove repeated card grids, repeated uppercase tags and decorative frames unless they improve scanning. A strong reading order is more important than preserving every current visual motif.

## Components

- `Button`: one dominant yellow primary style; quieter secondary style.
- `Panel`: thick framed block for major emphasis only.
- `Tag`: rare metadata or proof label, not section decoration.
- `Proof item`: logo or descriptor, context, supported claim and permission status.
- `Persona frame`: a brand-recognition device, not a filler image slot.
- `CTA panel`: strong red/black close with one action.

## Responsive

Mobile is a compact sales page, not the desktop stacked blindly.

Priorities:

- Offer visible early.
- Primary CTA visible before a large image or long card sequence pushes it away.
- Proof appears before the page becomes a long list of panels.
- Large titles do not wrap into awkward 5-6 line blocks.
- Buttons keep readable text without awkward clipping or overflow.
- No horizontal overflow at `430px` or `390px`.

## Motion

- CSS only unless a small detail justifies otherwise.
- Button hover can move or sharpen shadow.
- No reveal should hide content by default.
- `prefers-reduced-motion` must neutralize non-essential transitions.

## Verification

Required commands:

- `npm run check`
- `npm run build`
- `npm run review:homepage`

Browser review must save desktop and mobile screenshots under `artifacts/review/` and explicitly verify:

- first viewport contains offer, audience, proof and booking action;
- no horizontal overflow;
- no clipped title, CTA or persona block;
- keyboard focus is visible;
- reduced-motion mode leaves content readable.

## Implementation Notes

- Keep Astro static.
- Do not add React.
- Do not add SSR, backend, database or homemade booking logic.
- Keep content in `src/data/homepage.fr.ts` and rendering in `src/pages/index.astro`.
- Use the existing brand token values unless there is a direct readability problem.

