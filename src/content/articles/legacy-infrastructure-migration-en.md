---
title: "The infrastructure still works, but nobody dares to touch it"
locale: "en"
articleSlug: "legacy-infrastructure-migration"
translationKey: "legacy-infrastructure-migration"
publishedAt: "2026-08-17"
label: "Technical debt / Migration"
readTime: "8 min"
excerpt: "A ten-euro server, forgotten services, uncertain backups and WordPress kept by inertia: how to regain control of legacy infrastructure without breaking it first."
seoTitle: "Legacy infrastructure: migrate without breaking it"
seoDescription: "Inventory, restored backups, dependencies, IaC and rollback: a practical method for regaining control of legacy infrastructure without breaking production."
heroImage: "/blog/legacy-infrastructure-migration/hero.jpg"
heroImageAlt: "The Unreliable Engineer preparing a methodical migration from a server covered in legacy dependencies"
---

I had a server costing around ten euros per month that was still doing its job.

It hosted my website, observability experiments, services added over several years and some old-school mail experiments with Dovecot. Permissions had been separated to limit the damage if one of those experiments was compromised. On paper, it was not an absolute disaster.

In practice, I kept postponing the moment when I would look at the whole thing.

The server answered. WordPress ran. The databases existed somewhere. The backups probably had a story to tell. Every week without an outage made the infrastructure slightly harder to change.

Systems like this survive through an unpleasant property: nobody wants to be the person who discovers the forgotten production dependency.

## “It works” is a poor description of system state

Infrastructure can serve requests correctly while already being fragile.

The fragility appears elsewhere:

- nobody can list every service;
- startup order lives in shell history;
- a backup exists, but restoration has not been replayed;
- a cron job calls an undocumented path;
- a certificate renews through a forgotten script;
- a database shares the machine with several experiments;
- DNS, server provisioning and deployment each use a different method;
- the last person who understands one component avoids taking a holiday.

Monitoring can remain green throughout this period.

It confirms that the system answers now. It does not automatically measure our ability to rebuild, modify or restore it.

I prefer another set of questions:

- How long does it take to find what is running?
- Which change can be tested without touching production?
- Can the data be restored elsewhere?
- Where are the secrets?
- What is the rollback path?
- Who can explain the sequence without opening fifteen terminals?

Those answers describe operability better than the month’s availability number.

## Start by changing nothing

My first pass was deliberately read-only.

Before modernizing, I needed an inventory of:

- systemd services;
- containers;
- listening ports;
- reverse proxy configuration;
- cron jobs;
- databases and volumes;
- certificates;
- DNS;
- network rules;
- directories containing data;
- backup mechanisms;
- repositories and deployment scripts.

An AI agent helped with that work. It could explore configuration, connect names, find a service referenced in several places and prepare documentation.

I had no intention of giving it an instruction such as “clean up the server.”

From a machine’s perspective, cleanup may include deleting the old directory that happens to contain the only copy of some data. The agent received a narrower job: observe, propose an inventory, flag uncertainty and prepare verification commands.

Judgment remained human, especially when a command could modify state.

## A backup that has not been restored remains a hypothesis

The migration starts in earnest when the data can survive the current machine.

I separated three questions:

1. Which data needs to be preserved?
2. How is it copied?
3. Can it be restored in a different environment?

An archive completing without error answers the second question. It does not answer the third.

Restoration needs to verify format, permissions, versions, required secrets and actual recovery time. It may also reveal that the backup depends on a binary installed only on the original server. That kind of detail gives an incident night quite a lot of personality.

I wanted a recovery point before transforming the infrastructure.

## Make dependencies visible

The old server mixed several eras.

One component had been installed cleanly. Another came from an experiment. A third existed because a service needed it two years earlier. Each component was manageable in isolation. The missing map between them caused the risk.

I rebuilt the migration around observable dependencies:

`DNS → reverse proxy → service → database or volume → backup → monitoring`

Every path needed an owner, configuration, secret, test and rollback.

That map prevents a familiar modernization outcome: replacing an old machine with a more expensive one that contains exactly the same uncertainty.

## The target environment must be replayable

The new environment moved to Hetzner.

The monthly cost increased. In return, domain names and infrastructure are now described as Infrastructure as Code, components are deployed with Ansible, and the WordPress exit can move forward as an explicit project.

The useful test was no longer “does the server exist?”

I wanted to know whether I could:

- recreate the infrastructure from the repository;
- redeploy a component without hidden memory;
- trace a configuration to its source;
- distinguish a secret from a public value;
- verify a backup;
- remove the old path after an observation period.

IaC does not guarantee good architecture. It provides a review surface, history and a way to replay what was decided.

## Migrate one path at a time

The original server still worked, which allowed a progressive move:

1. prepare the target;
2. restore a copy of the data;
3. run the service on a test address;
4. compare behavior;
5. lower DNS TTL where needed;
6. switch one path;
7. observe;
8. keep the old service available for a defined window;
9. remove the old component when rollback is no longer useful.

This sequence looks slower than a complete cutover.

It mainly avoids discovering every dependency at the same time.

The plan also needs stopping conditions. More errors, a missing certificate, inconsistent data or an unverified backup blocks the next step. Without explicit criteria, “we are monitoring” easily becomes “we are hoping.”

## What the agent actually changed

The project took about a day and a half of distributed work without constant attention at the screen.

The agent mainly reduced the cost of getting started. It helped read configuration, produce the inventory, prepare IaC files, review Ansible tasks and keep decisions in artifacts.

The [security boundary described in the coding-agent article](/en/blog/ai-agent-machine-access/) still applied. A tool capable of reading infrastructure and running commands deserves a limited account, clear approvals, verified backups and an audit trail.

Automation made the system intellectually approachable. It did not turn a risky migration into a magic button.

## Debt decreases when the next person can act

The most important change was not the provider.

It was the ability to answer simple questions without archaeology:

- what is running?
- where is the configuration?
- how do we restore?
- how do we redeploy?
- which component can be removed?
- what happens if the target fails?

Legacy infrastructure becomes dangerous when day-to-day operation depends on changing nothing.

The exit begins by building enough evidence to touch the system without moving blindly: inventory, restored backup, dependencies, replayable environment, progressive cutover and rollback.

The server that still works is precisely what gives us time to do that work properly.

To propose a real infrastructure case for analysis: [Tech case study](/en/offers/tech-case-study/).
