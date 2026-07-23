---
title: "Un leak de données est une chaîne de décisions"
locale: "fr"
articleSlug: "data-leak-chain-decisions"
translationKey: "data-leak-chain-decisions"
publishedAt: "2026-08-10"
label: "Incident / Fuite de données"
readTime: "7 min"
excerpt: "L’incident Vercel d’avril 2026 montre comment un outil tiers, un compte Workspace, des accès internes et la classification des secrets transforment plusieurs décisions ordinaires en fuite de données."
seoTitle: "Fuite de données : la chaîne de décisions"
seoDescription: "L’incident Vercel d’avril 2026 montre comment OAuth, Workspace, les accès internes et les secrets transforment des décisions ordinaires en fuite."
heroImage: "/blog/data-leak-chain-decisions/hero.jpg"
heroImageAlt: "The Unreliable Engineer suit la chaîne de décisions qui relie un outil tiers à des secrets exposés"
---

Le bulletin de sécurité publié par Vercel en avril 2026 commence chez un autre éditeur.

Vercel explique que l’incident a pris naissance dans la compromission de Context.ai, un outil d’IA tiers utilisé par un salarié. L’attaquant a ensuite pris le contrôle du compte Google Workspace individuel de cette personne, atteint son compte Vercel, pivoté dans un environnement interne, puis énuméré et déchiffré des variables d’environnement classées comme non sensibles.

Une partie limitée des clients a été touchée. Vercel les a contactés et leur a demandé de faire tourner les credentials concernés.

Lu trop vite, le résumé devient : « des variables d’environnement ont fuité ».

On perd alors presque tout ce qui permet d’éviter le prochain incident.

## Le fichier exposé arrive à la fin

La fuite visible est un secret lu, une base copiée ou un dépôt téléchargé.

Avant ce résultat, plusieurs frontières ont été traversées :

1. un outil tiers a été autorisé dans un contexte professionnel ;
2. son application OAuth a obtenu un accès à Google Workspace ;
3. le compte Workspace donnait accès à un compte Vercel ;
4. ce compte permettait d’atteindre un environnement interne ;
5. l’environnement permettait d’énumérer des variables ;
6. certaines valeurs sensibles pour le client restaient lisibles parce qu’elles n’étaient pas marquées `Sensitive`.

Chaque étape a probablement eu une justification locale.

L’outil aide le salarié. L’OAuth évite un nouveau mot de passe. Le Workspace centralise les accès. Le compte Vercel simplifie le travail. Les variables non sensibles restent consultables pour faciliter le debug.

Le cumul crée un chemin que personne n’a forcément dessiné de bout en bout.

## Un outil tiers hérite de la valeur de ses connexions

L’évaluation d’un SaaS se concentre souvent sur ce qu’on lui envoie volontairement.

Pour un outil d’IA, on demande : quelles conversations sont stockées ? Est-ce que le code sert à entraîner le modèle ? Où sont hébergées les données ?

Ces questions comptent. Elles ne couvrent pas les capacités obtenues par connexion.

Une application OAuth peut accéder à une messagerie, un Drive, un calendrier, un annuaire ou d’autres ressources Workspace selon les scopes accordés. Le compte humain relié à cette application peut lui-même être connecté à des outils internes.

L’outil tiers devient alors un maillon de l’identité, même s’il n’a jamais été acheté comme produit de sécurité.

L’inventaire utile doit donc relier :

- l’application ;
- ses scopes OAuth ;
- les utilisateurs concernés ;
- les groupes et rôles de ces utilisateurs ;
- les systèmes accessibles depuis leur identité ;
- les données lisibles une fois dans ces systèmes.

Une liste de fournisseurs sans cette carte décrit les contrats. Elle décrit mal le rayon d’action.

## Le compte humain sert souvent de pont

Dans le récit officiel, l’attaquant ne saute pas directement de Context.ai vers une base de données client.

Il prend le contrôle d’un compte Workspace individuel, puis utilise les accès attachés à cette identité.

Cette nuance change la réponse.

Révoquer seulement l’application tierce ferme une porte. Les sessions, tokens, credentials et accès obtenus après le pivot peuvent continuer à fonctionner. Vercel rappelle d’ailleurs que supprimer un projet ou un compte ne suffit pas : les secrets compromis doivent être tournés.

Un playbook de réponse doit suivre l’attaquant dans le même ordre :

- révoquer l’application et ses tokens ;
- invalider les sessions du compte ;
- examiner les événements Workspace ;
- revoir les accès Vercel et les journaux d’activité ;
- identifier les variables consultées ;
- faire tourner les credentials en aval ;
- rechercher les déploiements ou actions inattendus.

La dernière rotation dépend de la première chronologie. Sans logs exploitables, l’équipe élargit le périmètre par prudence et fait tourner beaucoup plus de secrets.

## « Non sensible » ne veut pas dire « sans conséquence »

Vercel distingue les variables sensibles, dont la valeur ne peut plus être relue après création, des variables non sensibles qui peuvent être déchiffrées en clair.

Des clients avaient stocké des clés API, tokens, credentials de base de données ou clés de signature dans cette seconde catégorie. Le produit permettait de le faire. L’incident a rendu le coût de cette classification visible.

Le piège se trouve dans le vocabulaire.

Une variable peut être pratique à afficher pendant un debug tout en donnant accès à un système critique. Sa sensibilité dépend de ce qu’elle autorise, pas du nom du champ ni de l’écran qui la contient.

Je traiterais comme secret toute valeur qui permet :

- d’agir sur un service ;
- de lire des données non publiques ;
- de signer ou chiffrer quelque chose ;
- de déployer ;
- d’impersonner un utilisateur ou un système ;
- d’atteindre un autre secret.

Cette dernière catégorie est souvent oubliée. Un token apparemment limité peut ouvrir un chemin vers un outil plus puissant.

## La chaîne doit être réductible à plusieurs endroits

Une architecture saine n’attend pas qu’un seul contrôle arrête tout.

Dans ce cas, plusieurs coupures auraient pu réduire l’impact :

- scopes OAuth plus étroits ;
- validation et revue régulière des applications Workspace ;
- compte professionnel séparé pour les outils expérimentaux ;
- authentification forte et sessions courtes ;
- rôles Vercel limités au besoin ;
- variables sensibles illisibles après création ;
- credentials courts et révocables ;
- alertes sur l’énumération ou la lecture inhabituelle de variables ;
- rotation testée avant l’incident.

Aucune mesure ne rend le système invulnérable. Chacune retire une partie du chemin.

Le travail intéressant consiste à demander, pour chaque maillon : si celui-ci tombe, quelle est la prochaine frontière réelle ?

## Garder les niveaux de preuve propres

Des récits publics ont ajouté des détails sur la compromission initiale, les personnes impliquées et une éventuelle vente de données.

Le bulletin Vercel ne confirme pas tous ces éléments.

Je préfère donc conserver une chronologie plus courte et vérifiable : Context.ai compromis, application OAuth concernée, compte Workspace pris, accès Vercel obtenu, environnement atteint, variables non sensibles lues, clients concernés avertis.

Cette discipline ne rend pas l’incident moins grave. Elle évite de construire la remédiation autour d’un détail spectaculaire qui pourrait être faux.

L’[article précédent sur les agents IA](/blog/ai-agent-machine-access/) arrivait à une conclusion proche depuis la machine du développeur : lecture locale et capacité de sortie doivent être observées ensemble.

Ici, le même raisonnement s’applique à l’identité. Il faut suivre ce qu’un compte peut atteindre, puis ce que chaque système permet de lire ou d’utiliser.

## Dessiner le chemin avant l’incident

Je demanderais à une équipe de choisir ses cinq applications SaaS les plus connectées et de dessiner, pour chacune :

`application → scopes → utilisateurs → rôles → systèmes → secrets → données`

Ensuite, on teste une révocation.

Combien de temps faut-il pour retirer l’application ? Les sessions disparaissent-elles ? Peut-on retrouver les actions réalisées ? Quels credentials doivent être tournés ? Qui sait le faire un vendredi soir ?

Ce dessin paraît moins urgent qu’un scan de vulnérabilités.

Il devient très concret quand l’outil qui aide à travailler se transforme en point d’entrée vers l’environnement qui contient les secrets.

Sources :

- Vercel, bulletin officiel sur l’incident d’avril 2026 : https://vercel.com/kb/bulletin/vercel-april-2026-security-incident
- Vercel, variables d’environnement sensibles : https://vercel.com/docs/environment-variables/sensitive-environment-variables
- Google Workspace, contrôle des applications OAuth : https://support.google.com/a/answer/7281227
