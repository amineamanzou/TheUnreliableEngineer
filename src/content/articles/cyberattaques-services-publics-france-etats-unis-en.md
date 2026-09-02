---
title: "After public-service hacks, who has to explain what was never fixed?"
locale: "en"
articleSlug: "cyberattacks-public-services-france-united-states"
translationKey: "cyberattaques-services-publics-france-etats-unis"
publishedAt: "2026-08-31"
label: "Cybersecurity / Public services"
readTime: "11 min"
excerpt: "Recent incidents at France’s tax authority, education ministry and social-contribution agency raise a question beyond incident response: who documents the known risk and the fixes left open?"
seoTitle: "Public-service cyberattacks: who owns the risk?"
seoDescription: "France’s recent public-sector incidents compared with the US mechanisms that record known cyber risks, overdue fixes and management decisions."
heroImage: "/blog/cyberattaques-services-publics-france-etats-unis/hero-accountability-france-usa.webp"
heroImageAlt: "French and US public-sector cyber incident files laid out for review"
---

By late August 2026, three French public bodies had documented unlawful access: the DGFiP tax authority, the education ministry and the Urssaf social-contribution agency.

The DGFiP has confirmed data theft. The education ministry has confirmed an intrusion and possible exfiltration of staff data, while it continues to establish the scope. Urssaf has documented fraudulent access to an API through a compromised account belonging to an authorized partner.

Putting them next to one another does not turn them into one attack. Their technical paths, affected data and levels of certainty differ. They do raise the same operational question: once access has been cut off and affected people have been notified, what mechanism forces the organization to explain what it knew, which fixes were still open, and who had decided the remaining risk was acceptable?

## Three incidents, three scopes

In its [incident statement](https://www.espacedatapresse.com/fil_datapresse/consultation_cp.jsp?idcp=2906623), Urssaf says an authorized partner account was used to access data from the system that processes pre-employment declarations. The account credentials had been stolen in an earlier attack against that partner.

Data potentially viewed or extracted covered 12 million employees hired during the previous three years: first and last name, date of birth, the employer’s Siret business identifier and the hiring date. Urssaf said the affected data did not include social-security numbers, addresses, phone numbers or bank details. It also said its own information systems had not been compromised. The agency suspended the account, notified the CNIL data-protection authority and ANSSI, and filed a criminal complaint.

The release is timestamped January 19, 2026, although its body says “January 19, 2025,” apparently in error. That inconsistency belongs in the research notes, just as the word “potentially” belongs in front of “extracted.” An accessible database does not prove every row was copied.

The education ministry faced a different sequence overnight on July 25–26. An impersonated professional account was used to reach a staff-training system. According to the ministry’s [initial account](https://www.education.gouv.fr/incident-de-securite-affectant-les-donnees-de-personnels-de-l-education-nationale-505407), the security operations center raised an alert on July 26, external access was suspended and a crisis unit was activated.

Information about staff who had worked for regional education authorities since 2001 may have been exfiltrated. For some people, the system also held a postal address, phone number or social-security number. The ministry said at the time that this system held no bank details, passwords or student data.

On August 18, after online claims involving student records appeared, the ministry [kept the evidence boundary intact](https://www.education.gouv.fr/incident-de-securite-affectant-des-donnees-detenues-par-le-ministere-de-l-education-nationale-505441). It was still investigating the exact nature and extent of the data involved. Potentially affected staff had been notified. Parents or guardians would be notified if exposure of student data was confirmed.

At the time of writing, “student data claimed by an attacker” and “student data confirmed stolen” remain two different sentences.

## Three routes through an authorized identity

The official sources reviewed publish no common attribution for the three confirmed incidents. They do not establish a coordinated campaign.

They do share a familiar operational problem. The attacker does not necessarily arrive by breaking a technical boundary from the Internet. They use an identity that already has a legitimate reason to be inside.

At Urssaf, it was an authorized partner account. At the education ministry, an impersonated professional account. At the DGFiP, credentials belonging to one employee and one authorized third party.

That distinction moves the work elsewhere. A successful login means little unless the organization can connect each session to its context, behavior and actual reads. It needs to detect volumes that do not fit the job, navigation that makes no sense for the role, exports that bypass ordinary workflows or a connection that no longer resembles the account owner.

The control does not end with MFA. It continues through entitlement scope, access reviews, usable logs, extraction limits and the ability to terminate a session before the whole intrusion has been reconstructed.

## At the DGFiP, access was seen before the theft was established

The DGFiP case shows why a timeline is more informative than a victim count.

Unlawful access occurred in June, July and August 2026. It was detected and stopped. But the DGFiP says the data theft itself was not identified at the time because the attacker’s methods bypassed the normal channels. The theft was established after claims made on August 12 and 13.

The tax authority’s [incident page](https://www.impots.gouv.fr/actualite/vol-de-donnees-suite-des-acces-illegitimes-au-systeme-dinformation-de-la-dgfip) states that personal and business accounts on impots.gouv.fr, including their usernames and passwords, were not compromised. “The tax website was hacked” removes the path that matters: authorized accounts provided access to data inside the system.

<figure>
  <img src="/blog/cyberattaques-services-publics-france-etats-unis/dgfip-communique-2026.png" alt="The official DGFiP page separating unauthorized access from uncompromised impots.gouv.fr user accounts" loading="lazy" />
  <figcaption>The official page explicitly separates the unauthorized access from impots.gouv.fr user spaces, which it says were not compromised. Captured August 30, 2026.</figcaption>
</figure>

The [initial announcement](https://presse.economie.gouv.fr/acces-illegitime-au-systeme-dinformation-de-la-direction-generale-des-finances-publiques/) covered 678,000 individuals and businesses. Later FAQs describe [slightly more than 350,000 individuals](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_particuliers.pdf) and [slightly more than 250,000 businesses](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_professionnels.pdf). They also say secure-message contents may have been viewed for fewer than 250 taxpayers and fewer than 2,076 businesses, while attachments were not accessed.

I would not add the two updated figures and present the result as a new total. The DGFiP has not published enough about overlaps and scope changes to reconcile those numbers safely.

A separate vulnerability found on August 17 affected the vacant-estates portal and allowed extraction of public information. Merging it into the June-to-August unauthorized-access timeline makes both investigations easier to narrate and harder to understand.

The useful control question sits elsewhere. When the first sessions were terminated, which exfiltration hypotheses were tested? Which logs were unavailable? Who concluded that the incident was contained? Why did an external claim become necessary to establish that data had left?

## France already assigns an owner to residual risk

It would be inaccurate to say that France has no mechanism for assigning cyber risk.

In its [report on the French state’s response to cyber threats](https://www.ccomptes.fr/sites/default/files/2025-06/20250616-S2025-0602-Reponse-de-l-Etat-aux-cybermenaces-sur-systemes-d%27information-civils.pdf), the Cour des comptes explains what security authorization means. It is a formal statement that residual risks are known and under control. The decision belongs to the authority responsible for information-systems security, generally the relevant business owner or executive.

On paper, someone does accept the risk.

The same report describes the limits observed during 2024 and early 2025. Ministry maturity indicators were largely self-reported and poorly connected to budgets. The 2014 security policy did not require regular renewal audits. Nor did it provide sanctions for leaders comparable with those applying to some regulated critical operators. Responsibility existed, but the levers for making it effective were weak.

The French government has since announced a forty-action plan, quarterly cabinet monitoring and a requirement to direct 5% of each ministry’s digital budget to cybersecurity from 2027. Following the DGFiP incident, the prime minister also ordered [an audit of its systems and interfaces](https://www.info.gouv.fr/communique/protection-des-donnees-des-francais-l-etat-poursuit-une-strategie-acceleree-de-securisation), with operational measures to be presented to the minister in September.

I found no commitment to publish the audit, the disagreements it uncovers or the list of corrections that did not receive funding. This is where the US comparison becomes useful.

## US oversight creates a recurring record

The Federal Information Security Modernization Act requires federal agencies to maintain risk-based security programs. Every year, each agency’s inspector general or an independent external auditor [evaluates the program’s effectiveness](https://www.gao.gov/cybersecurity/fisma-reports).

<figure>
  <img src="/blog/cyberattaques-services-publics-france-etats-unis/gao-fisma-annual-reporting.png" alt="GAO page explaining FISMA annual assessments of federal information-security programs" loading="lazy" />
  <figcaption>The GAO describes annual assessments by inspectors general or an external auditor. Captured August 30, 2026.</figcaption>
</figure>

Alongside those recurring audits, CISA can issue Binding Operational Directives. [BOD 23-01](https://www.cisa.gov/news-events/directives/bod-23-01-improving-asset-visibility-and-vulnerability-detection-federal-networks), for example, requires civilian executive-branch agencies to discover assets and enumerate vulnerabilities at a defined cadence. CISA monitors compliance and reports to several federal authorities.

The mechanism has boundaries. These directives do not cover national-security systems or some Department of Defense and intelligence systems. Sensitive audit detail does not all become public. A recommendation can remain open for years.

That final weakness is measurable. The [Government Accountability Office maintains a public ledger](https://www.gao.gov/cybersecurity) covering more than 4,400 cybersecurity recommendations made since 2010. More than 730 were still unimplemented in February 2026.

The ledger does not repair a system. It prevents each incoming executive from rediscovering the same weaknesses as if they had just appeared.

## At OPM, the audit had already written part of the story

Before the 2015 breach at the Office of Personnel Management affected 21.5 million people, the agency’s inspector general had published its fiscal-year 2014 FISMA audit.

It found that 11 of OPM’s 47 systems were operating without a valid authorization, including several sensitive or critical systems. It found no agency-wide risk assessment, consolidated risk register or adequate process for communicating risk to system owners. It recommended considering administrative sanctions and shutting down systems that lacked authorization.

Management responded that it intended to restore the authorizations while ensuring there would be no interruption to OPM’s missions and operations. That response is not proof that management knowingly accepted the future breach. The public record also does not establish that the breached systems were among those eleven.

What the [OPM audit](https://oig.opm.gov/reports/audit/federal-information-security-management-act-audit-fy-2014) does provide is a dated record of the warning, the recommendation and the management response. After the breach, the [GAO could measure](https://www.gao.gov/products/gao-17-614) which corrective actions had been completed and which remained unfinished.

That sequence supports adversarial questions without fabricating answers. Who knew the authorizations had expired? Why did the systems continue to operate? Which mission requirements shaped the decision? What remediation schedule had management accepted?

## The IRS also shows the limits of the US model

If these mechanisms made US agencies secure by design, the IRS’s 2025 FISMA report should be reassuring.

It is not.

[TIGTA, the tax administration inspector general](https://www.tigta.gov/sites/default/files/reports/2025-09/2025200037fr.pdf), rated the IRS cybersecurity program ineffective overall. The Identify, Protect and Detect functions did not meet the required maturity level. In April 2025, the agency still had 1,623 active corrective-action plans. Three cloud systems were absent from its authoritative inventory. Fifty-three systems containing taxpayer or personally identifiable information lacked audit logs that met federal requirements.

The United States does not win this comparison on incidents prevented. Its own oversight machinery publishes evidence to the contrary.

What that machinery does produce is a record that outlives the crisis statement: an annual assessment, attributed findings, a management response, dated recommendations and an implementation status. That record may be incomplete, redacted, ignored or politically weaponized. It remains available to compare what was promised with what was done.

For France’s 2026 incidents, the first technical responses are visible: accounts revoked, access suspended, regulators notified, complaints filed, audits ordered and stronger controls announced. The useful next step would be to expose the same chain before the next incident: the risk that was identified, its owner, the chosen remediation, the budget granted or refused, the deadline and evidence that the control actually works.

Otherwise, the next timeline will once again begin with an intrusion date and jump to the day someone claims to hold the data. The decision that kept the system exposed will remain somewhere in between, inside a file the public cannot question.

## Sources

- [DGFiP — Data theft following unlawful access](https://www.impots.gouv.fr/actualite/vol-de-donnees-suite-des-acces-illegitimes-au-systeme-dinformation-de-la-dgfip)
- [DGFiP — Initial statement on unlawful access](https://presse.economie.gouv.fr/acces-illegitime-au-systeme-dinformation-de-la-direction-generale-des-finances-publiques/)
- [DGFiP — FAQ for individuals, August 24, 2026](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_particuliers.pdf)
- [DGFiP — FAQ for businesses, August 24, 2026](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_professionnels.pdf)
- [French education ministry — Initial statement, July 31, 2026](https://www.education.gouv.fr/incident-de-securite-affectant-les-donnees-de-personnels-de-l-education-nationale-505407)
- [French education ministry — Update, August 18, 2026](https://www.education.gouv.fr/incident-de-securite-affectant-des-donnees-detenues-par-le-ministere-de-l-education-nationale-505441)
- [Acoss/Urssaf — Fraudulent access to the DPAE API](https://www.espacedatapresse.com/fil_datapresse/consultation_cp.jsp?idcp=2906623)
- [French government — Accelerated security strategy, August 17, 2026](https://www.info.gouv.fr/communique/protection-des-donnees-des-francais-l-etat-poursuit-une-strategie-acceleree-de-securisation)
- [Cour des comptes — The French state’s response to threats against civilian information systems](https://www.ccomptes.fr/sites/default/files/2025-06/20250616-S2025-0602-Reponse-de-l-Etat-aux-cybermenaces-sur-systemes-d%27information-civils.pdf)
- [GAO — FISMA Reports](https://www.gao.gov/cybersecurity/fisma-reports)
- [CISA — Binding Operational Directive 23-01](https://www.cisa.gov/news-events/directives/bod-23-01-improving-asset-visibility-and-vulnerability-detection-federal-networks)
- [OPM OIG — FY2014 FISMA Audit](https://oig.opm.gov/reports/audit/federal-information-security-management-act-audit-fy-2014)
- [GAO — OPM Actions Needed to Address Recommendations](https://www.gao.gov/products/gao-17-614)
- [TIGTA — IRS FY2025 FISMA Evaluation](https://www.tigta.gov/sites/default/files/reports/2025-09/2025200037fr.pdf)
- [GAO — Federal cybersecurity overview](https://www.gao.gov/cybersecurity)
