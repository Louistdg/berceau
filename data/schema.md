# Modèle de données

Ce format compact décrit data/demo.json. L application principale convertit le GEDCOM dans son modèle FAMILY_DATA, qui contient aussi événements, sources et familles détaillés.

## Structure

```json
{
  "version": 1,
  "famille": "Brumeclair (fictif)",
  "racineId": "p1",
  "personnes": [ { "id": "p1", "...": "..." } ]
}
```

## Une personne

| Champ | Type | Obligatoire | Remarque |
|---|---|---|---|
| `id` | chaîne | oui | unique, généré par l'application |
| `prenom` | chaîne | oui | peut contenir apostrophes et accents |
| `nom` | chaîne | non | |
| `sexe` | `"H"` \| `"F"` \| `""` | non | `""` = inconnu, ne pas deviner |
| `naissance.date` | chaîne | non | `AAAA-MM-JJ`, ou `AAAA`, ou `""` |
| `naissance.lieu` | chaîne | non | |
| `deces.date` | chaîne | non | vide = vivant (si le lieu est vide aussi) |
| `deces.lieu` | chaîne | non | |
| `note` | chaîne | non | texte libre |
| `pereId` | chaîne \| null | non | |
| `mereId` | chaîne \| null | non | |
| `conjointsIds` | tableau | non | réciproque : si A a B, B doit avoir A |

## Règles de vérité

1. **La parenté est portée par l'enfant.** `pereId` / `mereId` sur l'enfant, jamais de liste
   d'enfants stockée. Les enfants d'un couple se retrouvent en filtrant
   `personnes` sur `pereId`/`mereId`.
2. **La fratrie se déduit des parents partagés**, pas d'une liste.
3. **`conjointsIds` est symétrique.** Toute écriture doit mettre à jour les deux côtés.
4. **Supprimer une personne** impose de retirer son `id` de tous les `pereId`, `mereId` et
   `conjointsIds` — sinon on obtient des liens orphelins.
5. **`racineId`** désigne la personne de départ (celle qui est en bas au centre de l'arbre).

## Générations

`generation(p) = 0` pour la racine. Un parent vaut `generation(enfant) - 1`, un enfant vaut
`generation(parent) + 1`, un conjoint prend la génération de son partenaire. Calcul par parcours
depuis la racine, avec protection contre les cycles (une donnée importée peut en contenir).

## Vivant / décédé

Les informations familiales restent locales dans ce prototype. Ne publie pas ce fichier s'il contient des personnes vivantes ou des dates identifiantes.