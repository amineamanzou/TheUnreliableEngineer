---
title: "Ce qu’un agent IA peut réellement lire sur une machine de développeur"
locale: "fr"
articleSlug: "ai-agent-machine-access"
translationKey: "ai-agent-machine-access"
publishedAt: "2026-08-03"
label: "Agents IA / Sécurité"
readTime: "8 min"
excerpt: "Dépôt Git, historique, variables d’environnement, clés, navigateur et réseau : le périmètre réel d’un agent dépend moins de son modèle que des droits du processus qui l’exécute."
seoTitle: "Agent IA : ce qu’il peut lire sur votre machine"
seoDescription: "Dépôt Git, variables d’environnement, clés, navigateur : découvrez ce qu’un agent IA peut lire et comment limiter son accès."
heroImage: "/blog/ai-agent-machine-access/hero.jpg"
heroImageAlt: "The Unreliable Engineer cartographie les accès d’un agent IA sur une machine de développement"
---

En juillet, des chercheurs n’ont pas demandé à Grok Build ce qu’il envoyait à xAI.

Ils ont regardé le trafic.

Sur la version `0.2.93`, leur reproduction montre que l’outil créait un `git bundle` du dépôt suivi, avec son historique, puis l’envoyait vers un endpoint de stockage. Le comportement a ensuite été désactivé côté serveur. xAI a aussi publié Grok Build sous licence Apache-2.0, ce qui permet maintenant d’inspecter le code au lieu de deviner son fonctionnement depuis une interface.

Cet épisode donne un bon point de départ pour parler des agents de développement. La surface sensible ne se limite déjà plus au fichier ouvert dans l’éditeur.

Un agent peut voir beaucoup plus loin, parce qu’on lui demande précisément de faire beaucoup plus.

## Le modèle ne lit pas directement votre disque

Un modèle distant ne se promène pas tout seul dans `~/Documents`.

Un programme tourne sur la machine ou dans un environnement distant. Ce programme expose des outils au modèle : lecture de fichiers, recherche dans le dépôt, shell, navigateur, connecteurs, serveurs MCP ou accès réseau. Le périmètre dépend alors de trois couches :

1. les droits du compte système qui exécute l’agent ;
2. les outils que l’application lui rend disponibles ;
3. les approbations, sandbox et règles réseau ajoutées autour.

Cette distinction évite deux raccourcis.

Dire qu’un agent « voit toute la machine » est souvent faux. Dire qu’il « ne voit que le fichier courant » peut être tout aussi faux.

Anthropic documente par exemple un accès en lecture plus large que le répertoire de travail pour Claude Code, pendant que les écritures restent davantage confinées. GitHub limite l’accès Internet de son coding agent avec un firewall, tout en précisant que cette protection ne couvre pas tous les processus ni tous les serveurs MCP.

Le nom du produit ne suffit donc pas à connaître la frontière. Il faut regarder son mode d’exécution.

## Le dépôt contient déjà plus que le code affiché

Quand un agent reçoit un dépôt Git, il peut rencontrer :

- le code courant ;
- l’historique des commits ;
- les branches locales ;
- les fichiers supprimés mais encore présents dans l’historique ;
- les configurations de CI/CD ;
- les fichiers de documentation interne ;
- les exemples de variables d’environnement ;
- les noms de services, de buckets, de comptes et d’hôtes.

Le cas Grok Build est utile ici. Un `git bundle` n’est pas une capture du fichier que l’utilisateur est en train d’éditer. C’est un artefact Git transportable qui peut embarquer des références et des objets du dépôt.

Un secret retiré du dernier commit peut donc rester présent dans l’historique. Une migration inachevée, un ancien endpoint ou une adresse interne aussi.

La première vérification consiste à regarder ce que le dépôt raconte déjà avant même d’ouvrir la question du shell.

## Le shell change complètement l’échelle

Avec un terminal, l’agent peut lancer les mêmes commandes que le compte qui l’exécute, dans les limites de la sandbox et des approbations.

Il peut inventorier des fichiers, lire des configurations, démarrer des tests, inspecter des processus ou appeler un outil déjà authentifié. Si `git`, `gh`, `aws`, `gcloud`, `kubectl` ou un gestionnaire de secrets fonctionne sans nouvelle authentification dans ce terminal, l’agent peut parfois hériter d’une partie de ce contexte.

Une demande d’approbation réduit le risque d’action accidentelle. Elle ne transforme pas une commande incompréhensible en commande sûre.

La fatigue arrive vite quand chaque `npm install`, chaque test et chaque lecture hors dossier produit une boîte de dialogue. Au bout de la vingtième autorisation, « toujours autoriser » commence à ressembler à une amélioration ergonomique.

C’est aussi un changement de modèle de menace.

## Les credentials existent sous plusieurs formes

Les développeurs pensent souvent au fichier `.env`. Le contexte d’authentification se cache aussi ailleurs :

- variables injectées dans le processus ;
- fichiers de configuration des CLI ;
- credentials Git ;
- clés SSH ;
- sockets d’agents SSH ;
- cookies et sessions de navigateur ;
- tokens stockés par une extension ;
- credentials rendus disponibles à un conteneur ;
- connecteurs OAuth et serveurs MCP.

Un agent n’a pas forcément besoin de lire la valeur brute d’une clé pour l’utiliser. Une CLI déjà connectée ou un connecteur peut suffire à effectuer une action.

Les solutions récentes commencent à déplacer les secrets hors de l’environnement de l’agent. Vercel Sandbox peut, par exemple, injecter un header d’authentification au niveau de sa politique réseau : le code exécuté appelle le service sans recevoir directement le secret.

Ce type de séparation est plus solide qu’une consigne du style « ne lis pas ce fichier ».

## Lecture locale et sortie réseau doivent être examinées ensemble

Un agent qui lit un dépôt sans pouvoir communiquer vers l’extérieur ne présente pas le même risque qu’un agent doté d’un accès réseau ouvert.

À l’inverse, un agent très limité sur le disque mais connecté à des dizaines de services via OAuth peut agir loin de la machine.

Le couple important est donc :

`ce que le processus peut lire` × `l’endroit où il peut l’envoyer ou l’utiliser`

GitHub explique que son firewall limite l’exfiltration courante, puis documente ses propres trous de couverture. C’est la bonne attitude : un contrôle utile reste un contrôle partiel.

Il faut aussi inclure les dépendances et les instructions externes. Un README, une issue, une page web ou la sortie d’un outil peut contenir une instruction malveillante. Si l’agent la traite comme une nouvelle mission, le périmètre accordé au processus devient immédiatement intéressant pour l’attaquant.

## L’audit que je ferais avant d’ouvrir un dépôt sensible

Je commencerais par une session jetable sur un dépôt sans secret.

Je regarderais ensuite, dans cet ordre :

1. **Le compte système.** Quels dossiers peut-il lire ? Peut-il atteindre le trousseau, l’agent SSH ou des volumes partagés ?
2. **Le dossier de travail.** L’agent reste-t-il dans le dépôt ou peut-il remonter dans les répertoires parents ?
3. **Les commandes.** Lesquelles partent sans approbation ? Quelles règles « toujours autoriser » existent déjà ?
4. **Les credentials.** Quelles CLI, variables et sessions sont actives dans le même environnement ?
5. **Le réseau.** La sortie est-elle ouverte, bloquée ou limitée à une liste de domaines ?
6. **Les connecteurs.** Quels scopes OAuth et outils MCP sont disponibles, et qui les maintient ?
7. **Les traces.** Peut-on relire les commandes, fichiers consultés, domaines appelés et décisions approuvées ?

Puis je ferais un test volontaire : placer une fausse valeur sensible dans un emplacement contrôlé et vérifier si elle est lue, journalisée ou envoyée.

Une politique que personne n’a essayé de casser reste une intention.

## Donner moins, puis élargir quand le travail le demande

Sur un dépôt public ou un lab, un environnement assez ouvert peut être un compromis acceptable.

Sur le laptop d’un consultant connecté à plusieurs clients, la même configuration devient beaucoup moins drôle.

Je préfère séparer les contextes : un compte ou un conteneur dédié, des credentials courts, un dépôt par workspace, une sortie réseau limitée et des connecteurs accordés à la tâche. Le confort baisse un peu au début. L’enquête baisse beaucoup le jour où un comportement surprenant apparaît.

Le cas Grok Build ne prouve pas que tous les agents exfiltrent les dépôts. Il prouve quelque chose de plus directement exploitable : le marketing, l’interface et la fenêtre de permission ne suffisent pas à décrire le flux réel.

Pour connaître la frontière, il faut regarder le processus, les droits et le réseau.

Sources :

- Cereblab, reproduction du trafic de Grok Build 0.2.93 : https://github.com/cereblab/grok-build-exfil-repro
- Dépôt officiel xAI Grok Build : https://github.com/xai-org/grok-build
- Anthropic, sécurité de Claude Code : https://docs.anthropic.com/fr/docs/claude-code/security
- GitHub, firewall du Copilot coding agent : https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-firewall
- Vercel, injection de credentials dans Sandbox : https://vercel.com/changelog/safely-inject-credentials-in-http-headers-with-vercel-sandbox
