# Vérification avant commercialisation

Périmètre : copie commerciale D:\01 - PROJETS\Berceau uniquement. L’application personnelle et ses données n’ont pas été consultées ni modifiées pour cette mission.

## Corrections locales après l’audit Grok

- L’arbre intégré et les données GEDCOM/JSON de démonstration sont fictifs.
- L’ajout et la correction d’une fiche sont conservés localement sur les arbres configurés pour les modifications locales.
- L’import GEDCOM rejette désormais les dates jour/mois/année impossibles, par exemple 31 FEB 2025.
- Une recherche sélectionnée change le point de vue de l’arbre pour afficher la personne trouvée.
- La sauvegarde complète .berceau est accessible depuis l’action principale; en l’absence d’une URL de partage configurée, « Partager » propose aussi cette sauvegarde au lieu de copier un lien qui ne contient pas les modifications locales.
- L’impression prépare la vue avec toutes les personnes et remet l’affichage précédent après l’aperçu.
- Sur téléphone, le menu devient un volet latéral avec fond de fermeture; les principales cibles tactiles atteignent 44 px.
- Le bouton de fusion n’est ajouté que si le registre contient au moins deux arbres.
- Le rechargement automatique après inactivité a été retiré pour ne pas interrompre la consultation ou les modifications locales.
- L’import/export GEDCOM, les événements, notes, sources, mariages, sauvegardes et photos existaient déjà dans le code local; leur parcours complet après ces changements reste à rejouer.

## État de vérification

Aucun test navigateur n’a été exécuté après les changements de cette mission. La console, les huit thèmes, l’aperçu d’impression, le GEDCOM aller-retour, les sauvegardes/restaurations et les parcours tactiles doivent être vérifiés sur une copie locale avec un profil indépendant.

Aucun déploiement n’a été fait. La version en ligne reste distincte de cette copie locale et ne doit pas être présentée comme corrigée tant qu’elle n’a pas été mise à jour et vérifiée.

## Avant une démonstration publique

- Utiliser exclusivement le jeu fictif et vérifier à l’écran qu’aucun détail familial réel ne reste visible.
- Rejouer les parcours indiqués ci-dessus, lire la console, essayer 390 px et un ordinateur, puis vérifier une vraie impression PDF.
- Vérifier le partage, la portée de la sauvegarde et les limites de GEDCOM avec des fichiers fictifs.
- Garder sauvegardes/, _ancien-prototype/, app/index.origine.html et les checkpoints hors du dépôt public.

## Transport des photos

Un export GEDCOM standard conserve des références de fichiers; il ne transporte pas leurs octets. La sauvegarde .berceau inclut l’arbre et les photos. Ce fichier contient des données familiales et doit rester privé.