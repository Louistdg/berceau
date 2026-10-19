# Berceau — arbre familial

Arbre généalogique en ligne, en français, pensé pour des familles : lecture simple, gros textes, navigation au doigt.

**Démonstration en ligne :** https://berceau.socle-construction.be

> Les 469 personnes de la démonstration sont **fictives**. Aucune donnée familiale réelle n'est présente dans ce dépôt.

## Ce que fait l'application

- arbre généalogique interactif (ancêtres, descendance, vue familiale, vue éventail) ;
- fiches de personnes : dates, lieux, photos, notes, sources ;
- recherche, annuaire, calendrier familial ;
- pages de lecture : **Les noms**, **Chronologie**, **Les lieux** ;
- **10 thèmes** de couleurs, dont un thème sombre par défaut ;
- import **GEDCOM** (`.ged`) et export SVG ;
- sauvegarde `.berceau` (arbre + photos) ;
- impression.

## Technique

Une seule page HTML autonome, sans framework, sans dépendance, sans build :

```
app/index.html   ~776 Ko   l'application entière
app/favicon.svg
data/demo.ged    fichier GEDCOM fictif (7 personnes) pour tester l'import
data/liens-archives.json   annuaire de portails d'archives (page « Chercher un acte »)
design/          règles visuelles et jetons de couleurs
outils/          convertisseur GEDCOM et blocs d'interface
docs/            fiche projet et historique des mises à jour
```

## Lancer en local

```bash
cd app
python -m http.server 8000
# http://localhost:8000/
```

Ne pas ouvrir `index.html` en `file://` : la page interroge `../data/berceau-archives.json` et `/api/contributions`.

## Données et vie privée

Tout est stocké dans le navigateur (`localStorage`, `IndexedDB` pour les photos). Aucun compte, aucun serveur, aucune requête tierce.

## Licence

Projet privé — tous droits réservés. Contact : Louis Masson.
