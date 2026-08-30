---
title: "« L’IA va remplacer les développeurs » est une question trop paresseuse"
locale: "fr"
articleSlug: "ia-remplacer-developpeurs-taches"
translationKey: "ai-replace-developers-tasks"
publishedAt: "2026-09-21"
label: "IA / Travail"
readTime: "8 min"
excerpt: "Les études mesurent des tâches, des pull requests et des temps de cycle. Un poste reste un ensemble de responsabilités, de contexte et de décisions."
seoTitle: "L’IA va-t-elle remplacer les développeurs ? Mesurons les tâches"
seoDescription: "Études, limites et terrain : analyser l’effet de l’IA sur les tâches de développement sans transformer un gain local en prédiction d’emploi."
heroImage: "/blog/ia-remplacer-developpeurs-taches/hero-task-allocation.svg"
heroImageAlt: "Un workflow de développement séparé en génération, review, intégration, production et responsabilité"
---

En juillet 2025, METR publie une expérience qui contrarie le récit du moment. Seize développeurs expérimentés travaillent sur 246 tâches dans des projets open source qu’ils connaissent depuis plusieurs années. Les tâches sont réparties aléatoirement entre deux conditions : outils d’IA autorisés ou interdits. Résultat mesuré sur ce périmètre : avec l’IA disponible début 2025, les développeurs prennent environ 19 % de temps en plus.

En février 2026, [METR publie une nouvelle note](https://metr.org/blog/2026-02-24-uplift-update/). Les résultats bruts du suivi semblent aller vers une accélération, mais l’organisation refuse d’en tirer un chiffre solide. Des développeurs ne veulent plus participer s’ils doivent travailler sans IA. D’autres utilisent plusieurs agents en parallèle, ce qui rend le temps passé plus difficile à mesurer. L’outil a changé. Les pratiques ont changé. Le protocole lui-même commence à casser sous le comportement qu’il essaie d’observer.

Cette séquence est plus utile qu’un sondage demandant si l’IA « remplacera » les développeurs. Elle montre quatre objets différents que le débat mélange sans arrêt : une tâche, une quantité de code produite, un changement livré et un emploi.

### Une tâche terminée ne représente pas un poste

L’expérience METR 2025 portait sur des mainteneurs expérimentés, des dépôts matures et des tâches réelles. C’est une force. C’est aussi une limite clairement documentée dans [l’article de recherche](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf). Le résultat ne dit pas qu’un junior, une équipe produit en entreprise ou un développeur construisant un prototype obtient le même effet. Il ne dit pas non plus que les outils de 2026 conservent les performances de ceux testés entre février et juin 2025.

Une tâche de développement possède un début et une fin. Un poste rassemble des tâches, des responsabilités, des relations et des décisions. Écrire une fonction, expliquer un module, préparer un test et migrer une API peuvent être partiellement automatisés. Choisir quelle migration vaut son coût, négocier la coupure avec une autre équipe, comprendre pourquoi une contrainte réglementaire existe et porter l’astreinte après déploiement appartiennent au même travail sans se présenter sous forme d’un prompt propre.

Parler de remplacement à partir d’un benchmark de code revient à estimer le personnel d’un restaurant en chronométrant seulement la découpe des légumes. La mesure peut être exacte et le modèle du travail incomplet.

### Plus de code déplace le goulot d’étranglement

Le [rapport DORA 2025](https://dora.dev/research/2025/dora-report/) s’appuie sur près de 5 000 professionnels et plus de 100 heures de données qualitatives. DORA observe une relation positive entre adoption de l’IA, débit de livraison et performance produit. Le même rapport constate encore une relation négative avec la stabilité de livraison.

Il faut résister à deux lectures confortables. La première transforme cette corrélation en preuve que l’IA augmente automatiquement la valeur. La seconde s’en sert pour annoncer que le code généré dégrade forcément la production. DORA présente un système : tests automatisés, feedback rapide, architecture, plateforme interne et clarté des workflows modifient l’effet observé.

Quand la génération accélère, le goulot d’étranglement peut quitter l’écriture du code. Il arrive dans la revue, l’intégration, les tests, la compréhension du changement, la gestion des dépendances ou le déploiement. Une équipe peut fermer davantage de tickets tout en donnant plus de travail aux personnes capables de vérifier les effets transverses. Le compteur de sorties monte. La capacité d’absorption du système devient la contrainte.

Google formule ce risque très directement dans sa présentation de DORA : l’IA amplifie les forces et les faiblesses déjà présentes. Une équipe avec de petits changements, des tests fiables et des boucles de retour rapides peut utiliser l’accélération. Une équipe au couplage serré et aux validations lentes reçoit surtout davantage de changements à faire traverser dans le même tuyau.

### Les développeurs utilisent déjà l’outil sans lui accorder la responsabilité

Le [Developer Survey 2025 de Stack Overflow](https://survey.stackoverflow.co/2025/ai) montre un écart intéressant. L’usage ou l’intention d’usage est très élevé, tandis que 46 % des répondants disent se méfier activement de l’exactitude des sorties, contre 33 % qui leur font confiance. Chez les développeurs les plus expérimentés, la prudence est encore plus marquée.

Ce sondage mesure des déclarations, pas une performance observée. Il décrit quand même une organisation du travail qui existe déjà : on utilise une sortie rapide, puis on garde la responsabilité de la vérifier. Cette vérification ne disparaît pas parce que le code compile. Elle remonte vers les invariants métier, les données, les permissions, les modes de panne et l’exploitation.

Le risque managérial consiste à compter seulement le temps gagné pendant la production initiale. Si un agent prépare une pull request en dix minutes et qu’un senior passe une heure à reconstituer son intention, le système n’a pas gagné cinquante minutes. Il a déplacé une partie du coût vers une personne plus rare. Si cette heure évite trois heures de saisie, le bilan peut rester excellent. Il faut mesurer la chaîne entière pour le savoir.

### Les données d’usage décrivent des tâches, pas des licenciements

L’[Anthropic Economic Index consacré au développement logiciel](https://www.anthropic.com/research/impact-software-development) a analysé 500 000 interactions liées au code sur Claude.ai et Claude Code. Les auteurs distinguent augmentation et automatisation, puis cartographient les types de tâches. Une autre édition, publiée en [janvier 2026](https://www.anthropic.com/research/economic-index-primitives), observe que les tâches informatiques représentent environ un tiers des conversations Claude.ai et près de la moitié du trafic API étudié.

Ces chiffres viennent d’un fournisseur et décrivent sa propre population d’utilisateurs. Ils prouvent que le développement est un terrain majeur d’adoption. Ils ne permettent pas de calculer le nombre de postes supprimés. Une interaction classée comme automatisation peut durer deux minutes dans un projet de six mois. Une tâche couverte par l’IA peut devenir plus fréquente parce qu’elle coûte moins cher. Le volume de travail n’est pas fixe.

Le mot « développeur » ajoute une autre approximation. Un développeur front dans une startup, une mainteneuse kernel, un ingénieur mainframe en banque, une personne SRE et un lead qui passe la moitié de sa semaine en coordination partagent un intitulé général. Leur exposition aux mêmes capacités varie énormément.

### Mesurer l’équipe là où le changement devient réel

Une expérience utile en entreprise part d’un flux de livraison et compare des périodes ou des cohortes. Elle enregistre au minimum : temps actif et temps d’attente, taille des changements, taux de reprise, défauts découverts après revue, incidents, temps de revue senior et résultat pour l’utilisateur. Elle garde aussi une trace des tâches confiées à l’IA : explication, génération, migration, test, investigation ou décision.

La comparaison exige une définition stable de « terminé ». Un patch proposé par un agent est une sortie. Un patch relu va plus loin. Un changement qui tourne sans danger en production et résout le problème utilisateur visé constitue le résultat livré. Mélanger ces états favorise l’outil le plus rapide parce qu’on le crédite au premier point de contrôle. Cela masque aussi les suggestions abandonnées et les changements annulés après déploiement. Un petit échantillon avec une frontière propre apprend davantage qu’un taux d’adoption global construit sur des workflows incompatibles.

Il faut aussi conserver la version du modèle et la configuration de l’outil : l’intervention mesurée peut changer matériellement entre deux périodes d’observation.

Cette instrumentation évite deux illusions. La première est le sentiment de vitesse : une réponse arrive en quelques secondes et donne l’impression que le travail est presque terminé. La deuxième est le volume : plus de lignes, plus de pull requests et plus de tickets fermés ressemblent à un gain même si le délai jusqu’à l’utilisateur ne bouge pas.

Le résultat peut conduire à des décisions différentes selon l’équipe. Former les développeurs à découper et vérifier les tâches. Renforcer les tests et les environnements éphémères. Réserver les agents aux migrations mécaniques. Ajouter une revue de menace pour certains chemins. Ou interdire l’autonomie sur une zone où personne ne peut encore expliquer les effets d’un changement.

La question du remplacement saute directement à un chiffre d’effectif. Les données disponibles décrivent surtout un déplacement de tâches, de goulots d’étranglement et de responsabilité. Les organisations vont probablement modifier leurs rôles, leur recrutement et leurs attentes. Le rythme et la direction resteront différents selon les systèmes qu’elles exploitent.

Un agent peut produire davantage de changements qu’une équipe ne sait en examiner. Dans ce cas, la capacité rare n’est déjà plus la frappe au clavier. Elle se trouve chez la personne capable de décider quel changement mérite d’exister, de prouver qu’il tient dans le système et de rester joignable quand la production répond autrement que la démo.

## Sources

- [METR — Early-2025 randomized study](https://metr.org/Early_2025_AI_Experienced_OS_Devs_Study-paper.pdf)
- [METR — 2026 experiment-design update](https://metr.org/blog/2026-02-24-uplift-update/)
- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)
- [Google Cloud — announcement and key findings for DORA 2025](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report)
- [Stack Overflow — 2025 Developer Survey, AI section](https://survey.stackoverflow.co/2025/ai)
- [Anthropic Economic Index — software development](https://www.anthropic.com/research/impact-software-development)
- [Anthropic Economic Index — economic primitives, January 2026](https://www.anthropic.com/research/economic-index-primitives)
