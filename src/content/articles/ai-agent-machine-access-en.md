---
title: "What an AI coding agent can actually read on a developer machine"
locale: "en"
articleSlug: "ai-agent-machine-access"
translationKey: "ai-agent-machine-access"
publishedAt: "2026-08-03"
label: "AI agents / Security"
readTime: "8 min"
excerpt: "Git repository, history, environment variables, keys, browser sessions and network: an agent’s real reach depends less on the model than on the process running it."
seoTitle: "What an AI coding agent can read on your machine"
seoDescription: "Git repos, environment variables, keys and browser sessions: learn what an AI coding agent can access and how to reduce its reach."
heroImage: "/blog/ai-agent-machine-access/hero.jpg"
heroImageAlt: "The Unreliable Engineer mapping an AI agent’s access across a developer machine"
---

In July, researchers did not ask Grok Build what it was sending to xAI.

They inspected the traffic.

On version `0.2.93`, their reproduction shows the tool creating a `git bundle` of the tracked repository, including its history, and sending it to a storage endpoint. The behavior was later disabled server-side. xAI also released Grok Build under the Apache-2.0 license, which means the code can now be inspected instead of inferred from an interface.

That incident is a useful starting point for discussing coding agents. The sensitive surface already extends beyond the file open in the editor.

Agents can reach further because we explicitly ask them to do more.

## The model does not read your disk by itself

A remote model does not wander through `~/Documents` on its own.

A program runs on the machine or in a remote environment. That program exposes tools to the model: file reads, repository search, shell commands, a browser, connectors, MCP servers or network access. Its reach is shaped by three layers:

1. the permissions of the system account running the agent;
2. the tools exposed by the application;
3. the approvals, sandbox and network rules around those tools.

This distinction removes two common shortcuts.

Saying that an agent “sees the whole machine” is often wrong. Saying that it “only sees the current file” can be just as wrong.

Anthropic, for example, documents broader read access outside the working directory for Claude Code while keeping writes more constrained. GitHub limits its coding agent’s Internet access with a firewall, while documenting that the protection does not cover every process or MCP server.

The product name is therefore not enough to describe the boundary. You need its execution model.

## A repository already contains more than visible code

When an agent receives a Git repository, it may encounter:

- current code;
- commit history;
- local branches;
- deleted files still present in history;
- CI/CD configuration;
- internal documentation;
- example environment variables;
- names of services, buckets, accounts and hosts.

The Grok Build case matters here. A `git bundle` is not a screenshot of the file currently being edited. It is a portable Git artifact that can contain repository references and objects.

A secret removed from the latest commit may still exist in history. The same applies to an unfinished migration, an old endpoint or an internal address.

The first useful check is what the repository already reveals before shell access even enters the discussion.

## A shell changes the scale

With a terminal, the agent can run the same commands as its system account, within the sandbox and approval boundaries.

It can inventory files, read configuration, start tests, inspect processes or invoke an already authenticated tool. If `git`, `gh`, `aws`, `gcloud`, `kubectl` or a secret manager works in that terminal without a new login, the agent may inherit part of that context.

An approval prompt reduces accidental actions. It does not make an opaque command safe.

Prompt fatigue appears quickly when every `npm install`, test and out-of-directory read creates another dialog. After the twentieth approval, “always allow” starts looking like an ergonomic improvement.

It is also a threat-model change.

## Credentials take several forms

Developers often think about the `.env` file. Authentication context also lives in:

- variables injected into the process;
- CLI configuration files;
- Git credentials;
- SSH keys;
- SSH agent sockets;
- browser cookies and sessions;
- tokens stored by an extension;
- credentials mounted into a container;
- OAuth connectors and MCP servers.

An agent does not necessarily need the raw value of a key to use it. An authenticated CLI or connector may be enough to perform an action.

Recent systems are starting to keep secrets outside the agent environment. Vercel Sandbox, for example, can inject an authentication header at the network-policy layer: executed code calls the service without receiving the secret itself.

That separation is stronger than an instruction saying “do not read this file.”

## Local reads and outbound access belong in the same review

An agent that can read a repository but cannot communicate externally presents a different risk from one with unrestricted network access.

Conversely, an agent with limited disk access but dozens of OAuth integrations may act far beyond the machine.

The useful pair is:

`what the process can read` × `where it can send or use it`

GitHub explains that its firewall reduces common exfiltration paths, then documents the gaps in its own coverage. That is the right posture: a useful control can remain a partial control.

Dependencies and external instructions belong in the review too. A README, issue, webpage or tool output may contain a malicious instruction. If the agent treats it as a new task, the permissions granted to the process become immediately useful to the attacker.

## The audit I would run before opening a sensitive repository

I would start with a disposable session and a repository containing no real secrets.

Then I would inspect, in this order:

1. **System account.** Which directories can it read? Can it reach a keychain, SSH agent or shared volume?
2. **Working directory.** Does the agent stay inside the repository or move through parent directories?
3. **Commands.** Which ones run without approval? Which “always allow” rules already exist?
4. **Credentials.** Which CLIs, variables and sessions are active in the same environment?
5. **Network.** Is outbound traffic open, blocked or restricted to an allowlist?
6. **Connectors.** Which OAuth scopes and MCP tools are available, and who maintains them?
7. **Audit trail.** Can commands, accessed files, contacted domains and approvals be reviewed later?

I would then run a deliberate test: put a fake sensitive value in a controlled location and check whether it is read, logged or transmitted.

A policy nobody has tried to break remains an intention.

## Start narrow, then expand when the work requires it

For a public repository or lab, a fairly open environment may be an acceptable compromise.

On a consultant’s laptop connected to several clients, the same setup becomes much less entertaining.

I prefer separate contexts: a dedicated account or container, short-lived credentials, one repository per workspace, restricted outbound access and connectors scoped to the task. The setup is slightly less convenient at first. The investigation is much smaller when unexpected behavior appears.

The Grok Build case does not prove that every agent exfiltrates repositories. It proves something more directly actionable: marketing, interface copy and a permission dialog do not fully describe the real data flow.

To find the boundary, inspect the process, permissions and network.

Sources:

- Cereblab, Grok Build 0.2.93 traffic reproduction: https://github.com/cereblab/grok-build-exfil-repro
- Official xAI Grok Build repository: https://github.com/xai-org/grok-build
- Anthropic, Claude Code security: https://docs.anthropic.com/en/docs/claude-code/security
- GitHub, Copilot coding agent firewall: https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-firewall
- Vercel, credential injection in Sandbox: https://vercel.com/changelog/safely-inject-credentials-in-http-headers-with-vercel-sandbox
