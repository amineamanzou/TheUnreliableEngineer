---
title: "Cette infrastructure fonctionne encore, mais personne n’ose la toucher"
locale: "fr"
articleSlug: "legacy-infrastructure-migration"
translationKey: "legacy-infrastructure-migration"
publishedAt: "2026-08-17"
label: "Dette technique / Migration"
readTime: "8 min"
excerpt: "Un serveur à 10 euros, des services oubliés, des backups flous et un WordPress maintenu par inertie : comment reprendre une infrastructure legacy sans commencer par la casser."
seoTitle: "Infrastructure legacy : migrer sans tout casser"
seoDescription: "Inventaire, backup restauré, dépendances, IaC et rollback : une méthode concrète pour reprendre une infrastructure legacy sans casser la production."
heroImage: "/blog/legacy-infrastructure-migration/hero.jpg"
heroImageAlt: "The Unreliable Engineer prépare la migration méthodique d’un serveur legacy couvert de dépendances"
---

J’avais un serveur à une dizaine d’euros par mois qui faisait encore son travail.

Il hébergeait mon site, des expérimentations d’observabilité, quelques services lancés au fil des années et des essais de mail à l’ancienne avec Dovecot. Les permissions avaient été séparées pour limiter les dégâts si une expérimentation se faisait compromettre. Sur le papier, ce n’était donc pas la catastrophe absolue.

Dans la pratique, je repoussais le moment de regarder l’ensemble.

Le serveur répondait. WordPress tournait. Les bases existaient quelque part. Les backups avaient probablement une histoire à raconter. Chaque semaine gagnée sans panne rendait l’infrastructure un peu plus difficile à modifier.

Ce type de système survit grâce à une propriété assez ingrate : personne ne veut être celui qui découvre la dépendance oubliée en production.

## « Ça marche » décrit mal l’état du système

Une infrastructure peut servir correctement les requêtes tout en étant déjà fragile.

La fragilité apparaît ailleurs :

- personne ne sait lister tous les services ;
- l’ordre de démarrage vit dans la mémoire d’un shell ;
- le backup existe, mais la restauration n’a pas été rejouée ;
- un cron appelle un chemin qui n’est documenté nulle part ;
- un certificat se renouvelle avec un script oublié ;
- une base partage la machine avec plusieurs expériences ;
- le DNS, le serveur et le déploiement ont chacun leur méthode ;
- la dernière personne qui comprend un composant évite de partir en vacances.

Le monitoring peut rester vert pendant toute cette période.

Il confirme que le système répond maintenant. Il ne mesure pas automatiquement notre capacité à le reconstruire, le modifier ou le restaurer.

Je préfère donc poser une autre série de questions :

- Combien de temps faut-il pour retrouver ce qui tourne ?
- Quel changement peut être testé sans toucher la production ?
- Peut-on restaurer les données ailleurs ?
- Où sont les secrets ?
- Quel est le retour arrière ?
- Qui peut expliquer la séquence sans ouvrir quinze terminaux ?

Les réponses décrivent mieux l’opérabilité que le taux de disponibilité du mois.

## Commencer par ne rien changer

Mon premier passage a été volontairement en lecture.

Avant de moderniser, il fallait inventorier :

- services systemd ;
- conteneurs ;
- ports en écoute ;
- reverse proxy ;
- crons ;
- bases et volumes ;
- certificats ;
- DNS ;
- règles réseau ;
- répertoires contenant des données ;
- mécanismes de sauvegarde ;
- dépôts et scripts utilisés pour déployer.

Un agent IA m’a aidé sur cette partie. Il pouvait explorer les configurations, rapprocher des noms, repérer un service référencé à plusieurs endroits et préparer une documentation.

Je n’avais aucune envie de lui donner une consigne du style « nettoie le serveur ».

Nettoyer, vu depuis une machine, peut vouloir dire supprimer le vieux dossier qui contient précisément l’unique copie d’une donnée. L’agent avait donc une mission plus étroite : observer, proposer l’inventaire, signaler les zones floues et préparer les commandes de vérification.

Le jugement restait du côté humain, surtout quand une commande pouvait modifier l’état.

## Un backup non restauré reste une hypothèse

Le chantier de migration commence vraiment quand les données peuvent survivre à la machine actuelle.

J’ai séparé trois questions :

1. Quelles données doivent être conservées ?
2. Comment sont-elles copiées ?
3. Peut-on les restaurer dans un environnement différent ?

Une archive créée sans erreur répond à la deuxième question. Elle ne répond pas à la troisième.

La restauration doit vérifier le format, les permissions, les versions, les secrets nécessaires et le temps réel de reprise. Elle peut aussi révéler que le backup dépend d’un binaire installé uniquement sur le serveur d’origine. C’est le genre de détail qui donne beaucoup de personnalité à une nuit d’incident.

Je voulais un point de retour avant de commencer à transformer l’infrastructure.

## Rendre les dépendances visibles

Le vieux serveur mélangeait plusieurs époques.

Un composant avait été installé proprement. Un autre venait d’une expérimentation. Un troisième existait parce qu’un service en avait besoin deux ans plus tôt. Le problème n’était pas chaque brique prise séparément. C’était la carte absente entre elles.

J’ai reconstruit la migration autour de dépendances observables :

`DNS → reverse proxy → service → base ou volume → backup → supervision`

Pour chaque chemin, il fallait un propriétaire, une configuration, un secret, un test et un retour arrière.

Cette carte empêche une modernisation assez classique : remplacer une vieille machine par une nouvelle machine plus chère qui contient exactement le même flou.

## Le nouvel environnement doit pouvoir être rejoué

La cible est partie sur Hetzner.

Le coût mensuel a augmenté. En échange, les noms de domaine et l’infrastructure sont maintenant décrits en Infrastructure as Code, les composants sont déployés avec Ansible et la sortie de WordPress peut avancer comme un chantier explicite.

Cette fois, le test utile n’était pas « est-ce que le serveur existe ? ».

Je voulais savoir si je pouvais :

- recréer l’infrastructure depuis le dépôt ;
- redéployer un composant sans mémoire cachée ;
- retrouver l’origine d’une configuration ;
- distinguer un secret d’une valeur publique ;
- vérifier un backup ;
- supprimer l’ancien chemin après une période d’observation.

L’IaC ne garantit pas que l’architecture est bonne. Il donne au moins une surface de revue, un historique et une façon de rejouer ce qui a été décidé.

## Migrer par chemins, pas par grand soir

Le serveur d’origine continuait de fonctionner. Je pouvais donc déplacer progressivement :

1. préparer la cible ;
2. restaurer une copie des données ;
3. lancer le service sur une adresse de test ;
4. comparer le comportement ;
5. réduire le TTL DNS si nécessaire ;
6. basculer un chemin ;
7. observer ;
8. garder l’ancien service disponible pendant une fenêtre définie ;
9. retirer l’ancien composant quand le retour arrière n’est plus utile.

Cette progression paraît plus lente qu’une bascule complète.

Elle évite surtout de découvrir toutes les dépendances au même moment.

Le plan doit aussi dire quand arrêter. Une hausse d’erreurs, un certificat absent, une donnée incohérente ou un backup non vérifié bloque la suite. Sans critères explicites, « on surveille » devient facilement « on espère ».

## Ce que l’agent a réellement changé

Le chantier a pris environ un jour et demi de travail réparti, sans rester en permanence devant l’écran.

L’agent a surtout baissé le coût de démarrage. Il a aidé à parcourir les configurations, produire l’inventaire, préparer les fichiers IaC, relire des tâches Ansible et conserver les décisions dans des artefacts.

La [frontière de sécurité décrite dans l’article sur les agents](/blog/ai-agent-machine-access/) restait valable ici. Un outil capable de lire une infrastructure et d’exécuter des commandes mérite un compte limité, des approbations claires, des backups vérifiés et des traces.

L’automatisation a rendu le système attaquable intellectuellement. Elle n’a pas transformé une migration risquée en bouton magique.

## La dette diminue quand la prochaine personne peut agir

À la fin, le changement le plus important n’était pas le fournisseur.

C’était la possibilité de répondre à des questions simples sans archéologie :

- qu’est-ce qui tourne ?
- où est la configuration ?
- comment restaurer ?
- comment redéployer ?
- quel composant peut être retiré ?
- que se passe-t-il si la nouvelle cible échoue ?

Une infrastructure legacy devient dangereuse quand son fonctionnement quotidien dépend de ne rien modifier.

La sortie commence en construisant assez de preuves pour toucher le système sans avancer à l’aveugle : inventaire, backup restauré, dépendances, environnement rejouable, bascule progressive et retour arrière.

Le serveur qui tient encore nous donne justement le temps de faire ce travail proprement.

Pour proposer un cas réel d’infrastructure à analyser : [Étude de cas tech](/offres/etude-de-cas-tech/).
