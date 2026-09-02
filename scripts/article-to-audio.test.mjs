import assert from "node:assert/strict";
import test from "node:test";

import { articleMarkdownToSpeech } from "./article-to-audio.mjs";

test("converts an article to speech without editorial metadata or source URLs", () => {
  const source = `---
title: "Un test audio"
locale: "fr"
publishedAt: "2026-09-02"
---

Une [documentation utile](https://example.com/doc) explique le mécanisme.[1]

## Une section

![Schéma](./schema.png)

<figure>
  <img src="capture.png" alt="Capture" />
  <figcaption>Une capture officielle.</figcaption>
</figure>

\`\`\`yaml
secret: valeur
\`\`\`

- Première conséquence
- Deuxième conséquence

## Sources

- [Document primaire](https://example.com/source)
`;

  assert.equal(
    articleMarkdownToSpeech(source),
    [
      "Un test audio",
      "Une documentation utile explique le mécanisme.",
      "Une section",
      "Première conséquence.",
      "Deuxième conséquence.",
    ].join("\n\n"),
  );
});

test("keeps ordinary bracketed text while removing numeric note markers", () => {
  const source = `---
title: "Compteurs"
---

La file contient [des éléments] et atteint sa limite.[7]
`;

  assert.equal(
    articleMarkdownToSpeech(source),
    "Compteurs\n\nLa file contient [des éléments] et atteint sa limite.",
  );
});
