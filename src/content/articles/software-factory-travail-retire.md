---
title: "Ma software factory : ce qu’elle m’enlève vraiment comme travail"
locale: "fr"
articleSlug: "software-factory-travail-retire"
translationKey: "software-factory-travail-retire"
publishedAt: "2026-12-10"
label: "Expérimentations / SRE"
readTime: "4 min"
excerpt: "Une PR de dépendance arrive. Les tests sont verts, mais personne ne la fusionne. Je demande où elle en est, puis ce qui la bloque, puis s’il faut relancer un agent. À ce stade, mon automatisation vient de créer un petit poste de supervision pour moi."
seoTitle: "Ma software factory : ce qu’elle m’enlève vraiment comme travail"
seoDescription: "Une PR de dépendance arrive. Les tests sont verts, mais personne ne la fusionne. Je demande où elle en est, puis ce qui la bloque, puis s’il faut relancer "
heroImageAlt: "Ma software factory : ce qu’elle m’enlève vraiment comme travail"
---

Une PR de dépendance arrive. Les tests sont verts, mais personne ne la fusionne. Je demande où elle en est, puis ce qui la bloque, puis s’il faut relancer un agent. À ce stade, mon automatisation vient de créer un petit poste de supervision pour moi.

C’est la friction que je cherche à corriger avec ma software factory. Je travaille sur plusieurs projets et je veux passer plus de temps sur le besoin, le métier et l’architecture. Ouvrir des sessions, rappeler les règles du dépôt et déplacer un résultat vers l’étape suivante prend de la place dans ce temps-là.

### Une réussite locale laisse encore du travail

Un agent peut produire une correction correcte sans que le processus avance. La branche a vieilli, les contrôles attendus ont changé ou le test natif nécessaire n’a pas été exécuté. Le résultat utile doit inclure les preuves et la prochaine action, sinon je reconstruis moi-même le contexte.

J’ai donc demandé une continuité entre le suivi des PR, la revue et les corrections. Pour les dépendances, ma règle est de fusionner automatiquement quand les contrôles et les tests qualifiés sont verts. Lorsqu’un compromis apparaît, comme une rétrogradation nécessaire pour corriger une vulnérabilité, il faut regarder l’exposition et la compatibilité. La couleur d’un seul badge ne porte pas cette décision.

### Deux corrections, puis une discussion

Pour le pilote, j’ai fixé deux cycles de correction avant arbitrage. Cette limite donne un point où examiner le problème : manque-t-il un test représentatif, une recette de validation ou une décision ? Continuer à dépenser des appels d’agent sans nommer ce manque me ferait perdre la visibilité que je cherche.

La revue indépendante intervient avant de considérer la PR prête. Quand elle trouve un bug, le retour doit repartir vers l’agent qui développe. Le passage de relais a lui-même besoin d’un état durable ; une conversation oubliée ne doit pas devenir le mécanisme de verrouillage du projet.

### Ce que je compte comme gain

Je ne donne pas ici de pourcentage de productivité : je n’ai pas établi une mesure qui l’autorise. Je regarde des signes plus proches du travail. Dois-je redonner une instruction technique déjà autorisée ? Puis-je comprendre un blocage sans relire plusieurs chats ? Une interruption laisse-t-elle une reprise explicite ?

L’agent permanent m’intéresse comme point d’entrée vers ce suivi. Pour une décision d’architecture difficile, je veux encore ouvrir une session dédiée et creuser. La factory doit me ramener un résultat ou un arbitrage précis, avec les preuves utiles. Si elle me ramène seulement une nouvelle liste d’agents à surveiller, le travail est resté chez moi.
