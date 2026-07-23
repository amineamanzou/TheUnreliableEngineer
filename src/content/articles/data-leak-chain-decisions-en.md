---
title: "A data leak is a chain of decisions"
locale: "en"
articleSlug: "data-leak-chain-decisions"
translationKey: "data-leak-chain-decisions"
publishedAt: "2026-08-10"
label: "Incident / Data leak"
readTime: "7 min"
excerpt: "Vercel’s April 2026 incident shows how a third-party tool, a Workspace account, internal access and secret classification turn ordinary decisions into a data leak."
seoTitle: "Data leaks: the chain of decisions behind an incident"
seoDescription: "Vercel’s April 2026 incident shows how OAuth, Workspace, internal access and secret handling turn ordinary decisions into a data leak."
heroImage: "/blog/data-leak-chain-decisions/hero.jpg"
heroImageAlt: "The Unreliable Engineer following the chain of decisions between a third-party tool and exposed secrets"
---

The security bulletin Vercel published in April 2026 begins at another company.

Vercel says the incident originated with the compromise of Context.ai, a third-party AI tool used by an employee. The attacker then took over that person’s individual Google Workspace account, reached their Vercel account, pivoted into an internal environment, and enumerated and decrypted environment variables classified as non-sensitive.

A limited subset of customers was affected. Vercel contacted them and asked them to rotate the relevant credentials.

Read too quickly, the summary becomes: “environment variables leaked.”

Almost everything that could prevent the next incident disappears from view.

## The exposed file arrives at the end

The visible leak is a secret being read, a database being copied or a repository being downloaded.

Before that result, several boundaries were crossed:

1. a third-party tool was authorized in a professional context;
2. its OAuth application obtained access to Google Workspace;
3. the Workspace account provided access to a Vercel account;
4. that account could reach an internal environment;
5. the environment allowed variables to be enumerated;
6. some values that mattered to customers remained readable because they were not marked `Sensitive`.

Each step probably had a local justification.

The tool helps the employee. OAuth removes another password. Workspace centralizes access. The Vercel account simplifies the job. Non-sensitive variables remain readable to make debugging easier.

Together they create a path nobody necessarily drew end to end.

## A third-party tool inherits the value of its connections

SaaS reviews often focus on what users deliberately send to the service.

For an AI tool, teams ask: which conversations are stored? Is code used for training? Where is the data hosted?

Those questions matter. They do not cover the capabilities granted through connections.

Depending on its scopes, an OAuth application may access mail, Drive, calendar, directory data or other Workspace resources. The human account connected to that application may itself be linked to internal tools.

The third-party service becomes part of the identity chain even if it was never purchased as a security product.

A useful inventory must connect:

- the application;
- its OAuth scopes;
- affected users;
- those users’ groups and roles;
- systems available through their identity;
- data readable after entering those systems.

A vendor list describes contracts. It does not describe reach very well.

## The human account often becomes the bridge

In the official account, the attacker does not jump directly from Context.ai to a customer database.

They take over an individual Workspace account and then use the access attached to that identity.

That detail changes the response.

Revoking only the third-party application closes one door. Sessions, tokens, credentials and access obtained after the pivot may continue to work. Vercel explicitly notes that deleting a project or account is not enough: compromised secrets still need to be rotated.

An incident playbook should follow the attacker in the same order:

- revoke the application and its tokens;
- invalidate account sessions;
- inspect Workspace events;
- review Vercel access and activity logs;
- identify variables that were read;
- rotate downstream credentials;
- search for unexpected deployments or actions.

The final rotation depends on the initial timeline. Without usable logs, the team widens the scope for safety and rotates many more secrets.

## “Non-sensitive” does not mean “without consequence”

Vercel distinguishes sensitive variables, whose values cannot be read after creation, from non-sensitive variables that can be decrypted to plaintext.

Some customers had stored API keys, tokens, database credentials or signing keys in the second category. The product allowed it. The incident exposed the cost of that classification.

The trap is in the vocabulary.

A variable may be convenient to display during debugging and still grant access to a critical system. Its sensitivity depends on what it authorizes, not on the field name or the screen containing it.

I would treat a value as secret whenever it can:

- act on a service;
- read non-public data;
- sign or encrypt something;
- deploy;
- impersonate a user or system;
- reach another secret.

That final category is regularly missed. An apparently limited token may open a path to a more powerful tool.

## The chain should be breakable in several places

A sound architecture does not wait for one control to stop everything.

In this incident, several boundaries could have reduced impact:

- narrower OAuth scopes;
- regular review of Workspace applications;
- a separate professional account for experimental tools;
- strong authentication and short sessions;
- Vercel roles limited to the task;
- sensitive variables that remain unreadable after creation;
- short-lived and revocable credentials;
- alerts on unusual enumeration or variable reads;
- credential rotation tested before the incident.

No measure makes the system invulnerable. Each one removes part of the path.

The useful exercise is to ask at every link: if this control fails, what is the next real boundary?

## Keep evidence levels clean

Public accounts added details about the initial compromise, the people involved and a possible sale of data.

The Vercel bulletin does not confirm all of them.

I prefer a shorter, verifiable timeline: Context.ai compromised, OAuth application involved, Workspace account taken over, Vercel access obtained, environment reached, non-sensitive variables read, affected customers notified.

That discipline does not make the incident less serious. It avoids building remediation around a spectacular detail that may be wrong.

The [previous article about coding-agent access](/en/blog/ai-agent-machine-access/) reached a similar conclusion from the developer machine: local reads and outbound capability need to be observed together.

Here, the same reasoning applies to identity. Follow what an account can reach, then what each system allows it to read or use.

## Draw the path before the incident

I would ask a team to select its five most connected SaaS applications and draw, for each one:

`application → scopes → users → roles → systems → secrets → data`

Then test a revocation.

How long does removing the application take? Are sessions invalidated? Can previous actions be found? Which credentials need rotation? Who knows how to do it on a Friday evening?

This diagram looks less urgent than a vulnerability scan.

It becomes very concrete when the tool that helps people work turns into the entry point for the environment holding the secrets.

Sources:

- Vercel, official April 2026 incident bulletin: https://vercel.com/kb/bulletin/vercel-april-2026-security-incident
- Vercel, sensitive environment variables: https://vercel.com/docs/environment-variables/sensitive-environment-variables
- Google Workspace, OAuth application controls: https://support.google.com/a/answer/7281227
