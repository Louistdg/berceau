# Audit Grok — constats et corrections locales

Date du rapport source : 18 octobre 2026. Grok a audité une version publiée à 12:21 UTC et une copie locale de cette page, en profil Chrome vierge. Téléphone réel, coupure réseau réelle, impression PDF et plusieurs parcours n’ont pas été testés dans son rapport.

## Constats principaux reçus

1. L’édition et l’ajout échouaient sans code familial côté serveur.
2. Les noms masqués de l’arbre de démonstration laissaient dates, communes, métiers et liens permettant de reconnaître une famille réelle.
3. L’import perdait des notes et des détails de mariage, et acceptait une date impossible.
4. Une recherche ouvrait la fiche mais ne montrait pas la personne dans l’arbre.
5. La sauvegarde locale et la restauration sur un autre navigateur n’étaient pas accessibles depuis le parcours principal.
6. Les libellés de navigation étaient redondants; la fusion n’avait aucun choix avec un seul arbre.
7. Sur téléphone, le menu recouvrait l’arbre et plusieurs commandes étaient trop petites.
8. L’impression ne développait pas les branches fermées.
9. Le rechargement automatique après inactivité pouvait interrompre une session.
10. La voix n’est pas une fonction à ajouter à la première version; le rapport conseille de la différer.

Le rapport recommande de ne pas créer de comptes, de synchronisation familiale ou de rapprochement sur le seul nom « Unknown ». Les photos sont déjà disponibles localement; elles sont transportées avec l’arbre par le fichier .berceau, pas par les octets d’un GEDCOM.

## Suivi dans la copie commerciale

- Fait localement : jeu intégré et fichiers de démonstration remplacés par des données entièrement fictives.
- Fait localement : ajout et correction sans code pour les arbres marqués modifiables localement.
- Fait localement : dates GEDCOM exactes impossibles rejetées pendant la conversion.
- Fait localement : choisir un résultat de recherche recentre la vue de l’arbre autour de la personne.
- Fait localement : sauvegarde .berceau reliée à l’action principale et au bouton de partage quand aucun lien serveur n’est configuré.
- Fait localement : impression préparée avec toutes les personnes, puis restauration de la vue initiale.
- Fait localement : volet mobile limité en largeur, fermeture par le fond et cibles principales de 44 px.
- Fait localement : commande de fusion masquée avec moins de deux arbres; commande Mermaid retirée de la colonne latérale.
- Fait localement : retrait du rechargement automatique après inactivité.
- Déjà présent dans le code local : extraction et export des événements, notes, sources, mariages et références de médias; sauvegarde/restauration .berceau; stockage photo IndexedDB.
- À vérifier : tous les parcours navigateur, console, huit thèmes, import/export avec fichiers représentatifs, impression PDF, fonctionnement sur téléphone réel et stockage plein.
- Non fait : aucun déploiement; aucune modification de l’application personnelle.

La version publiée auditée par Grok reste inchangée par ces corrections locales. Les changements ne peuvent pas être annoncés aux familles avant publication séparée et contrôle navigateur.

## Périmètre du dépôt commercial

Le dépôt s’appelle temporairement Louistdg/notre-histoire-; il sera renommé par le propriétaire. Il contient uniquement la copie commerciale et les exemples fictifs. Ne pas y ajouter l’application personnelle, sauvegardes/, _ancien-prototype/, app/index.origine.html ni des exports généalogiques réels.