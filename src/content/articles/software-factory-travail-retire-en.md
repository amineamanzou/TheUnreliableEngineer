---
title: "My software factory: the work it actually takes off my plate"
locale: "en"
articleSlug: "software-factory-travail-retire-en"
translationKey: "software-factory-travail-retire"
publishedAt: "2026-12-10"
label: "Experiments / SRE"
readTime: "4 min"
excerpt: "A dependency PR arrives. Tests are green, but nobody merges it. I ask where it stands, then what blocks it, then whether an agent needs restarting. At that point, my automation has created a small supervision job for me."
seoTitle: "My software factory: the work it actually takes off my plate"
seoDescription: "A dependency PR arrives. Tests are green, but nobody merges it. I ask where it stands, then what blocks it, then whether an agent needs restarting. At that"
heroImageAlt: "My software factory: the work it actually takes off my plate"
---

A dependency PR arrives. Tests are green, but nobody merges it. I ask where it stands, then what blocks it, then whether an agent needs restarting. At that point, my automation has created a small supervision job for me.

That is the friction I am trying to address with my software factory. I work on several projects and want more time for needs, business questions and architecture. Opening sessions, repeating repository rules and moving results to the next stage consumes some of that time.

### Local success still leaves work behind

An agent can produce a correct fix without moving the process forward. The branch has aged, expected checks have changed or a required native test has not run. A useful result needs evidence and a next action; otherwise I reconstruct the context myself.

I asked for continuity between PR monitoring, review and corrections. For dependency updates, my rule is automatic merging when qualified checks and tests are green. When a compromise appears, such as a downgrade needed to address a vulnerability, exposure and compatibility need examination. The color of one badge cannot carry that decision.

### Two corrections, then a discussion

For the pilot, I set two correction cycles before arbitration. This creates a point to examine the problem: is a representative test, a validation recipe or a decision missing? Continuing to spend agent calls without naming that gap would remove the visibility I am looking for.

Independent review comes before declaring a PR ready. When it finds a bug, the feedback must return to the development agent. That handoff also needs durable state; a forgotten conversation should not become the project’s locking mechanism.

### What I count as a gain

I am not giving a productivity percentage here: I have not established a measurement that supports one. I look for signs closer to the work. Do I need to repeat an already authorized technical instruction? Can I understand a blocker without rereading several chats? Does an interruption leave an explicit restart point?

A persistent agent interests me as an entry point into that supervision. For a difficult architecture decision, I still want a dedicated session where we can go deeper. The factory should bring back a result or a precise decision with useful evidence. If it only brings back another list of agents to watch, the work has stayed with me.
