---
title: "Après les hacks des services publics, qui doit expliquer ce qui n’a pas été corrigé ?"
locale: "fr"
articleSlug: "cyberattaques-services-publics-france-etats-unis"
translationKey: "cyberattaques-services-publics-france-etats-unis"
publishedAt: "2026-08-31"
label: "Cybersécurité / Services publics"
readTime: "11 min"
excerpt: "DGFiP, Éducation nationale, Urssaf : les incidents récents posent une question qui dépasse la réponse technique. Qui documente le risque, les alertes ignorées et les corrections restées ouvertes ?"
seoTitle: "Cyberattaques des services publics : qui répond des risques ?"
seoDescription: "DGFiP, Éducation, Urssaf : comparaison des mécanismes français et américains qui documentent les risques, les alertes et les corrections cyber."
heroImage: "/blog/cyberattaques-services-publics-france-etats-unis/hero-accountability-france-usa.webp"
heroImageAlt: "Dossiers d’incidents cyber français et américains examinés sur une table de revue"
---

Fin août 2026, trois administrations françaises avaient documenté des accès illégitimes : la DGFiP, l’Éducation nationale et l’Urssaf.

La DGFiP confirme un vol de données. L’Éducation nationale confirme une intrusion et une possible exfiltration de données de personnels, mais continue d’en établir le périmètre. L’Urssaf décrit un accès frauduleux à une API via le compte compromis d’un partenaire habilité.

Les rapprocher ne suffit pas à en faire une seule attaque. Les chemins techniques, les données concernées et les degrés de certitude diffèrent. Ils posent toutefois la même question opérationnelle : une fois l’accès coupé et les personnes averties, quel mécanisme oblige l’organisation à expliquer ce qu’elle savait, quelles corrections restaient ouvertes et qui avait décidé que le risque était acceptable ?

## Trois incidents, trois périmètres

L’[Urssaf explique dans son communiqué](https://www.espacedatapresse.com/fil_datapresse/consultation_cp.jsp?idcp=2906623) qu’un compte partenaire habilité à consulter certaines données de déclaration préalable à l’embauche a été utilisé frauduleusement. Les identifiants de ce compte avaient été volés lors d’une attaque antérieure visant le partenaire.

Les données potentiellement consultées ou extraites concernent 12 millions de salariés embauchés depuis moins de trois ans : nom, prénom, date de naissance, Siret de l’employeur et date d’embauche. Aucun numéro de Sécurité sociale, adresse, téléphone ou compte bancaire n’est annoncé dans ce périmètre. L’Urssaf précise surtout que ses systèmes d’information n’ont pas été compromis. Elle a suspendu l’accès du compte, notifié la CNIL et l’ANSSI, puis déposé plainte.

Le communiqué est horodaté du 19 janvier 2026, même si son corps porte par erreur « 19 janvier 2025 ». Cette anomalie mérite d’être conservée dans les notes, tout comme le mot « potentiellement » devant l’extraction. Une base accessible ne prouve pas que chaque ligne a été copiée.

Dans la nuit du 25 au 26 juillet, l’Éducation nationale a subi un autre scénario. Un compte professionnel usurpé a servi à atteindre un système de formation des personnels. Le [premier bilan du ministère](https://www.education.gouv.fr/incident-de-securite-affectant-les-donnees-de-personnels-de-l-education-nationale-505407) indique que le SOC a donné l’alerte le 26 juillet, que les accès externes ont été suspendus et qu’une cellule de crise a été ouverte.

Des données relatives à des agents ayant travaillé en académie depuis 2001 ont pu être exfiltrées. Pour certains, le système contenait aussi une adresse postale, un téléphone ou un numéro de Sécurité sociale. Il ne contenait alors, selon le ministère, ni données bancaires, ni mots de passe, ni données élèves.

Le 18 août, après la publication en ligne de revendications portant sur des élèves, le ministère a [maintenu cette frontière de preuve](https://www.education.gouv.fr/incident-de-securite-affectant-des-donnees-detenues-par-le-ministere-de-l-education-nationale-505441) : l’enquête continuait pour déterminer la nature et l’étendue exactes des données. Les personnels potentiellement concernés avaient été informés. Les représentants légaux des élèves le seraient si leur exposition était confirmée.

Au moment d’écrire, « données élèves revendiquées » et « données élèves confirmées volées » restent deux phrases différentes.

## Trois chemins passent par une identité autorisée

Les sources officielles consultées ne publient aucune attribution commune pour ces trois incidents. Elles ne permettent donc pas d’établir une campagne coordonnée.

Ils présentent cependant une friction opérationnelle familière : l’attaquant n’arrive pas forcément en cassant une frontière technique depuis Internet. Il emprunte une identité qui possède déjà une raison légitime d’entrer.

Pour l’Urssaf, c’est le compte d’un partenaire autorisé. Pour l’Éducation nationale, un compte professionnel usurpé. Pour la DGFiP, les identifiants d’un agent et d’un tiers habilité.

Cette nuance déplace le travail. Une authentification réussie ne dit plus grand-chose si l’on ne peut pas relier chaque session à son contexte, à son comportement et à ce qu’elle a effectivement lu. Il faut être capable de repérer un volume inhabituel, une navigation impossible pour le métier, un export qui contourne les circuits normaux ou une connexion qui ne ressemble plus à celle du titulaire.

Le contrôle ne s’arrête pas au MFA. Il continue avec le périmètre des habilitations, leur révision, les journaux exploitables, les limites d’extraction et la capacité à couper une session sans attendre de comprendre toute l’attaque.

## À la DGFiP, l’accès avait été vu avant que le vol soit établi

Le dossier DGFiP montre pourquoi une chronologie vaut mieux qu’un chiffre.

Des accès illégitimes ont eu lieu en juin, juillet et août 2026. Ils ont été détectés et interrompus. Mais la DGFiP indique que le vol de données n’avait pas été identifié à ce moment, en raison d’un mode opératoire qui échappait aux circuits normaux. Il a été établi après les revendications des 12 et 13 août.

La [page de suivi de la DGFiP](https://www.impots.gouv.fr/actualite/vol-de-donnees-suite-des-acces-illegitimes-au-systeme-dinformation-de-la-dgfip) précise que les espaces particuliers et professionnels d’impots.gouv.fr, leurs identifiants et leurs mots de passe n’ont pas été compromis. Écrire « impots.gouv.fr a été piraté » efface donc le chemin réel : des comptes habilités ont permis d’atteindre des données à l’intérieur du système.

<figure>
  <img src="/blog/cyberattaques-services-publics-france-etats-unis/dgfip-communique-2026.png" alt="Page officielle de la DGFiP distinguant les accès illégitimes du site impots.gouv.fr et des espaces usagers non compromis" loading="lazy" />
  <figcaption>La page officielle sépare explicitement les accès illégitimes des espaces impots.gouv.fr, déclarés non compromis. Capture du 30 août 2026.</figcaption>
</figure>

Le [premier communiqué](https://presse.economie.gouv.fr/acces-illegitime-au-systeme-dinformation-de-la-direction-generale-des-finances-publiques/) parlait de 678 000 particuliers et professionnels. Les FAQ publiées ensuite décrivent [un peu plus de 350 000 particuliers](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_particuliers.pdf) et [un peu plus de 250 000 professionnels](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_professionnels.pdf). Elles détaillent aussi des contenus de messagerie sécurisée potentiellement consultés pour moins de 250 contribuables et moins de 2 076 professionnels, sans accès aux pièces jointes.

Je n’additionnerais pas ces deux nombres pour fabriquer un nouveau total. La DGFiP ne publie pas assez d’éléments sur les chevauchements et les changements de périmètre pour réconcilier proprement les chiffres.

Un autre incident, découvert le 17 août sur le portail des successions vacantes, concernait une vulnérabilité permettant l’extraction de données publiques. Le placer dans la même ligne de chronologie que les accès de juin à août rendrait les deux enquêtes plus faciles à raconter et plus difficiles à comprendre.

Le point de contrôle utile se situe ailleurs. Quand les premiers accès ont été fermés, quelle hypothèse d’exfiltration a été testée ? Quels logs manquaient ? Qui a conclu que l’incident était contenu ? Qu’est-ce qui a rendu les revendications externes nécessaires pour établir le vol ?

## La France a déjà des responsables désignés

Dire que la France ne sait pas attribuer le risque serait faux.

Dans son [rapport sur la réponse de l’État aux cybermenaces](https://www.ccomptes.fr/sites/default/files/2025-06/20250616-S2025-0602-Reponse-de-l-Etat-aux-cybermenaces-sur-systemes-d%27information-civils.pdf), la Cour des comptes rappelle que l’homologation de sécurité constitue une attestation formelle : les risques résiduels sont connus et maîtrisés. La décision appartient à l’autorité qualifiée pour la sécurité des systèmes d’information, l’AQSSI, donc au responsable métier ou au dirigeant concerné.

Sur le papier, quelqu’un accepte bien le risque.

La Cour décrit aussi les limites du système tel qu’elle l’a observé en 2024 et au début de 2025. Les indicateurs de maturité ministériels sont en grande partie autodéclarés. Ils restent peu reliés aux budgets. La politique de sécurité de 2014 ne prévoyait ni obligation de renouvellement régulier des audits ni sanctions des dirigeants comparables à celles applicables à certains opérateurs régulés. Les responsabilités existent, mais les leviers pour les rendre effectives restent faibles.

Depuis, le gouvernement a annoncé un plan de quarante actions, un suivi trimestriel en cabinet et l’affectation de 5 % du budget numérique de chaque ministère à la cybersécurité à partir de 2027. Après l’incident DGFiP, le Premier ministre a aussi demandé [un audit des systèmes et interfaces](https://www.info.gouv.fr/communique/protection-des-donnees-des-francais-l-etat-poursuit-une-strategie-acceleree-de-securisation), avec des mesures opérationnelles présentées au ministre en septembre.

Je n’ai trouvé aucun engagement à publier cet audit, les désaccords qu’il fera apparaître ou la liste des corrections non financées. C’est précisément là que la comparaison américaine devient intéressante.

## Aux États-Unis, le contrôle fabrique une trace récurrente

Le Federal Information Security Modernization Act, FISMA, impose aux agences fédérales un programme de sécurité fondé sur le risque. Chaque année, l’inspector general de l’agence, ou un auditeur externe indépendant, en [évalue l’efficacité](https://www.gao.gov/cybersecurity/fisma-reports).

<figure>
  <img src="/blog/cyberattaques-services-publics-france-etats-unis/gao-fisma-annual-reporting.png" alt="Page du GAO expliquant l’évaluation annuelle des programmes de sécurité fédéraux imposée par FISMA" loading="lazy" />
  <figcaption>Le GAO décrit une évaluation annuelle par les inspectors general ou un auditeur externe. Capture du 30 août 2026.</figcaption>
</figure>

À côté de cet audit périodique, la CISA peut émettre des Binding Operational Directives. La [BOD 23-01](https://www.cisa.gov/news-events/directives/bod-23-01-improving-asset-visibility-and-vulnerability-detection-federal-networks), par exemple, impose aux agences civiles de l’exécutif fédéral de découvrir leurs actifs et d’énumérer leurs vulnérabilités selon une cadence définie. La CISA suit la conformité et rend compte à plusieurs autorités fédérales.

Le dispositif a des limites. Les directives ne couvrent pas les systèmes de sécurité nationale ni certains systèmes du département de la Défense et du renseignement. Les détails sensibles des audits ne deviennent pas tous publics. Une recommandation peut rester ouverte pendant des années.

Cette dernière faiblesse est d’ailleurs mesurable. La [GAO maintient un suivi public](https://www.gao.gov/cybersecurity) de plus de 4 400 recommandations cyber formulées depuis 2010. En février 2026, plus de 730 n’étaient toujours pas mises en œuvre.

Le registre ne répare pas le système. Il empêche simplement chaque nouveau dirigeant de redécouvrir les mêmes problèmes comme s’ils venaient d’apparaître.

## OPM : l’audit avait déjà écrit une partie de l’histoire

Avant la brèche de 2015 à l’Office of Personnel Management, qui a affecté 21,5 millions de personnes, l’inspector general avait publié son audit FISMA 2014.

Le document constatait que 11 systèmes sur 47 fonctionnaient sans autorisation valide, dont plusieurs systèmes sensibles ou critiques. Il relevait l’absence d’une évaluation du risque à l’échelle de l’agence, d’un registre consolidé et d’une transmission correcte des risques aux responsables de systèmes. Il recommandait d’envisager des sanctions administratives et l’arrêt des systèmes dépourvus d’autorisation.

La réponse de la direction indiquait vouloir remettre les autorisations à niveau tout en évitant l’interruption des missions de l’OPM. Ce n’est pas la preuve qu’elle avait accepté la brèche à venir. Nous ne pouvons pas non plus affirmer que les systèmes compromis faisaient partie des onze.

Mais l’[audit OPM](https://oig.opm.gov/reports/audit/federal-information-security-management-act-audit-fy-2014) laisse une trace datée de l’alerte, de la recommandation et de la réponse managériale. Après l’incident, la [GAO a pu mesurer](https://www.gao.gov/products/gao-17-614) les corrections réellement terminées et celles qui restaient incomplètes.

Cette séquence permet de poser des questions adversariales sans inventer les réponses : qui connaissait l’expiration des autorisations ? Pourquoi les systèmes ont-ils continué à tourner ? Quels besoins opérationnels ont pesé dans l’arbitrage ? Quel calendrier avait été accepté ?

## L’IRS montre aussi les limites du modèle américain

Si ces mécanismes rendaient les agences américaines mieux protégées par construction, le rapport FISMA 2025 de l’IRS devrait être rassurant.

Il ne l’est pas.

Le [TIGTA, l’inspector general de l’administration fiscale](https://www.tigta.gov/sites/default/files/reports/2025-09/2025200037fr.pdf), juge le programme de cybersécurité de l’IRS globalement inefficace. Les fonctions Identify, Protect et Detect n’atteignent pas le niveau attendu. En avril 2025, 1 623 plans d’action correctifs étaient encore actifs. Trois systèmes cloud manquaient dans l’inventaire de référence. Cinquante-trois systèmes manipulant des données personnelles ou fiscales ne disposaient pas de journaux conformes aux exigences fédérales.

Les États-Unis ne gagnent donc pas cette comparaison sur le nombre d’incidents évités. Leur propre appareil de contrôle publie les preuves du contraire.

Il produit en revanche un dossier qui survit au communiqué de crise : une évaluation annuelle, des constats attribués, une réponse de la direction, des recommandations datées et un état de mise en œuvre. Ce dossier peut être incomplet, expurgé, ignoré ou politiquement instrumentalisé. Il reste disponible pour comparer ce qui avait été promis avec ce qui a été fait.

Pour les incidents français de 2026, les premières réponses techniques sont visibles : comptes révoqués, accès suspendus, notifications, plaintes, audits et renforcement annoncé. La prochaine étape utile serait de rendre visible le même chaînage avant la prochaine crise : le risque identifié, son propriétaire, la correction décidée, le budget accordé ou refusé, l’échéance, puis la preuve que le contrôle fonctionne réellement.

Sinon, la prochaine chronologie commencera encore par une date d’intrusion, puis sautera directement au jour où quelqu’un a revendiqué les données. Entre les deux, la décision qui a laissé le système exposé restera dans un dossier que le public ne peut pas interroger.

## Sources

- [DGFiP — Vol de données suite à des accès illégitimes](https://www.impots.gouv.fr/actualite/vol-de-donnees-suite-des-acces-illegitimes-au-systeme-dinformation-de-la-dgfip)
- [DGFiP — Communiqué initial sur les accès illégitimes](https://presse.economie.gouv.fr/acces-illegitime-au-systeme-dinformation-de-la-direction-generale-des-finances-publiques/)
- [DGFiP — FAQ particuliers, 24 août 2026](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_particuliers.pdf)
- [DGFiP — FAQ professionnels, 24 août 2026](https://www.impots.gouv.fr/sites/default/files/media/2_actu/2026-08_acces_illegitime_donnees/faq_acces_illegitime_donnes_fiscales_professionnels.pdf)
- [Éducation nationale — Communication initiale, 31 juillet 2026](https://www.education.gouv.fr/incident-de-securite-affectant-les-donnees-de-personnels-de-l-education-nationale-505407)
- [Éducation nationale — Mise à jour, 18 août 2026](https://www.education.gouv.fr/incident-de-securite-affectant-des-donnees-detenues-par-le-ministere-de-l-education-nationale-505441)
- [Acoss/Urssaf — Accès frauduleux à l’API DPAE](https://www.espacedatapresse.com/fil_datapresse/consultation_cp.jsp?idcp=2906623)
- [Gouvernement — Stratégie accélérée de sécurisation, 17 août 2026](https://www.info.gouv.fr/communique/protection-des-donnees-des-francais-l-etat-poursuit-une-strategie-acceleree-de-securisation)
- [Cour des comptes — Réponse de l’État aux cybermenaces visant les SI civils](https://www.ccomptes.fr/sites/default/files/2025-06/20250616-S2025-0602-Reponse-de-l-Etat-aux-cybermenaces-sur-systemes-d%27information-civils.pdf)
- [GAO — FISMA Reports](https://www.gao.gov/cybersecurity/fisma-reports)
- [CISA — Binding Operational Directive 23-01](https://www.cisa.gov/news-events/directives/bod-23-01-improving-asset-visibility-and-vulnerability-detection-federal-networks)
- [OPM OIG — FY2014 FISMA Audit](https://oig.opm.gov/reports/audit/federal-information-security-management-act-audit-fy-2014)
- [GAO — OPM Actions Needed to Address Recommendations](https://www.gao.gov/products/gao-17-614)
- [TIGTA — IRS FY2025 FISMA Evaluation](https://www.tigta.gov/sites/default/files/reports/2025-09/2025200037fr.pdf)
- [GAO — Federal cybersecurity overview](https://www.gao.gov/cybersecurity)
