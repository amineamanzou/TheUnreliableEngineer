---
title: "“Will AI replace developers?” is too lazy a question"
locale: "en"
articleSlug: "ia-remplacer-developpeurs-taches"
translationKey: "ai-replace-developers-tasks"
publishedAt: "2026-09-21"
label: "AI / Work"
readTime: "8 min"
excerpt: "Studies measure tasks, pull requests and cycle time. A job still combines responsibility, context and decisions."
seoTitle: "Will AI replace developers? Measure the tasks"
seoDescription: "Use studies, limitations and workflow evidence to assess AI’s impact on development tasks without turning local gains into job predictions."
heroImage: "/blog/ia-remplacer-developpeurs-taches/hero-task-allocation.svg"
heroImageAlt: "A development workflow split across generation, review, integration, production and accountability"
---

In July 2025, METR published an experiment that disrupted the prevailing story. Sixteen experienced developers worked on 246 tasks in open-source projects they had known for years. Tasks were randomly assigned to one of two conditions: AI tools allowed or disallowed. Within that setting, using early-2025 AI made developers take roughly 19% longer.

In February 2026, [METR published an update](https://metr.org/blog/2026-02-24-uplift-update/). Raw follow-up results appeared to point toward acceleration, but the organization declined to produce a firm estimate. Some developers no longer wanted to participate if they had to work without AI. Others used several agents in parallel, making time spent harder to measure. The tools had changed. Practice had changed. The protocol itself was starting to break under the behavior it was designed to observe.

That sequence is more useful than asking developers whether AI will “replace” them. It reveals four objects the debate constantly mixes together: a task, an amount of code produced, a change delivered, and a job.

### A completed task is not a job

The 2025 METR experiment involved experienced maintainers, mature repositories, and real tasks. That is a strength. It is also a clearly documented limitation in the [research paper](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf). The result does not say that a junior developer, an enterprise product team, or a developer building a prototype will see the same effect. It does not say that 2026 tools have the same performance as those tested between February and June 2025.

A development task has a beginning and an end. A job combines tasks, accountability, relationships, and decisions. Writing a function, explaining a module, preparing a test, and migrating an API can be partially automated. Deciding whether the migration is worth its cost, negotiating a cutover with another team, understanding why a regulatory constraint exists, and taking the pager after deployment belong to the same work without arriving as a clean prompt.

Predicting replacement from a coding benchmark is like estimating restaurant staffing by timing vegetable chopping. The measurement may be correct while the model of the work remains incomplete.

### More code moves the bottleneck

The [2025 DORA report](https://dora.dev/research/2025/dora-report/) draws on almost 5,000 technology professionals and more than 100 hours of qualitative data. DORA observes a positive relationship between AI adoption, delivery throughput, and product performance. The same report still finds a negative relationship with delivery stability.

Two comfortable readings should be avoided. One turns correlation into proof that AI automatically creates value. The other uses it to claim that generated code necessarily harms production. DORA describes a system: automated testing, rapid feedback, architecture, internal platforms, and workflow clarity all change the observed effect.

When generation accelerates, the bottleneck may leave code authoring. It moves into review, integration, testing, change comprehension, dependency management, or deployment. A team can close more tickets while creating more work for the people able to verify cross-system effects. Output rises. The system’s absorption capacity becomes the constraint.

Google’s summary of DORA puts the mechanism plainly: AI amplifies existing strengths and weaknesses. A team with small changes, reliable tests, and fast feedback can use the acceleration. A tightly coupled team with slow approvals mainly receives more changes to push through the same pipe.

### Developers already use the tool without handing it accountability

The [2025 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2025/ai) shows a striking gap. Use or intended use is very high, while 46% of respondents actively distrust AI output accuracy, compared with 33% who trust it. The most experienced developers are even more cautious.

This is self-reported data, not observed performance. It still describes an existing division of labor: use a fast output, then retain responsibility for checking it. Verification does not end when the code compiles. It moves toward business invariants, data, permissions, failure modes, and operations.

The management risk is counting only the time saved during initial production. If an agent creates a pull request in ten minutes and a senior engineer spends an hour reconstructing its intent, the system did not save fifty minutes. It moved part of the cost to a scarcer person. If that hour avoids three hours of manual typing, the result may still be excellent. Measure the full chain to find out.

### Usage data describes tasks, not layoffs

The [Anthropic Economic Index study on software development](https://www.anthropic.com/research/impact-software-development) analyzed 500,000 coding-related interactions on Claude.ai and Claude Code. The researchers distinguish augmentation from automation and map the tasks involved. A later [January 2026 edition](https://www.anthropic.com/research/economic-index-primitives) reports that computer-related tasks account for roughly a third of Claude.ai conversations and close to half of the studied API traffic.

These figures come from a vendor and describe its own user population. They establish software development as a major field of adoption. They cannot calculate how many jobs will disappear. An interaction classified as automation may cover two minutes in a six-month project. A task supported by AI may become more common once it is cheaper. Work volume is not fixed.

“Developer” adds another approximation. A startup frontend developer, a kernel maintainer, a mainframe engineer in a bank, an SRE, and a lead spending half the week coordinating may share a broad title. Their exposure to the same capabilities varies enormously.

### Measure the team where the change becomes real

A useful enterprise experiment starts with a delivery flow and compares periods or cohorts. At minimum, record active and waiting time, change size, rework, defects found after review, incidents, senior review time, and the user outcome. Also record the work delegated to AI: explanation, generation, migration, testing, investigation, or decision support.

The comparison needs a stable definition of “done.” A patch proposed by an agent is an output. A reviewed patch is further along. A change running safely in production and solving the intended user problem is the delivered outcome. Mixing these states will make the fastest tool look best because it is credited at the earliest checkpoint. It will also hide abandoned suggestions and changes reverted after deployment. A small sample with a clean boundary is more informative than a company-wide adoption percentage attached to several incompatible workflows.

Keep the model version and tool configuration too, because the measured intervention can change materially between two observation periods.

This instrumentation avoids two illusions. The first is perceived speed: an answer arrives in seconds and makes the work feel almost complete. The second is volume: more lines, more pull requests, and more closed tickets resemble progress even when time to user value stays flat.

Different teams will reach different decisions. Train developers to decompose and verify tasks. Strengthen tests and ephemeral environments. Reserve agents for mechanical migrations. Add threat review on sensitive paths. Or prevent autonomy in an area where nobody can yet explain the effect of a change.

The replacement question jumps straight to headcount. Available evidence mostly describes movement in tasks, bottlenecks, and accountability. Organizations will probably change roles, hiring, and expectations. The pace and direction will differ with the systems they operate.

An agent can produce more changes than a team knows how to examine. In that situation, the scarce capacity is no longer typing. It belongs to the person who can decide which change should exist, prove it fits the system, and remain reachable when production answers differently from the demo.

## Sources

- [METR — Early-2025 randomized study](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf)
- [METR — 2026 experiment-design update](https://metr.org/blog/2026-02-24-uplift-update/)
- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)
- [Google Cloud — announcement and key findings for DORA 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [Stack Overflow — 2025 Developer Survey, AI section](https://survey.stackoverflow.co/2025/ai)
- [Anthropic Economic Index — software development](https://www.anthropic.com/research/impact-software-development)
- [Anthropic Economic Index — economic primitives, January 2026](https://www.anthropic.com/research/economic-index-primitives)
