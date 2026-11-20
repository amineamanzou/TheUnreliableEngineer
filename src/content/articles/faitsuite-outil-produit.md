---
title: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
locale: "fr"
articleSlug: "faitsuite-outil-produit"
translationKey: "faitsuite-outil-produit"
publishedAt: "2026-11-19"
label: "Expérimentations / SRE"
readTime: "5 min"
excerpt: "D'un audio transféré sur mon Mac à l'analyse des décisions et des engagements : comment FaitSuite a évolué, et le besoin métier qui guide la suite."
seoTitle: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
seoDescription: "D'un audio transféré sur mon Mac à l'analyse des décisions et des engagements : comment FaitSuite a évolué, et le besoin métier qui guide la suite."
heroImageAlt: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
---

Au départ, je transférais l'audio d'une réunion sur mon Mac avec AirDrop. Je voulais retrouver ce qui s'était dit sans réécouter tout l'enregistrement. Un fichier, une transcription, un traitement sur ma machine : le premier usage tenait dans ce parcours assez simple.

Je travaille sur ce projet depuis plusieurs mois. Il s'appelait Meeting Memory ; je l'appelle aujourd'hui FaitSuite. Entre les deux noms, le besoin a pris de la place. Avoir la transcription m'évitait de repartir de l'audio. Il restait pourtant à retrouver une décision, comprendre un engagement et savoir ce que j'avais moi-même promis de faire.

C'est cette évolution qui m'intéresse quand je regarde le produit. Je peux encore passer du temps sur ses écrans, mais ce qui justifie de continuer à le développer se joue dans l'exploitation des réunions.

### Du fichier sur mon Mac au contexte que je veux retrouver

J'ai commencé avec mon propre usage, puis déporté le pipeline audio vers mon NAS. Ce déplacement m'a permis de travailler sur la suite : que faire de la transcription une fois qu'elle existe ?

Un résumé aide à reprendre le fil d'une réunion. Quand je reviens sur un sujet quelques jours plus tard, je cherche souvent quelque chose de plus précis. Qui s'est engagé sur quoi ? Quelle décision avait été prise ? Qu'est-ce qui est encore une proposition ? Et moi, dans cet échange, qu'est-ce que j'ai accepté de faire ?

Ces questions ont guidé le travail sur l'analyse agentique, à partir des éléments produits par le traitement audio. Je veux extraire des informations qui pourront servir après la réunion, tout en gardant le lien avec ce qui a réellement été dit. Une action rédigée proprement mais attribuée à la mauvaise personne me crée du travail supplémentaire. Je dois pouvoir revenir au passage qui la justifie et corriger l'interprétation.

Cela change aussi la manière dont je pense la mémoire. Une réunion apporte du contexte à une personne, à un projet ou à une discussion déjà commencée. Si tout reste enfermé dans un résumé par fichier, je dois faire les rapprochements moi-même à chaque reprise.

### Comprendre qui parle, puis ce que cela implique

Je me suis intéressé à la séparation des voix et aux échantillons vocaux pour retrouver qui parle quand. Pour exploiter les engagements, cette attribution compte autant que les mots transcrits. « Je m'en occupe » ne donne pas une action utilisable tant qu'on ne sait pas à qui ce « je » correspond.

Cela demande de distinguer plusieurs étapes. Séparer deux voix ne donne pas automatiquement leur identité. Un nom suggéré par le contexte reste à vérifier ; un profil vocal doit avoir été validé avant de servir de référence. Je préfère garder une attribution à confirmer plutôt que faire circuler un engagement avec un nom qui paraît certain.

J'ai aussi exploré l'analyse des sentiments et travaillé sur les statistiques. Ce sont des pistes pour mieux comprendre les échanges, avec leurs limites : une mesure ou une interprétation ne dispense pas de relire le passage. Je veux surtout qu'elles aident à poser une question utile sur une réunion, plutôt qu'ajouter des indicateurs parce que je sais les calculer.

Le fil qui relie ces travaux reste concret : retrouver ce qui a été décidé, ce que les autres ont promis et ce que j'ai promis, avec assez de contexte pour m'en servir.

### Le mode privé fait partie de la valeur du produit

Les réunions peuvent contenir des informations qu'on n'a aucune envie d'envoyer à un service supplémentaire. J'ai donc donné une place importante au parcours entièrement privé, avec des modèles locaux pour le traitement de ces données. La confidentialité a influencé la construction du produit dès ce parcours, au-delà du choix d'une option dans les réglages.

L'éthique intervient aussi dans ce qu'on accepte d'inférer. Une analyse de sentiments reste une interprétation d'un échange ; je ne veux pas lui donner le statut d'un fait sur une personne. Le même principe vaut pour une identité, une promesse ou une décision : il faut pouvoir comprendre d'où vient l'information et la remettre en question.

Pour quelqu'un qui utiliserait FaitSuite, la valeur dépendra aussi de cette confiance. Retrouver rapidement une action m'aide seulement si je peux vérifier qu'elle correspond à la réunion et si son traitement respecte la confidentialité attendue.

### Ouvrir le produit à d'autres usages

J'ai ensuite travaillé sur une version Cloud. Le besoin d'une équipe ajoute encore une autre dimension : plusieurs personnes pourraient vouloir partager le contexte des mêmes réunions, puis le retrouver dans leur travail. Ce partage de contexte reste un chantier à construire ; je ne le présente pas comme une fonction disponible aujourd'hui.

C'est là que mon outil personnel commence à poser des questions de produit. Quelqu'un qui arrive avec ses propres réunions cherche-t-il les mêmes informations que moi ? A-t-il surtout besoin de retrouver une décision, de suivre ses engagements ou de préparer la discussion suivante ? Et dans quelles conditions accepterait-il que ces informations soient traitées et partagées ?

La partie agentique est celle sur laquelle je veux concentrer la différence de FaitSuite : aider à exploiter ce qu'une réunion contient, au-delà de sa transcription et de son résumé. Je dois encore confronter cette proposition aux usages d'autres personnes. Leur manière de retrouver une promesse, de vérifier une attribution ou de protéger un contexte me dira quoi construire ensuite.
