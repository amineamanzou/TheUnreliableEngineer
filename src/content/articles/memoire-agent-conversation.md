---
title: "Ma mémoire d’agent : ce qui mérite de survivre à une conversation"
locale: "fr"
articleSlug: "memoire-agent-conversation"
translationKey: "memoire-agent-conversation"
publishedAt: "2026-12-17"
label: "Expérimentations / SRE"
readTime: "4 min"
excerpt: "Je corrige une règle de travail dans une conversation, puis je la répète dans la suivante. La deuxième fois, la gêne est légère. Quand plusieurs projets dépendent de la même règle, je commence surtout à me demander quelle version chaque agent applique."
seoTitle: "Ma mémoire d’agent : ce qui mérite de survivre à une conversation"
seoDescription: "Je corrige une règle de travail dans une conversation, puis je la répète dans la suivante. La deuxième fois, la gêne est légère. Quand plusieurs projets dé"
heroImageAlt: "Ma mémoire d’agent : ce qui mérite de survivre à une conversation"
---

Je corrige une règle de travail dans une conversation, puis je la répète dans la suivante. La deuxième fois, la gêne est légère. Quand plusieurs projets dépendent de la même règle, je commence surtout à me demander quelle version chaque agent applique.

C’est à partir de cette friction que je regarde la mémoire agentique. Je veux qu’une décision durable reste disponible sans conserver chaque échange comme une nouvelle vérité. Dans mon usage, une préférence explicite, un résultat vérifié ou une règle de fonctionnement peuvent changer la prochaine décision. Un brouillon abandonné et une hypothèse de l’agent n’ont pas le même poids.

### Une correction doit pouvoir remplacer une règle

La fusion des PR de dépendances donne un exemple simple. J’ai précisé que les PR dont les contrôles et les tests qualifiés passent doivent être fusionnées automatiquement. Conserver une ancienne formulation qui demande mon accord à chaque fois réintroduirait exactement la charge que je voulais retirer.

Je veux donc retrouver la source de la règle, sa portée et ce qui la remplace. Une instruction pour un pilote n’autorise pas toutes les opérations sur tous les projets. Une exception d’infrastructure ne doit pas se transformer en règle générale pour les applications.

### Retrouver un fait ne le rend pas actuel

La mémoire peut me renvoyer une décision ancienne, une information encore incertaine ou une observation locale en attente de synchronisation. Il faut garder ces états visibles. Si un agent transforme chaque résultat retrouvé en fait actuel, je gagne du contexte apparent et je perds la possibilité d’examiner sa fiabilité.

La même prudence s’applique aux personnes et aux réunions. Une suggestion de nom dans une transcription n’est pas une identité confirmée. Et une note sensible ne devient pas publiable parce qu’elle est devenue facile à rechercher.

### Je veux corriger sans tout relire

Mon objectif pratique reste modeste : donner une décision une fois, retrouver pourquoi elle existe et pouvoir la corriger. J’ai besoin d’un système qui sache distinguer ce que j’ai dit de ce qu’un agent en a déduit, puis limiter ce qu’il remet dans le contexte.

Je ne mesure pas ici un gain de fiabilité de diagnostic ni une réduction du temps de travail. Je pose le contrat que j’attends de ma mémoire. Le test utile viendra à la prochaine reprise de projet : l’agent retrouvera-t-il la règle applicable, sa source et son éventuelle exception, sans me demander de raconter toute l’histoire ?
