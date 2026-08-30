---
title: "How a small dependency becomes an incident everyone can see"
locale: "en"
articleSlug: "petite-dependance-grand-incident"
translationKey: "small-dependency-large-incident"
publishedAt: "2026-09-14"
label: "Incident / Dependencies"
readTime: "8 min"
excerpt: "A dependency stays small in the inventory until its failure crosses products, teams and user journeys."
seoTitle: "How a small dependency becomes a large incident"
seoDescription: "Use postmortems, dependency graphs and observability to understand how one small component spreads failure across a platform."
heroImage: "/blog/petite-dependance-grand-incident/hero-blast-radius.svg"
heroImageAlt: "A small component spreading failure across several services and user journeys"
---

In late March 2024, Andres Freund was not looking for a backdoor. He was investigating why SSH connections took roughly half a second longer than expected and why `valgrind` reported strange behavior. The investigation moved through the process, into `libsystemd`, and eventually reached `liblzma`, the compression library provided by XZ Utils.

That path is uncomfortable. `sshd` had not added an XZ compression feature. On some distributions, OpenSSH was linked to `libsystemd`, which in turn depended on `liblzma`. A library several layers down could therefore run code inside the process accepting remote connections.

In his [original oss-security report](https://www.openwall.com/lists/oss-security/2024/03/29/4), Freund carefully separates what he observed from what he had not fully analyzed. He describes XZ versions 5.6.0 and 5.6.1, an obfuscated build script, and test files used to inject code. He also lists conditions under which he could reproduce the slowdown. That restraint explains the incident better than saying “a dependency hacked Linux.”

### Propagation does not follow the org chart

An architecture slide might show a client connecting to `sshd`, followed by the authentication flow. The graph loaded into memory is more revealing:

`sshd` → `libsystemd` → `liblzma` → code from the compromised XZ package.

The complete path contains more steps. A source archive is published. A build system activates specific conditions. A distribution builds a package. A machine installs that version. The dynamic loader assembles libraries when the process starts. A decision inside a compression project ends up in a network security process.

[Red Hat tracked the issue as CVE-2024-3094](https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users) and told users of affected development versions to stop using them and revert. Scope matters: the attack depended on specific versions and environments, and it was detected before those releases reached most stable distributions. Potential impact was enormous. Observed spread remained far more limited.

The gap between potential reach and actual propagation is the first incident-response job. “Do we use XZ?” is not enough. Ask which version, built by whom, from which artifact, on which assets, loaded by which processes, and exposed to which users.

### “Small” describes the space a dependency occupies in our attention

XZ Utils compresses and decompresses data. It is a narrow, mature, expected function, exactly the kind of component a team installs once and forgets. It does not need to appear in the user interface to be present almost everywhere.

Repository size, maintainer count, and lines of code do not define blast radius. A compact library on a common execution path can reach thousands of machines. A much larger service isolated behind a rarely used interface may remain contained.

There is a human dependency as well. A critical component may be maintained by very few people, receive constant demands, and feed distributions far wealthier than the project itself. That dimension already prevents us from reducing the software supply chain to a version list.

A dependency tree shows what imports what. It may not show who can publish a release, modify the pipeline, sign an artifact, change a compiler option, or pressure a maintainer. Those are edges in the same risk graph.

### An inventory answers the first minute, not the final one

When an alert lands, a lockfile helps. Software composition analysis helps. An SBOM helps. [CISA defines an SBOM as a nested, machine-readable inventory of components and their relationships](https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf). Versions, suppliers, and dependencies can quickly narrow the set of assets requiring investigation.

CISA also states that an SBOM does not solve every supply-chain problem. XZ makes that limit easy to see. The inventory may show that an XZ version is installed. It still has to connect that fact to the machines actually running, the deployed container image, the loaded binary, and the service exposure. A file generated during CI and stored in a bucket cannot provide that answer on its own.

Vulnerability scanners have another limit: they require a known signal. Between the release of a malicious artifact and the assignment of a CVE, a component may appear to have no known vulnerabilities. A clean scan then means only that the consulted database does not contain the story yet.

[OpenSSF Scorecard](https://openssf.org/projects/scorecard/) automates checks on open-source project posture, including branch protection, update practices, release practices, and other risk signals. It is useful for prioritization. A score cannot certify the absence of a patient attacker, a compromised build, or an artifact that differs from the repository being assessed.

### The signal that saves an investigation may look like noise

XZ did not begin with an alert labeled “SSH takeover attempt.” It began with latency and incoherent process behavior. Detection worked because someone knew the system well enough to treat those symptoms as abnormal and kept moving down the stack.

The lesson is not to alert on every extra half-second. That would be a very efficient noise generator. The lesson is that supply-chain defense needs signals at several layers: artifact integrity, build provenance, dependency changes, process behavior, and user-visible symptoms.

These controls complement one another. Provenance lets a team compare what was built with what should have been built. An SBOM helps locate the component. Telemetry reveals unexpected process behavior. Asset inventory identifies who must act. Rollback capability reduces the time spent arguing in front of a red status board.

This also changes how dependency updates should be reviewed. The visible diff may contain a single version number, while the operational change includes a new archive, new build scripts, a different signer, altered transitive packages, and new code paths inside long-running processes. Review effort should follow the reachable behavior and blast radius, not the number of changed lines. A minor update on a common authentication path deserves more evidence than a larger change inside an isolated development tool. That evidence can include reproducible-build checks, provenance attestations, a diff of the generated SBOM, and a canary observing process behavior before wider rollout.

The review record should remain attached to the artifact so the incident team can recover it without reconstructing the release from chat history.

### A useful incident question crosses the graph

A team can prepare this response without buying another dashboard. Pick one common dependency and run an exercise:

1. find every version present in builds and environments;
2. connect each artifact to its source and build pipeline;
3. identify processes that load the library or call the service;
4. identify user journeys relying on those processes;
5. simulate blocking one version and reverting to the previous one;
6. measure how long it takes to produce a trustworthy asset list.

A possible point of failure is step three. The team knows a package exists but not which binary loads it. Or it knows which containers were built but not which ones are still running. That is where the drawn dependency tree stops being decoration: every unknown edge adds time during the incident.

A small dependency becomes visible to everyone when its path reaches a function everyone uses. Compression reaches SSH. A parser reaches the API. A date library reaches billing. The component’s perceived size never protected the system. What protects the team is the ability to follow the path quickly enough to know where to cut it.

## Sources

- [Andres Freund — original oss-security report](https://www.openwall.com/lists/oss-security/2024/03/29/4)
- [Red Hat — urgent security alert for CVE-2024-3094](https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users)
- [CISA — 2025 Minimum Elements for an SBOM](https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf)
- [CISA — SBOM Resources Library](https://www.cisa.gov/topics/cyber-threats-and-advisories/sbom/sbomresourceslibrary)
- [OpenSSF — Scorecard](https://openssf.org/projects/scorecard/)
