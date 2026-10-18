# Arbre généalogique commercialisation — Berceau

Berceau est un prototype de généalogie destiné aux familles francophones. Ce dépôt rassemble exclusivement la copie commerciale du projet; l’application personnelle et ses données ne sont pas incluses.

## Démarrer

- Application : ouvrir app/index.html dans un navigateur récent.
- Page de présentation : landing/index.html.
- Démonstration GEDCOM fictive : data/demo.ged (7 personnes, 2 familles).
- Schéma des données : data/schema.md.
- Convertisseur GEDCOM : outils/ged2arbre.mjs.

Les arbres, corrections et ajouts restent dans le navigateur de l’appareil. Un GEDCOM transporte les données généalogiques et les chemins de photo; la sauvegarde complète .berceau transporte aussi les images. Les deux formats sont différents.

## État de la copie commerciale

- Arbre interactif, fiches, recherche, consultation, thèmes et gestion locale de plusieurs arbres.
- Import et export GEDCOM, dont événements, notes, sources, mariages et références de média prises en charge par le convertisseur.
- Ajout et correction locale sans code serveur pour les arbres locaux.
- Photos optimisées, stockées dans IndexedDB.
- Sauvegarde et restauration .berceau.
- Jeu intégré et fichiers de démonstration remplacés par des données fictives.
- Corrections locales tirées de l’audit Grok : dates exactes impossibles rejetées, recherche qui ouvre l’arbre autour du résultat, impression qui prépare tous les profils, menu mobile réduit et sauvegarde accessible depuis l’action principale.
- Voix et partage de changements entre appareils ne sont pas annoncés comme disponibles. Les données locales ne sont pas synchronisées vers un serveur.
- Les corrections locales n’ont pas été déployées; elles doivent encore être retestées dans un navigateur avant toute présentation ou vente.

## Données à garder hors du dépôt

sauvegardes/, _ancien-prototype/, app/index.origine.html, les checkpoints et les exports réels sont exclus. Les versions historiques peuvent contenir des données familiales. Le jeu public de démonstration doit rester fictif.

## Documents

- VERIFICATION-AVANT-COMMERCIALISATION.md : état des vérifications et éléments encore à démontrer.
- AUDIT-GROK-2026-10-18.md : constats reçus et suivi des corrections.
- missions/A-FAIRE/ : mission B1-08 encore en attente.
- design/ : règles et jetons de présentation.

Ne déploie pas depuis ce dépôt sans décision explicite.