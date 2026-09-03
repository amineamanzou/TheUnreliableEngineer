---
title: "Un projet dérive alors que tous les voyants sont verts"
locale: "fr"
articleSlug: "projet-derive-voyants-verts"
translationKey: "project-drift-green-status"
publishedAt: "2026-09-28"
label: "Delivery / Projet"
readTime: "10 min"
excerpt: "Tickets fermés, vélocité stable et jalons au vert peuvent masquer des décisions vieillissantes, des interfaces sans propriétaire et un résultat qui s’éloigne."
seoTitle: "Projet au vert mais en dérive : les indicateurs qui manquent"
seoDescription: "Pourquoi vélocité, tickets et jalons verts peuvent masquer une dérive projet, et quels signaux suivre pour retrouver la trajectoire."
heroImage: "/blog/projet-derive-voyants-verts/hero-green-status-drift.svg"
heroImageAlt: "Un tableau projet entièrement vert alors que la trajectoire réelle s’écarte de l’objectif"
---

Prenons un cas composite, le genre de comité projet dans lequel plusieurs d’entre vous se reconnaîtront peut-être. L’équipe API a terminé les tickets prévus. L’équipe data respecte son budget. La sécurité a reçu les documents à relire. Le fournisseur annonce une livraison conforme à son planning. Chaque ligne reste verte selon sa propre définition.

Pendant ce temps, aucun utilisateur ne peut terminer le parcours complet. Le contrat d’interface change encore. La décision sur les droits d’accès attend depuis trois semaines. La date de mise en service a glissé, mais chaque équipe considère que le retard se trouve chez une autre.

Personne ne ment nécessairement. Chacun décrit honnêtement son périmètre avec les règles qu’on lui a données. Pourtant, aucun utilisateur ne peut terminer le parcours. Le tableau additionne des santés locales et appelle le résultat « santé du projet ».

C’est ce qui rend ces situations si difficiles à discuter. Dire que le projet dérive peut donner l’impression d’accuser les équipes alors qu’elles livrent vraiment. L’objectif n’est pas de chercher qui aurait dû mettre du rouge. Il est de retrouver l’écart entre ce qui avance dans les colonnes et ce qui fonctionne réellement de bout en bout.

### Une couleur est toujours le résultat d’une règle

Un voyant vert peut signifier « moins de 10 % de retard », « aucun blocage déclaré », « budget mensuel respecté » ou « l’équipe pense encore rattraper la date ». Tant que la règle n’est pas visible, la couleur transporte plus de confiance que d’information.

Les seuils créent aussi une falaise. Un lot à neuf jours de retard reste vert, puis passe rouge au dixième jour, comme si le risque était apparu pendant la nuit. Une équipe qui veut éviter l’escalade peut redécouper le lot, déplacer une échéance ou déclarer le blocage comme dépendance externe. Le système de reporting récompense alors la stabilité de la couleur.

Le [GAO Agile Assessment Guide](https://www.gao.gov/assets/gao-20-590g.pdf) recommande de concevoir des métriques avec les attributs d’une mesure réussie et de les relier aux objectifs. La formule semble administrative. Elle pose une question très pratique : quelle décision devient possible quand ce chiffre bouge ? Si la réponse est seulement « le comité demandera une explication », l’indicateur surveille la présentation plus que le projet.

Vous avez peut-être besoin des couleurs pour consolider dix équipes ou présenter le portefeuille à une direction. Gardez-les. Ajoutez simplement la règle qui produit chaque couleur, la date de la dernière preuve et la décision attendue. Ce petit ajout retire déjà beaucoup d’ambiguïté au vert.

### L’activité reste verte longtemps après la perte de trajectoire

Tickets fermés, points consommés, réunions tenues, documents produits : ces mesures prouvent qu’une équipe travaille. Elles ne prouvent pas que le système se rapproche d’un usage réel.

Le [Service Manual de GOV.UK](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service) demande de partir du but du service et des besoins utilisateurs, puis de définir des hypothèses avant de choisir les données. Cette séquence empêche de sélectionner seulement les données déjà faciles à collecter. Elle recommande aussi de combiner les métriques avec la recherche utilisateur.

Un projet dérive souvent entre ces deux niveaux. L’activité avance selon le backlog, mais l’hypothèse produit reste non testée. Une intégration est déclarée « terminée » parce que le code a fusionné, alors que personne n’a exécuté le parcours avec des données réalistes. Une migration affiche 80 % de tables converties, mais les 20 % restantes contiennent les cas qui bloquent la bascule. Une politique de sécurité est rédigée, mais le mécanisme d’application attend l’identité des responsables.

Le pourcentage masque la forme du reste. Les dix dernières unités ne ressemblent pas forcément aux quatre-vingt-dix premières.

Sous la pression du delivery, il est pourtant difficile de dire qu’un lot terminé à 80 % ne démontre encore rien. Le comité attend une progression et les équipes ont réellement travaillé. Une première sortie consiste à choisir un seul parcours de bout en bout, même incomplet, et à le rejouer avec des données réalistes. La démonstration révèle souvent davantage de trajectoire qu’une semaine supplémentaire de consolidation des pourcentages.

### Les interfaces n’appartiennent à personne dans le statut

Chaque équipe peut tenir son périmètre et rater la livraison commune. Le contrat d’API, la qualité des données, les droits d’accès, le calendrier du fournisseur et la procédure de rollback vivent entre les colonnes. Ils apparaissent souvent comme « dépendances », un mot pratique pour une chose qui ralentit le projet sans faire baisser la vélocité de l’équipe.

La dérive possède alors des signes observables :

- les décisions ouvertes vieillissent ;
- les mêmes sujets reviennent à trois comités ;
- les jalons changent de définition ;
- les tests bout en bout sont repoussés après la « fin » des composants ;
- la date annoncée dépend de conditions que personne n’a encore vérifiées ;
- le travail terminé ne réduit pas le risque principal.

Ces signaux ne nécessitent pas un score sophistiqué. Ils nécessitent une timeline et un propriétaire. Une décision bloquée depuis 21 jours vaut plus d’attention que douze sous-tâches fermées hier.

Et si personne n’a aujourd’hui l’autorité pour trancher ? Il faut alors le rendre visible au lieu d’inventer un propriétaire sur le tableau. L’âge de la décision, l’impact de l’attente et le niveau auquel elle doit être escaladée deviennent les informations utiles. Le manque d’autorité fait partie du risque projet.

### Un projet a aussi besoin de monitoring black-box

Le [chapitre de Google SRE sur le monitoring des systèmes distribués](https://sre.google/sre-book/monitoring-distributed-systems/) sépare monitoring black-box et white-box. Le white-box observe l’intérieur : logs, files, états et composants. Le black-box observe le symptôme depuis l’extérieur : le service répond-il correctement à l’utilisateur ?

Le parallèle avec un projet est direct. Les tickets, budgets et plans de charge sont des signaux internes. Un parcours utilisable, une migration exécutée avec succès, un client capable de réaliser l’opération ou une décision réglementaire effectivement appliquée sont des signaux externes.

Pas besoin de transformer le PMO en équipe SRE pour utiliser cette idée. Posez simplement le projet depuis l’extérieur : qu’est-ce qu’une personne peut accomplir aujourd’hui qu’elle ne pouvait pas accomplir lors de la revue précédente ? Si la réponse repose uniquement sur des composants terminés, le signal black-box manque encore.

Google rappelle aussi que, dans un système à plusieurs couches, le symptôme d’une personne devient la cause d’une autre. La base lente est un symptôme pour l’équipe base de données et une cause pour l’équipe front. Dans un projet, l’API instable est un risque entrant pour une équipe et une sortie « presque terminée » pour une autre. Le tableau consolidé perd ce lien quand il ne conserve que la couleur finale.

Le [rapport DORA 2025](https://dora.dev/research/2025/dora-report/) arrive à une conclusion compatible : des métriques simples de livraison ne suffisent pas à expliquer la performance. DORA relie les résultats à la centralité utilisateur, à la qualité de la plateforme, à la clarté des workflows et à la capacité des équipes à absorber les changements. Un projet peut donc accélérer son activité et dégrader sa stabilité, ou maintenir ses métriques locales tout en ratant la performance produit.

### La review doit chercher l’écart avant la couleur

Une revue de projet utile peut tenir en six questions. Elles ne remplacent pas le plan ; elles vérifient si le plan décrit encore le travail réel.

1. Quel parcours ou résultat peut être démontré aujourd’hui avec des données réalistes ?
2. Quelle hypothèse critique reste non testée ?
3. Quelle décision ouverte est la plus ancienne, et qui peut la prendre ?
4. Quelle dépendance a changé depuis la dernière revue ?
5. Quel travail déclaré terminé devra être repris si cette dépendance échoue ?
6. Quelle date a bougé, même si le jalon conserve son nom ?

Les réponses doivent pointer vers un artefact : démonstration, journal de décision, test bout en bout, historique de roadmap, contrat d’interface, mesure utilisateur. « On est confiants » peut rester dans la conversation. Il ne doit pas devenir une preuve.

Il n’est pas nécessaire de poser les six questions à chaque réunion et à chaque équipe. Commencez par la plus ancienne décision et le dernier test de bout en bout. Si ces deux réponses sont solides, poursuivez. Sinon, vous avez probablement trouvé un sujet plus important que la couleur du statut.

Cette review rend aussi les incertitudes légitimes. Un statut ambre avec une décision nommée et une date de test peut être plus sain qu’un vert fondé sur une dépendance inconnue. Le but n’est pas de faire rougir le dashboard. Il consiste à révéler assez tôt l’endroit où une décision peut encore changer la trajectoire.

### Mesurer le vieillissement, pas seulement le volume

Trois mesures simples rendent la dérive plus visible : âge des décisions ouvertes, temps depuis le dernier test bout en bout réussi, et écart entre date prévue et date actuellement défendable. Elles ont un défaut utile : elles vieillissent toutes seules. Une équipe doit agir ou expliquer pourquoi elle accepte l’écart.

On peut y ajouter la taille du travail en attente entre deux équipes et la part du flux réellement observée par un test utilisateur. Ces données restent imparfaites. Elles décrivent toutefois le mouvement et les interfaces, les deux endroits que les tableaux par composant écrasent.

Je préfère trois mesures imparfaites que les équipes comprennent à un nouveau score global que personne ne sait relier à une décision. Après quelques revues, vous verrez lesquelles provoquent une action et lesquelles deviennent du décor. Gardez les premières, retirez les secondes.

Un journal de décision rend ces mesures exploitables. Il enregistre la question, les options envisagées, la personne responsable, les preuves encore manquantes et la date après laquelle attendre devient une décision en soi. C’est moins lisse qu’un nouveau score de portefeuille, mais la prochaine review dispose enfin d’un objet concret à inspecter. Cela évite aussi de réécrire l’histoire lorsqu’une contrainte présentée comme temporaire en juin devient un fait d’architecture accepté en septembre sans décision explicite.

Lorsque la contrainte change, le journal révèle également quelles estimations et quels composants déjà terminés doivent être réexaminés.

Le statut final peut conserver ses couleurs si l’organisation en a besoin. Chaque couleur devrait être accompagnée de sa règle, de son artefact et de la décision attendue. On peut commencer par le prochain comité, sur un seul jalon critique, sans reconstruire tout le reporting.

Un vert sans décision signifie alors que tout se déroule dans la tolérance convenue. Un vert qui demande encore trois arbitrages, une dérogation et un test jamais exécuté décrit seulement un projet qui a appris à présenter sa dérive correctement.

## Sources

- [GOV.UK Service Manual — setting performance metrics](https://www.gov.uk/service-manual/measuring-success/how-to-set-performance-metrics-for-your-service)
- [U.S. GAO — Agile Assessment Guide](https://www.gao.gov/assets/gao-20-590g.pdf)
- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/)
