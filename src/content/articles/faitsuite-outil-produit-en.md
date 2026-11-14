---
title: "FaitSuite: taking my own tool toward a product other people would use"
locale: "en"
articleSlug: "faitsuite-outil-produit-en"
translationKey: "faitsuite-outil-produit"
publishedAt: "2026-11-19"
label: "Experiments / SRE"
readTime: "5 min"
excerpt: "From audio sent to my Mac to analyzing decisions and commitments: how FaitSuite evolved, and the practical need guiding what comes next."
seoTitle: "FaitSuite: taking my own tool toward a product other people would use"
seoDescription: "From audio sent to my Mac to analyzing decisions and commitments: how FaitSuite evolved, and the practical need guiding what comes next."
heroImageAlt: "FaitSuite: taking my own tool toward a product other people would use"
---

At first, I sent a meeting's audio to my Mac using AirDrop. I wanted to find what had been said without listening to the entire recording again. A file, a transcript and processing on my machine: that fairly simple path covered the initial use.

I have been working on this project for several months. It was called Meeting Memory; I now call it FaitSuite. Between the two names, the need grew. Having a transcript saved me from starting with the audio again. I still had to find a decision, understand a commitment and work out what I had promised to do myself.

That evolution is what interests me when I look at the product. I can still spend time on its screens, but the reason to keep developing it lies in making use of meetings afterwards.

### From a file on my Mac to context I want to recover

I started with my own usage, then moved the audio pipeline to my NAS. That change let me work on the next question: what do I do with the transcript once it exists?

A summary helps me pick up a meeting's thread. When I return to a subject a few days later, I often need something more specific. Who committed to what? Which decision was made? What is still a proposal? And what did I agree to do in that conversation?

Those questions guided the work on agentic analysis, using the material produced by audio processing. I want to extract information that remains useful after the meeting while keeping a link to what was actually said. A neatly written action attributed to the wrong person creates extra work for me. I need to return to the supporting passage and correct the interpretation.

This also changes how I think about memory. A meeting adds context to a person, a project or a discussion that has already started. If everything stays inside a separate summary for each file, I have to make the connections myself whenever I resume the work.

### Understanding who is speaking, then what that implies

I became interested in separating voices and using voice samples to recover who speaks when. When extracting commitments, that attribution matters as much as the transcribed words. “I'll take care of it” is not a usable action until we know who “I” refers to.

That involves distinct steps. Separating two voices does not automatically establish their identities. A name suggested by context still needs verification; a voice profile needs validation before it can be used as a reference. I would rather leave an attribution unconfirmed than circulate a commitment with a name that merely looks certain.

I have also explored sentiment analysis and worked on statistics. These are ways of better understanding conversations, with limits: a measurement or interpretation does not remove the need to read the passage. I mainly want them to help ask a useful question about a meeting rather than add indicators simply because I can calculate them.

The thread connecting this work is practical: recover what was decided, what others promised and what I promised, with enough context to act on it.

### Private mode is part of the product's value

Meetings can contain information we have no desire to send to another service. I have therefore given the fully private path an important place, with local models processing that data. Confidentiality has influenced how the product is built along that path, beyond choosing an option in settings.

Ethics also affects what we accept as an inference. Sentiment analysis remains an interpretation of a conversation; I do not want it to acquire the status of a fact about a person. The same principle applies to an identity, a promise or a decision: we need to understand where the information came from and be able to challenge it.

For somebody using FaitSuite, value will depend on that trust too. Finding an action quickly helps only if I can verify that it matches the meeting and if its processing respects the expected confidentiality.

### Opening the product to other uses

I then worked on a Cloud version. A team's needs add another dimension: several people might want to share the context of the same meetings and recover it in their work. That shared context is still work to be built; I am not presenting it as a feature available today.

This is where my personal tool starts raising product questions. Does somebody arriving with their own meetings need the same information as I do? Do they mainly need to find a decision, follow their commitments or prepare the next conversation? Under what conditions would they accept that information being processed and shared?

Agentic analysis is where I want to focus FaitSuite's differentiation: helping people use what a meeting contains beyond its transcript and summary. I still need to confront that proposition with other people's usage. How they recover a promise, verify an attribution or protect context will tell me what to build next.
