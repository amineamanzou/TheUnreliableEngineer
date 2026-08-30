---
title: "A project drifts while every status indicator stays green"
locale: "en"
articleSlug: "projet-derive-voyants-verts"
translationKey: "project-drift-green-status"
publishedAt: "2026-09-28"
label: "Delivery / Project"
readTime: "8 min"
excerpt: "Closed tickets, stable velocity and green milestones can hide aging decisions, ownerless interfaces and an outcome moving away."
seoTitle: "When a green project is already drifting"
seoDescription: "Why green milestones, velocity and ticket counts can hide project drift, and which signals help recover the real trajectory."
heroImage: "/blog/projet-derive-voyants-verts/hero-green-status-drift.svg"
heroImageAlt: "An entirely green project dashboard while the actual trajectory moves away from its objective"
---

A weekly status report can be entirely honest and still mislead everyone. The API team completed its planned tickets. The data team is within budget. Security received the documents it needs to review. The supplier reports delivery against its own schedule. Every row stays green under its local definition.

Meanwhile, no user can complete the full journey. The interface contract keeps changing. The access-control decision has been waiting for three weeks. The launch date has moved, but each team believes the delay sits somewhere else.

The dashboard does not have to lie to create a false conclusion. It only has to add local health indicators together and call the result “project health.”

### A color is always the output of a rule

Green may mean “less than 10% late,” “no declared blocker,” “within the monthly budget,” or “the team still believes it can recover the date.” Until the rule is visible, the color carries more confidence than information.

Thresholds create a cliff as well. A work package remains green at nine days late and turns red on day ten, as if the risk appeared overnight. A team trying to avoid escalation can split the work, move the deadline, or classify the blocker as an external dependency. The reporting system then rewards color stability.

The [GAO Agile Assessment Guide](https://www.gao.gov/assets/gao-20-590g.pdf) recommends designing performance measures with the attributes of a successful metric and connecting them to objectives. That sounds administrative, but it asks a practical question: what decision becomes possible when this number moves? If the answer is only “the steering committee will request an explanation,” the indicator monitors the presentation more than the project.

### Activity stays green long after trajectory is lost

Closed tickets, consumed points, held meetings, and completed documents prove that a team is working. They do not prove the system is getting closer to real use.

The [GOV.UK Service Manual](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service) starts with service purpose and user needs, then defines hypotheses before selecting data. That order prevents teams from choosing only the data that is already easy to collect. It also recommends combining metrics with user research.

Projects often drift between those levels. Backlog activity advances while the product hypothesis remains untested. An integration is marked complete because code was merged, although nobody has run the journey with realistic data. A migration reports 80% of tables converted, while the remaining 20% contain the cases blocking cutover. A security policy is written, while enforcement waits for someone to identify the accountable owners.

The percentage hides the shape of the remaining work. The last ten units may have very little in common with the first ninety.

### Interfaces have no owner in the status report

Every team can meet its local commitments and still miss the shared delivery. API contracts, data quality, access rights, supplier timing, and rollback procedures live between columns. They often appear under “dependencies,” a convenient name for work that slows the project without reducing any team’s velocity.

Drift then produces observable signals:

- open decisions keep aging;
- the same issue returns to three committees;
- milestone definitions change;
- end-to-end tests move beyond the declared “completion” of components;
- the announced date relies on conditions nobody has verified;
- completed work does not reduce the main risk.

These signals do not require a sophisticated score. They require a timeline and an owner. A decision blocked for 21 days deserves more attention than twelve subtasks closed yesterday.

### Projects need black-box monitoring too

The [Google SRE chapter on monitoring distributed systems](https://sre.google/sre-book/monitoring-distributed-systems/) separates black-box and white-box monitoring. White-box signals expose the inside: logs, queues, state, and components. Black-box signals observe the symptom from outside: does the service work correctly for the user?

The project parallel is direct. Tickets, budgets, and capacity plans are internal signals. A usable journey, a successful migration, a customer completing the operation, or a regulatory decision actually being enforced are external signals.

Google also notes that in layered systems, one person’s symptom is another person’s cause. A slow database is a symptom for the database team and a cause for the frontend team. In a project, an unstable API is an incoming risk for one group and an “almost finished” output for another. The consolidated report loses that relationship when it retains only the final color.

The [2025 DORA report](https://dora.dev/research/2025/dora-report/) reaches a compatible conclusion: simple delivery metrics are insufficient to explain performance. DORA connects outcomes to user centricity, internal platform quality, workflow clarity, and the team’s ability to absorb change. A project can accelerate activity while damaging stability, or preserve local metrics while missing product performance.

### Review the gap before the color

A useful project review can fit into six questions. They do not replace the plan; they check whether the plan still describes the work.

1. Which journey or outcome can be demonstrated today with realistic data?
2. Which critical assumption remains untested?
3. What is the oldest open decision, and who can make it?
4. Which dependency changed since the last review?
5. Which completed work would need to be redone if that dependency fails?
6. Which date moved, even if the milestone kept its name?

Answers should point to artifacts: a demo, decision log, end-to-end test, roadmap history, interface contract, or user measure. “We are confident” can remain in the conversation. It should not become evidence.

This review also makes uncertainty legitimate. An amber status with a named decision and a test date can be healthier than a green status resting on an unknown dependency. The objective is not to make the dashboard red. It is to expose the place where a decision can still alter the trajectory.

### Measure aging, not only volume

Three simple measures make drift more visible: the age of open decisions, the time since the last successful end-to-end test, and the difference between the planned date and the date the team can currently defend. They share a useful flaw: they age on their own. The team has to act or explain why it accepts the gap.

Add the amount of work waiting between teams and the share of the flow covered by a user-level test. These figures remain imperfect, but they describe movement and interfaces, the two things component dashboards tend to flatten.

A decision log makes these measures usable. It should record the question, the options considered, the person accountable, the evidence still missing, and the date after which waiting becomes a decision in its own right. This is less polished than another portfolio score, but it gives the next review something concrete to inspect. It also prevents a common rewrite of history where a constraint described as temporary in June becomes an accepted architectural fact in September without anyone explicitly choosing it.

When the constraint changes, the log also reveals which earlier estimates and completed components must now be revisited.

The final report can keep its colors if the organization needs them. Each color should carry its rule, its artifact, and the decision expected. Green with no decision means the work is within agreed tolerance. Green that still depends on three arbitrations, an exception, and a test nobody has run describes a project that has simply learned to present its drift correctly.

## Sources

- [GOV.UK Service Manual — setting performance metrics](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service)
- [U.S. GAO — Agile Assessment Guide](https://www.gao.gov/assets/gao-20-590g.pdf)
- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)
