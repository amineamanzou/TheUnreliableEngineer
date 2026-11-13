---
title: "FaitSuite: taking my own tool toward a product other people would use"
locale: "en"
articleSlug: "faitsuite-outil-produit-en"
translationKey: "faitsuite-outil-produit"
publishedAt: "2026-11-19"
label: "Experiments / SRE"
readTime: "4 min"
excerpt: "A meeting ends. The recording exists, but the decision I will need in two weeks is still somewhere inside it. That is the friction I want to address with FaitSuite, the project I previously called Meeting Memory."
seoTitle: "FaitSuite: taking my own tool toward a product other people would use"
seoDescription: "A meeting ends. The recording exists, but the decision I will need in two weeks is still somewhere inside it. That is the friction I want to address with F"
heroImageAlt: "FaitSuite: taking my own tool toward a product other people would use"
---

A meeting ends. The recording exists, but the decision I will need in two weeks is still somewhere inside it. That is the friction I want to address with FaitSuite, the project I previously called Meeting Memory.

I start from a need I understand: recording meetings, finding them again and using what was said. As soon as I prepare the application for somebody else, the questions change. Where do meetings appear on an iPhone? What does a private library mean? Which screen explains what has actually been processed? A button available in my setup does not make the journey obvious.

### The product appears between two screens

One example came up while working on the iOS application. The Record view emphasized recent recordings, while I wanted to find meetings. I chose a Meetings page with a Record button. That looks like a small decision. It puts the object I am looking for at the center of the journey instead of the mechanism that produces it.

The Statistics view raised another question with a private library: what should the application show when meetings already exist? A message asking the person to connect a library does not answer that need. I keep this example as a journey problem; this article is not an announcement that every correction is available in every version.

### My shortcut becomes somebody else’s support problem

On my machine, I know which processing step ran and where to look when a result is missing. Somebody discovering the product needs to understand its state from the application. I have to show what is ready, what is waiting and what failed, without asking them to reconstruct my reasoning.

I also want to preserve the privacy boundary. A private mode must keep its meaning when the system processes a sensitive recording. Adding an external service for development convenience can change the agreement the user thought they had chosen.

These constraints make some demonstrations less spectacular. They also give me a more precise way to decide what to finish before opening access: a usable journey, an understandable state and an explicit data boundary.

I am preparing FaitSuite to move beyond my personal use. This article does not yet provide evidence that an audience will return every week or agree to pay. That is the next unknown to test, once the journey is clear enough for somebody to actually try it.
