---
title: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
locale: "fr"
articleSlug: "faitsuite-outil-produit"
translationKey: "faitsuite-outil-produit"
publishedAt: "2026-11-19"
label: "Expérimentations / SRE"
readTime: "4 min"
excerpt: "Une réunion se termine. L’enregistrement existe, mais la décision qu’il faudra retrouver dans quinze jours est encore quelque part dedans. C’est cette friction que je veux traiter avec FaitSuite, le projet que j’appelais Meeting Memory."
seoTitle: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
seoDescription: "Une réunion se termine. L’enregistrement existe, mais la décision qu’il faudra retrouver dans quinze jours est encore quelque part dedans. C’est cette fric"
heroImageAlt: "FaitSuite : passer de mon outil à un produit que d’autres utiliseraient"
---

Une réunion se termine. L’enregistrement existe, mais la décision qu’il faudra retrouver dans quinze jours est encore quelque part dedans. C’est cette friction que je veux traiter avec FaitSuite, le projet que j’appelais Meeting Memory.

Je pars d’un besoin que je comprends : enregistrer, retrouver les réunions et exploiter ce qui s’y est dit. Dès que je prépare une utilisation par quelqu’un d’autre, les questions changent. Où voit-on ses réunions sur iPhone ? Que signifie une bibliothèque privée ? Quel écran permet de comprendre ce qui a réellement été traité ? Un bouton disponible dans mon setup ne suffit pas à rendre ce parcours évident.

### Le produit apparaît entre deux écrans

Un exemple a surgi pendant le travail sur l’application iOS. La vue Enregistrer mettait les derniers enregistrements au premier plan alors que je voulais retrouver les réunions. J’ai choisi une page Réunions avec un bouton Enregistrer. Ce choix paraît minuscule. Il remet pourtant l’objet que je cherche au centre du parcours, plutôt que le mécanisme qui le produit.

La vue Statistiques a posé une autre question dans le contexte d’une bibliothèque privée : qu’est-ce que l’application doit montrer quand les réunions existent déjà ? Le message qui invite simplement à connecter une bibliothèque ne répond pas à ce besoin. Je garde cet exemple comme problème de parcours ; cet article ne vaut pas annonce de disponibilité de toutes les corrections sur toutes les versions.

### Mon raccourci devient le support de quelqu’un

Sur ma machine, je sais quel traitement a tourné et où regarder quand il manque un résultat. Une personne qui découvre le produit doit pouvoir comprendre l’état depuis l’application. Je dois lui montrer ce qui est prêt, ce qui attend et ce qui a échoué, sans lui demander de reconstruire mon raisonnement.

Je tiens aussi à préserver la frontière de confidentialité. Un mode privé doit garder son sens au moment où le système traite un enregistrement sensible. Ajouter un service externe par commodité de développement peut changer le contrat que l’utilisateur croyait avoir choisi.

Ces contraintes rendent certaines démonstrations moins spectaculaires. Elles donnent surtout une manière plus précise de décider quoi terminer avant une ouverture : un parcours utilisable, un état compréhensible et une limite de données explicite.

Je prépare FaitSuite pour qu’il sorte de mon usage personnel. Je n’ai pas encore, dans cet article, de preuve qu’un public reviendra chaque semaine ou acceptera de payer. C’est la prochaine inconnue à tester, après avoir rendu le parcours assez clair pour que quelqu’un puisse vraiment l’essayer.
