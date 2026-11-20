---
title: "Automatiser ma création de contenu : où je garde la main"
locale: "fr"
articleSlug: "automatiser-contenu-garder-main"
translationKey: "automatiser-contenu-garder-main"
publishedAt: "2026-12-03"
label: "Expérimentations / SRE"
readTime: "4 min"
excerpt: "Une idée de sujet tient parfois en deux phrases prononcées entre deux tâches. Pour en faire un article, il reste à chercher les sources, trouver un angle, écrire, traduire et relire. Je veux automatiser une partie de cette chaîne parce que la répétition me coûte de l’attention. Je veux aussi pouvoir reconnaître ce que je publie."
seoTitle: "Automatiser ma création de contenu : où je garde la main"
seoDescription: "Une idée de sujet tient parfois en deux phrases prononcées entre deux tâches. Pour en faire un article, il reste à chercher les sources, trouver un angle, "
heroImageAlt: "Automatiser ma création de contenu : où je garde la main"
---

Une idée de sujet tient parfois en deux phrases prononcées entre deux tâches. Pour en faire un article, il reste à chercher les sources, trouver un angle, écrire, traduire et relire. Je veux automatiser une partie de cette chaîne parce que la répétition me coûte de l’attention. Je veux aussi pouvoir reconnaître ce que je publie.

Le calendrier de fin d’année m’a donné une bonne contrainte. J’ai demandé un article par semaine dans les deux langues, sur deux sites qui n’ont pas le même rôle. The Unreliable Engineer accueille mes expérimentations d’entrepreneur, de freelance et de SRE. Mon site professionnel porte davantage les questions d’observabilité. Distribuer le même texte partout aurait simplifié le pipeline et raté le besoin.

### Le sujet reste une décision éditoriale

Les premières propositions étaient trop génériques. Puis une série consacrée à OpAMP prenait trop de place. J’ai limité le protocole Rust à un article et gardé davantage d’actualité et de cas réels. Ces corrections sont des choix sur ce que je veux raconter. Un validateur de style ne peut pas les prendre à ma place.

Je peux en revanche faire préparer un dossier de sources, vérifier une paire de traductions et repérer certaines tournures qui ne me ressemblent pas. Quand une affirmation ne repose que sur une hypothèse, je veux retrouver cette limite avant qu’elle ne devienne un souvenir écrit à la première personne.

### Écouter change ma relecture

Pour ce cycle, j’ai demandé une PR par article, puis un audio de lecture dans Media Review. L’audio sert à relire le texte autrement. Une phrase qui paraît fluide à l’écran peut devenir interminable quand on l’entend ; une transition trop parfaite peut aussi sonner comme une brochure.

La demande de revue doit rester attachée au texte exact. Si l’agent corrige un paragraphe après mon écoute, la version précédente ne couvre plus automatiquement ce passage. Je veux pouvoir retrouver le retour, la correction et la version qui en résulte.

### Le dernier kilomètre reste visible

Ma règle pour ce chantier est explicite : les agents peuvent fusionner après traitement des retours Media Review et réussite des contrôles techniques. Une revue vide encore en attente ne compte pas comme un accord. Cette règle décrit le fonctionnement demandé ; elle ne prouve pas que toutes les étapes de la chaîne sont déjà automatisées.

Ce que j’essaie de retirer, c’est le transport manuel entre les étapes : recopier le même brief, retrouver une version et demander à nouveau où en est un article. Je garde les décisions d’angle et la lecture finale parce qu’elles déterminent ce que j’assume sous mon nom.
