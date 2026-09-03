---
title: "Comment une petite dépendance devient un incident visible par tout le monde"
locale: "fr"
articleSlug: "petite-dependance-grand-incident"
translationKey: "small-dependency-large-incident"
publishedAt: "2026-09-14"
label: "Incident / Dépendances"
readTime: "10 min"
excerpt: "Une dépendance reste petite dans l’inventaire jusqu’au jour où son indisponibilité traverse les produits, les équipes et les parcours utilisateurs."
seoTitle: "Petite dépendance, grand incident : comprendre la propagation"
seoDescription: "Postmortems, graphe de dépendances et observabilité : comprendre comment un petit composant propage un incident à toute une plateforme."
heroImage: "/blog/petite-dependance-grand-incident/hero-blast-radius.svg"
heroImageAlt: "Un petit composant propage une panne à plusieurs services et parcours utilisateurs"
---

Fin mars 2024, Andres Freund ne cherche pas une backdoor. Il cherche pourquoi des connexions SSH prennent environ une demi-seconde de trop et pourquoi `valgrind` signale un comportement étrange. L’enquête descend dans le processus, traverse `libsystemd`, puis arrive dans `liblzma`, la bibliothèque de compression de XZ Utils.

Le détail est inconfortable : `sshd` n’avait pas ajouté une fonctionnalité de compression XZ. Sur certaines distributions, OpenSSH était lié à `libsystemd`, qui dépendait elle-même de `liblzma`. Une bibliothèque située plusieurs étages plus bas pouvait donc exécuter du code dans le processus chargé d’accepter les connexions distantes.

Dans son [message original sur oss-security](https://www.openwall.com/lists/oss-security/2024/03/29/4), Freund prend soin de distinguer ce qu’il a observé de ce qu’il n’a pas encore analysé. Il décrit les versions 5.6.0 et 5.6.1 de XZ, un script de build obfusqué et des fichiers de test utilisés pour injecter du code. Il donne aussi les conditions dans lesquelles il parvient à reproduire le ralentissement. Ce niveau de prudence raconte mieux l’incident qu’une phrase disant « une dépendance a piraté Linux ».

Vous allez peut-être me répondre que XZ est un cas exceptionnel et qu’on ne peut pas traiter chaque mise à jour comme une opération d’espionnage. Je suis d’accord. Le but n’est pas de transformer une équipe plateforme en laboratoire d’analyse forensique. Le cas XZ nous oblige plutôt à regarder une chose que nos inventaires montrent mal : jusqu’où une dépendance peut-elle réellement aller quand elle entre dans notre système ?

### La propagation ne suit pas l’organigramme

Sur un tableau d’architecture, la chaîne pourrait sembler simple : un client appelle `sshd`, puis le service traite l’authentification. Le graphe chargé en mémoire est plus intéressant :

`sshd` → `libsystemd` → `liblzma` → code issu du paquet XZ compromis.

Le chemin complet ajoute encore des étapes : une archive source est publiée, un système de build active certaines conditions, une distribution prépare ses paquets, une machine installe la version, puis le chargeur dynamique assemble les bibliothèques au démarrage. Une décision prise dans un projet de compression finit dans un processus de sécurité réseau.

[Red Hat a classé le problème sous CVE-2024-3094](https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users) et a demandé aux utilisateurs des versions de développement concernées d’arrêter l’usage et de revenir à une version antérieure. Le périmètre est essentiel : l’attaque concernait des versions et des environnements précis, et la détection est arrivée avant qu’elles atteignent une grande partie des distributions stables. L’impact potentiel était énorme. L’impact réellement observé est resté beaucoup plus borné.

Cette différence entre potentiel et propagation réelle est le premier travail d’une équipe d’incident. « Utilisons-nous XZ ? » ne suffit pas. Il faut demander : quelle version, construite par qui, depuis quel artefact, sur quels actifs, chargée par quels processus, exposés à quels utilisateurs ?

Sur le papier, cette liste paraît exigeante. Pendant un incident, elle devient très concrète : quelqu’un attend une décision de retrait, une équipe veut savoir si elle doit réveiller tout le monde et le métier demande quels utilisateurs sont exposés. Si nous ne savons répondre qu’à la première question, « le paquet est-il quelque part dans le parc ? », nous avons encore une grande partie du chemin à reconstruire sous pression.

### Petite dépendance décrit sa place dans notre attention

XZ Utils compresse et décompresse des données. C’est une fonction étroite, ancienne, attendue. Justement le genre de composant qu’une équipe installe une fois et oublie. Il n’a pas besoin d’être visible dans l’interface utilisateur pour être présent partout.

La taille d’un dépôt, le nombre de mainteneurs et le volume de code ne donnent pas la taille de son rayon d’impact. Une bibliothèque compacte placée sur un chemin commun peut toucher des milliers de machines. À l’inverse, un énorme service isolé derrière une interface rarement appelée peut rester contenu.

Il existe aussi une dépendance humaine. Un composant critique peut être maintenu par très peu de personnes, recevoir des demandes incessantes et s’intégrer à des distributions beaucoup plus riches que le projet lui-même. Cette dimension interdit déjà de réduire la supply chain à une liste de versions.

Cela ne signifie pas qu’une entreprise doit auditer manuellement chaque mainteneur avant chaque montée de version. Ce serait intenable et probablement inefficace. En revanche, elle peut réserver ses exigences les plus fortes aux dépendances qui se retrouvent sur beaucoup de chemins critiques. Le niveau de contrôle suit alors l’exposition, pas la popularité du dépôt.

Un arbre de dépendances montre qui importe quoi. Il ne montre pas forcément qui peut publier une release, modifier le pipeline, signer l’artefact, changer une option de compilation ou exercer une pression sur le mainteneur. Ce sont pourtant des arêtes du même graphe de risque.

### Un inventaire répond à la première minute, pas à la dernière

Quand une alerte arrive, le lockfile aide. Un scanner de composition logicielle aide. Un SBOM aide. La [CISA définit le SBOM comme un inventaire imbriqué, lisible par machine, des composants et de leurs relations](https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf). Avec les versions, les fournisseurs et les dépendances, une équipe peut réduire très vite la liste des actifs à examiner.

« Nous avons déjà un scanner et nous générons des SBOM », me direz-vous peut-être. C’est une excellente première brique. La question suivante consiste à prendre une alerte réelle et à mesurer le temps nécessaire pour passer de ce document à la liste des workloads exposés. C’est souvent à cet endroit que l’inventaire théorique rencontre la réalité du parc.

Le document de la CISA précise aussi qu’un SBOM ne résout pas seul tous les problèmes de supply chain. Cette limite se voit très bien ici. L’inventaire peut dire qu’une version de XZ est installée. Il doit encore être relié aux machines réellement en production, à l’image de conteneur déployée, au binaire chargé et à l’exposition du service. Un fichier généré pendant la CI puis rangé dans un bucket ne donne pas cette réponse.

Un scanner de vulnérabilités rencontre une autre limite : il lui faut un signal connu. Entre la publication d’un artefact malveillant et l’attribution d’une CVE, le composant peut passer comme « sans vulnérabilité connue ». L’absence d’alerte signifie alors seulement que la base consultée ne contient pas encore l’histoire.

Le [Scorecard d’OpenSSF](https://openssf.org/projects/scorecard/) automatise des vérifications sur la posture d’un projet open source : protections de branche, mises à jour, pratiques de release et autres signaux de risque. C’est utile pour prioriser. Un score ne certifie pas l’absence d’un acteur patient, d’un build détourné ou d’un artefact différent du dépôt audité.

### Le signal qui sauve l’enquête peut ressembler à du bruit

L’incident XZ n’a pas commencé par une alerte intitulée « tentative de prise de contrôle de SSH ». Il a commencé par de la latence et un comportement de processus incohérent. La détection a fonctionné parce qu’une personne connaissait assez le système pour considérer ces symptômes comme anormaux et a continué à descendre la pile.

Cette histoire ne commande pas de créer une alerte pour chaque demi-seconde. Ce serait une excellente fabrique à bruit. Elle rappelle qu’une défense de supply chain a besoin de signaux à plusieurs niveaux : intégrité des artefacts, provenance du build, changements de dépendances, comportement des processus et symptômes vus par l’utilisateur.

Les contrôles se complètent. La provenance permet de comparer ce qui a été construit avec ce qui devait l’être. Le SBOM permet de chercher où le composant est présent. La télémétrie permet de voir qu’un processus fait quelque chose d’inattendu. L’inventaire des actifs permet de trouver qui doit agir. La capacité à revenir en arrière réduit le temps pendant lequel l’équipe débat devant un tableau rouge.

Cela change aussi la manière de revoir une mise à jour de dépendance. Le diff visible peut ne contenir qu’un numéro de version, alors que le changement opérationnel comprend une nouvelle archive, des scripts de build, un signataire différent, des dépendances transitives modifiées et de nouveaux chemins dans des processus persistants. L’effort de revue devrait suivre le comportement atteignable et le rayon d’impact, pas le nombre de lignes modifiées.

Là encore, personne n’a le temps de monter un dossier de vingt pages pour chaque patch. Une mise à jour mineure sur un chemin d’authentification commun mérite simplement plus de preuves qu’un changement plus large dans un outil de développement isolé. Ces preuves peuvent inclure un build reproductible, des attestations de provenance, le diff du SBOM généré et un canary qui observe le comportement du processus avant un déploiement plus large.

Le dossier de revue doit rester attaché à l’artefact afin que l’équipe d’incident puisse le retrouver sans reconstruire la release depuis l’historique d’un chat.

### La bonne question d’incident traverse le graphe

Une équipe peut préparer cette réponse sans acheter un nouveau dashboard ni lancer un programme de six mois. Elle choisit une dépendance commune, déjà présente sur un parcours critique, et se donne une heure pour mener l’exercice :

1. retrouver toutes les versions présentes dans les builds et les environnements ;
2. relier chaque artefact à sa source et à son pipeline de construction ;
3. identifier les processus qui chargent la bibliothèque ou appellent le service ;
4. déterminer quels parcours utilisateurs dépendent de ces processus ;
5. simuler le blocage d’une version et le retour à la précédente ;
6. mesurer le temps nécessaire pour obtenir une liste d’actifs fiable.

Un point de blocage possible se trouve à la troisième étape. L’équipe sait qu’un paquet existe, mais pas quel binaire le charge. Ou elle sait quels conteneurs ont été construits, mais pas lesquels tournent encore. C’est là que l’arbre dessiné cesse d’être décoratif : chaque arête inconnue ajoute du temps pendant l’incident.

Vous ne terminerez peut-être pas les six étapes lors du premier essai. Ce n’est pas un échec. Le premier lien impossible à établir vous donne précisément la prochaine amélioration utile : enrichir l’inventaire de déploiement, conserver la provenance ou documenter le retour arrière. Au deuxième exercice, le chemin sera déjà moins opaque.

Une petite dépendance devient visible par tout le monde lorsque son chemin atteint une fonction que tout le monde utilise. La compression arrive dans SSH, le parseur arrive dans l’API, la librairie de dates arrive dans la facturation. La taille perçue du composant n’a jamais protégé le système. Ce qui protège l’équipe, c’est sa capacité à parcourir le chemin assez vite pour savoir où couper.

## Sources

- [Andres Freund — original oss-security report](https://www.openwall.com/lists/oss-security/2024/03/29/4)
- [Red Hat — urgent security alert for CVE-2024-3094](https://www.redhat.com/en/blog/urgent-security-alert-fedora-41-and-rawhide-users)
- [CISA — 2025 Minimum Elements for an SBOM](https://www.cisa.gov/sites/default/files/2025-08/2025_CISA_SBOM_Minimum_Elements.pdf)
- [CISA — SBOM Resources Library](https://www.cisa.gov/topics/cyber-threats-and-advisories/sbom/sbomresourceslibrary)
- [OpenSSF — Scorecard](https://openssf.org/projects/scorecard/)
