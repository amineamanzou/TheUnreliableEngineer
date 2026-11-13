---
title: "My agent memory: what deserves to survive a conversation"
locale: "en"
articleSlug: "memoire-agent-conversation-en"
translationKey: "memoire-agent-conversation"
publishedAt: "2026-12-17"
label: "Experiments / SRE"
readTime: "4 min"
excerpt: "I correct a working rule in one conversation and repeat it in the next. The second time is mildly annoying. When several projects depend on the same rule, I mostly start wondering which version each agent is following."
seoTitle: "My agent memory: what deserves to survive a conversation"
seoDescription: "I correct a working rule in one conversation and repeat it in the next. The second time is mildly annoying. When several projects depend on the same rule, "
heroImageAlt: "My agent memory: what deserves to survive a conversation"
---

I correct a working rule in one conversation and repeat it in the next. The second time is mildly annoying. When several projects depend on the same rule, I mostly start wondering which version each agent is following.

That friction is how I approach agent memory. I want a durable decision to remain available without preserving every exchange as another truth. In my usage, an explicit preference, a verified outcome or an operating rule can change the next decision. An abandoned draft and an agent’s assumption do not carry the same weight.

### A correction needs to replace a rule

Dependency merging provides a simple example. I specified that PRs with passing qualified checks and tests should merge automatically. Keeping an older formulation that asks for my agreement every time would bring back exactly the burden I wanted to remove.

I therefore want to find the rule’s source, its scope and what replaces it. An instruction for a pilot does not authorize every operation on every project. An infrastructure exception must not turn into a general rule for applications.

### Retrieving a fact does not make it current

Memory can return an old decision, uncertain information or a local observation awaiting synchronization. Those states need to remain visible. If an agent turns every retrieved result into a current fact, I gain apparent context and lose the ability to assess its reliability.

The same caution applies to people and meetings. A suggested name in a transcript is not a confirmed identity. And a sensitive note does not become publishable because it has become easy to search.

### I want to correct without rereading everything

My practical goal remains modest: state a decision once, recover why it exists and be able to correct it. I need a system that distinguishes what I said from what an agent inferred, then limits what it puts back into context.

I am not measuring a diagnostic-reliability gain or a reduction in working time here. I am setting out the agreement I expect from memory. The useful test will come when I resume a project: will the agent find the applicable rule, its source and any exception without asking me to tell the entire story again?
