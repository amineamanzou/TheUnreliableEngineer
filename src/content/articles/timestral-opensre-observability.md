---
title: "Timestral et OpenSRE : j’ajoute un agent à mon observabilité"
locale: "fr"
articleSlug: "timestral-opensre-observability"
translationKey: "timestral-opensre-observability"
publishedAt: "2026-10-19"
label: "Expérimentation / Agentic SRE"
readTime: "10 min"
excerpt: "J’ai déjà mes données dans ClickHouse. Je branche Timestral pour repérer des écarts, puis OpenSRE pour commencer les investigations. Voilà ce que ça donne sur mes applications et ce que je garde dans mon workflow."
seoTitle: "Timestral et OpenSRE : un agent dans mon observabilité"
seoDescription: "Mon expérimentation avec Timestral, ClickHouse et OpenSRE : prévisions, contexte, outils et investigations sur mes applications, avec des limites explicites."
heroImage: "/blog/timestral-opensre-observability/cover.png"
heroImageAlt: "L’ingénieur en chemise à carreaux rouges examine une courbe et relie les preuves de son investigation."
---

Je découvre Timestral, le modèle de prévision de séries temporelles de Mistral, et j’ai tout de suite envie de le brancher sur mes métriques. J’ai déjà ClickHouse dans ma stack d’observabilité, avec des données à lui donner. L’idée est assez simple : regarder si le modèle peut faire ressortir des comportements inhabituels sur mes applications, puis utiliser un agent pour commencer l’investigation.

Dans mon workflow précédent, j’intervenais surtout lorsqu’un problème m’était signalé. Ensuite, je faisais le tour à la main : récupérer les données, retrouver le service concerné, vérifier comment il est déployé et comprendre ce qui se passe. Je veux automatiser une partie de ce travail et regarder mes métriques plus régulièrement.

J’ajoute donc deux briques à l’existant : Timestral pour les prévisions, et OpenSRE pour l’enquête. ClickHouse reste la source de télémétrie que j’utilise déjà.

Le sujet m’intéresse aussi dans mon travail freelance : j’accompagne actuellement un client sur ces problématiques d’agents SRE. Aller tester ce qui se fait en open source me permet de sortir un peu de la bulle du client, de voir d’autres approches et de les confronter à mes propres applications. Et puis, j’avoue, j’ai envie de voir jusqu’où je peux pousser le montage.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/workflow-fr.svg" aria-label="Ouvrir le schéma en grand"><img src="/blog/timestral-opensre-observability/workflow-fr.svg" alt="Des applications à ClickHouse, puis à Timestral et OpenSRE, avec documentation, outils en lecture seule, rapport et décision humaine." width="720" height="1140" loading="lazy" decoding="async" /></a>
  <figcaption>Le workflow quotidien relie les prévisions à une investigation consolidée. OpenSRE utilise aussi la documentation et des outils bornés pour produire un rapport que je peux vérifier.</figcaption>
</figure>

## Ce que je donne à Timestral, et ce qu’il me renvoie

Une série temporelle, ici, c’est une suite de mesures prises dans le temps : la durée d’une requête, la charge d’un serveur ou le nombre de jobs en attente. Je donne à Timestral cet historique et le nombre de points que je veux prévoir. Il calcule les valeurs attendues pour la suite.

Par exemple, avec une mesure toutes les cinq minutes, demander six points revient à prévoir la prochaine demi-heure. Je peux ensuite comparer cette prévision aux six mesures réellement collectées. Si la file de jobs grossit beaucoup plus que prévu, j’ai un sujet à examiner.

La sortie contient plusieurs prévisions, appelées quantiles. La médiane donne le milieu de la distribution prévue ; les quantiles bas et hauts permettent de dessiner une bande autour. Plus la bande est large, plus les valeurs prévues sont dispersées. Ça donne une indication de l’incertitude du modèle, à vérifier sur mes données.

J’utilise [Timestral-5M](https://huggingface.co/mistralai/Timestral-5M), qui renvoie 21 quantiles par point. Le modèle est préentraîné : je peux lui fournir une nouvelle série directement, sans phase d’entraînement propre à mon application. Son architecture Transformer traite les mesures par groupes de points. La famille sait aussi utiliser plusieurs séries ensemble et des variables complémentaires ; mon premier montage analyse chaque métrique séparément. [Le dépôt montre les entrées et les sorties de l’API](https://github.com/mistralai/timestral).

Pour mon bilan quotidien, je récupère quarante-huit heures de mesures. La première journée sert de contexte, puis je parcours la seconde par fenêtres de trente minutes. À chaque étape, Timestral reçoit uniquement les points antérieurs à la fenêtre évaluée. Je peux ainsi regarder les écarts de la veille sans lui donner la réponse à l’avance.

Je garde les hausses qui dépassent la borne haute au quantile 99 %, avec un écart significatif pour la métrique pendant au moins trois tranches de cinq minutes. Ce 99 % concerne la distribution prévue des valeurs. La qualification de l’incident vient ensuite, avec les autres signaux. Pour le succès d’un healthcheck, une règle fixe suffit déjà à vérifier le résultat attendu.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/forecast-fr.svg" aria-label="Ouvrir le schéma en grand"><img src="/blog/timestral-opensre-observability/forecast-fr.svg" alt="Exemple illustratif de prévision sur trente minutes : médiane, bande de quantiles et mesures réelles dépassant la borne haute." width="720" height="1060" loading="lazy" decoding="async" /></a>
  <figcaption>Données illustratives. Six mesures espacées de cinq minutes sont comparées à la prévision. Des dépassements persistants et significatifs de la borne haute donnent un signal à examiner avec les autres données.</figcaption>
</figure>

## Quelques repères sur ce qui existe déjà

La prévision de séries temporelles a déjà ses modèles préentraînés : [TimesFM chez Google](https://research.google/blog/a-decoder-only-foundation-model-for-time-series-forecasting/), [Chronos chez Amazon](https://arxiv.org/abs/2403.07815) ou [Moirai chez Salesforce](https://www.salesforce.com/blog/moirai/), tous présentés dès 2024. Ils apprennent sur de nombreuses séries pour pouvoir prévoir l’évolution de nouvelles données. Timestral rejoint cette famille d’outils que l’on peut essayer sur ses propres métriques.

Les plateformes d’observabilité ont aussi leurs approches. [Dynatrace propose des seuils adaptatifs et des baselines saisonnières](https://docs.dynatrace.com/docs/discover-dynatrace/platform/davis-ai/anomaly-detection/concepts/anomaly-detection-configuration) : elles tiennent compte des variations habituelles, par exemple un pic qui revient pendant les heures de travail. [Elastic combine notamment décomposition de séries temporelles et modèles probabilistes](https://www.elastic.co/guide/en/machine-learning/current/ml-ad-algorithms.html) pour apprendre un comportement de référence et attribuer un score aux écarts.

Ces solutions donnent des points de comparaison pour la suite. Pour cette expérimentation, ce qui m’intéresse avec Timestral, c’est de pouvoir l’insérer dans mon workflow existant, choisir les séries et décider moi-même ce qui déclenche une investigation. Le comparatif sur mes incidents viendra avec davantage de recul.

## Je branche OpenSRE sur les outils et la documentation

Une fois l’écart repéré, [OpenSRE, le projet de Tracer Cloud](https://github.com/Tracer-Cloud/opensre), prend le relais. C’est le harness : le programme qui fait travailler le modèle de langage avec des outils, récupère leurs réponses et poursuit l’enquête. Dans mon intégration, le raisonnement utilise Sol 6.1.

Je lui raccorde quatre types d’accès : la documentation de l’infrastructure, les requêtes ClickHouse, les contrôles d’état des hôtes et les healthchecks des applications. L’accès aux données passe par le [MCP ClickHouse](https://github.com/ClickHouse/mcp-clickhouse), avec des requêtes dont la durée et le volume sont limités.

Le contexte explique quel service tourne où, comment je le déploie et quelles dépendances il utilise. Les runbooks donnent les vérifications utiles. Si une prévisualisation échoue, l’agent peut retrouver le worker concerné, regarder sa file de jobs et chercher les erreurs associées dans ClickHouse. C’est ce raccordement qui lui permet de passer d’une hypothèse à une vérification.

Je retrouve là une méthode très classique du métier. Le chapitre [Effective Troubleshooting du livre SRE de Google](https://sre.google/sre-book/effective-troubleshooting/) décrit cette progression : observer, formuler des hypothèses à partir de sa connaissance du système, puis chercher les éléments qui les confirment ou les écartent. Dans mon setup, les appels d’outils et leurs résultats restent enregistrés pour que je puisse relire le chemin suivi par l’agent.

J’en profite aussi pour compléter l’instrumentation. Pour comprendre un traitement asynchrone, il me faut sa file d’attente, ses erreurs et les traces de ses opérations. Un healthcheck HTTP vérifie que la route répond ; les métriques du worker montrent comment le travail avance. C’est la complémentarité entre observation externe et interne décrite dans [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/), appliquée à un cas assez concret.

## Un premier cas sur Media Review

Media Review est mon application pour relire mes articles en audio et commenter les vidéos que je monte avec un agent. Elle prépare notamment des prévisualisations en arrière-plan. Si ce traitement se bloque, je peux encore ouvrir l’interface, mais j’attends mon contenu.

Dans l’environnement de test, une métrique affiche un job en échec. OpenSRE regarde alors les jobs en attente, ceux en cours et l’activité récente du worker. Les files suivies restent vides, des opérations réussissent et le nombre de jobs échoués reste stable. Ça oriente l’enquête vers un échec déjà enregistré ; le worker continue à travailler.

L’investigation remonte aussi une piste plus intéressante : quinze erreurs côté base de données, quinze transactions en erreur et quinze prévisualisations échouées sur la même période. Ces trois catégories peuvent décrire les mêmes opérations. Il faut les recouper avant de compter trois fois le même problème.

Des prévisualisations réussissent pendant cette période. Je concentre donc la suite sur le chemin des opérations qui échouent : retrouver leurs traces, voir où apparaît l’erreur et comparer avec une opération réussie. J’ai un périmètre précis à examiner, avec des données déjà rassemblées.

<figure class="explanatory-diagram">
  <a href="/blog/timestral-opensre-observability/investigation-fr.svg" aria-label="Ouvrir le schéma en grand"><img src="/blog/timestral-opensre-observability/investigation-fr.svg" alt="Enquête Media Review : un compteur stable, une activité qui continue, trois comptages de quinze à recouper et des traces à comparer." width="720" height="1240" loading="lazy" decoding="async" /></a>
  <figcaption>Le cas Media Review : les trois comptages de quinze peuvent décrire les mêmes opérations. La suite consiste à recouper les traces et à comparer une prévisualisation échouée avec une opération réussie.</figcaption>
</figure>

Sur une autre application, que je garde anonyme, le contrôle relève un autre problème : le healthcheck répond HTTP 200, mais ClickHouse ne renvoie aucune métrique, aucun log ni aucune trace de cette application sur l’heure examinée. Là, je sais où reprendre : vérifier l’export de télémétrie pour retrouver de la visibilité sur le travail du worker.

Ces essais font aussi ressortir un ajustement à prévoir. Le bilan quotidien examine la veille, tandis que les outils actuels de l’agent lisent au maximum la dernière heure. Pour expliquer un problème survenu dans la nuit, il faut leur donner accès à la période concernée. C’est notamment nécessaire pour recouper les échecs de healthchecks et les hausses de charge observés sur une même période.

## Le déclenchement et le budget font partie du setup

J’ai maintenant deux points d’entrée. Chaque jour, Timestral analyse les métriques et le workflow lance une investigation consolidée avec OpenSRE. En parallèle, un lecteur surveille le dossier qui reçoit les alertes par mail. Lorsqu’une nouvelle alerte reconnue est encore récente et ouverte, il peut déclencher une enquête directement.

Le tri des messages suit des règles déterministes. Le modèle intervient au moment d’investiguer. Les doublons et les rappels d’un épisode déjà traité sont regroupés ou ignorés, et un message de rétablissement ferme l’épisode. Ça évite de relancer une enquête à chaque rappel.

Le budget est explicite : une enquête dispose de 24 appels d’outils et de quinze minutes au maximum. Le bilan quotidien autorise deux tentatives, une seule lorsque tout se passe bien. Le chemin des alertes autorise deux investigations supplémentaires par jour. Le plafond est donc de quatre tentatives automatiques, échecs compris, et un verrou empêche les enquêtes de se chevaucher.

Ces limites bornent le travail demandé au modèle. Le coût en tokens dépend ensuite de chaque enquête ; je garde les résultats pour évaluer ce que ces appels m’apportent. L’agent travaille en lecture seule et me remet un rapport. Les corrections et les déploiements restent sous mon contrôle.

## Pourquoi je garde cette expérimentation

J’avoue, je n’ai pas encore de chiffres pour comparer le temps de résolution avant et après. Avant, je réagissais surtout à ce qui remontait. Maintenant, j’ai aussi une analyse régulière des métriques et un agent qui commence à rassembler les données lorsqu’un signal mérite une enquête. Ça m’ajoute de la proactivité, et c’est déjà une raison suffisante pour continuer.

Je m’attends à gagner du temps sur le troubleshooting, notamment sur les premières vérifications que je répète à chaque incident. Les prochains rapports vont me permettre de voir lesquelles sont utiles, où l’agent tourne en rond et quel contexte lui manque. Je pourrai alors ajuster les outils et le budget à partir de cas que je connais.

La suite qui me tente, c’est d’aller jusqu’à une PR : retrouver le bon dépôt, proposer un correctif et le tester à partir du problème observé. Pour l’instant, je garde ce workflow dans mes outils et je vais continuer à le faire travailler sur mes applications. J’ai déjà des erreurs de prévisualisation à lui donner et une lecture de l’historique à améliorer.

Merci d’avoir pris le temps de me lire. Pour poursuivre, vous pouvez retrouver [mes autres articles sur The Unreliable Engineer](https://theunreliable.engineer/blog/), notamment ma série sur la gestion des agents OpenTelemetry.

Si vous cherchez à rendre votre télémétrie plus utile ou à intégrer un agent d’investigation dans votre équipe, je présente [mes accompagnements en observabilité et Agentic SRE](https://amineamanzou.fr/) sur mon site professionnel.

## Sources

Les références sont liées dans le texte : documentation Timestral, OpenSRE et MCP ClickHouse, publications TimesFM, Chronos et Moirai, documentation Dynatrace et Elastic, et chapitres du livre SRE de Google.

Les observations et les réglages décrits correspondent à mon expérimentation du 18 octobre 2026. Les autres outils sont cités pour situer les approches ; leur mention ne constitue pas un comparatif de performances sur mes applications.
