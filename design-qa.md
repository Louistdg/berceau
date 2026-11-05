# Vérification de Berceau commercial — maquette 3

Source visuelle : `C:\Users\louis\.codex\generated_images\01a175f1-a858-7942-97f0-51e1fc594aba\exec-cfa7d64e-6b43-419e-9a84-f934551d710a.png` (1488 × 1056 pixels).

Capture desktop : `D:\04 - SAUVEGARDES\2026-10-26\agent-vega-mission-interface-professionnelle-veyran\berceau-commercial-review\captures\07-apres-final-desktop.png` (1424 × 929 pixels CSS, densité 1).

État : arbre familial, thème Horizon, fiche Gabriel ouverte. Source et résultat ouverts ensemble avec view_image ; comparaison de composition à leur ratio natif, sans prétention à une identité pixel par pixel puisque le jeu de données existant est conservé.

## Surfaces contrôlées

- Typographie : noms serif, commandes sans-serif, nom complet en fiche ; prénom et nom abrégés sur les cartes avec nom accessible complet conservé.
- Composition : rail 154 px, fiche 378 px, arbre occupant l'espace restant ; dock inférieur et menus secondaires cohérents avec le concept.
- Couleurs : ivoire, bleu-vert, sélection sauge, contours fins ; conservation des autres thèmes existants.
- Images : avatars et illustrations fictives existants conservés ; aucune photographie réaliste inventée introduite dans les données.
- Texte : informations provenant des données existantes ; dates françaises en fiche ; sources absentes présentées comme telles. Parenté calculée depuis la personne de départ sur les liens enregistrés.

## Historique des corrections

Première comparaison : débordement du prénom Madeleine, dock recouvrant la carte basse, dérive de hauteur du rail, dates techniques et panneau de photo précédant l'identité. Corrections : troncature mesurée, réserve basse, grille bornée, date formatée et photo dans Détails. Capture desktop finale inspectée après corrections.

Relecture fonctionnelle : option fratries devenue inaccessible avec l'ancienne légende masquée ; label et gestionnaire existants déplacés dans Explorer. Revue du parcours de parenté, des observateurs et de la sélection d'arbre effectuée.

Mobile : contrôle direct à 500 px et pages de contrôle contenant une application de 390 × 844 et 320 × 740 px (le navigateur extérieur impose 500 px). Les captures encadrées incluent une marge grise appartenant au support de test. Décalage du panneau mobile corrigé à gauche de 64 px ; contrôles principaux agrandis à 44 px.

## Interactions vérifiées

Ouverture de l'arbre, recherche par nom, sélection d'un résultat, fiche, Détails, formulaire de correction et annulation, changement de génération, zoom, Explorer et fermeture, onglets clavier. Export réel `.berceau` téléchargé puis relu : format `berceau-backup`, version 1, 469 personnes, 0 photo utilisateur. Les dix illustrations de démonstration de l'album restent distinctes des photos utilisateur.

Syntaxe : `node verify.mjs` vérifie 28 scripts et 10 illustrations. `node --check app/maquette3.js` et `git diff --check` réussissent. Console vide dans les états contrôlés.

## Limites

Les captures ne constituent pas une certification d'accessibilité. Aucun test sur téléphone physique ni restauration complète d'un export avec photos utilisateur. La densité du graphe et les portraits diffèrent du concept afin de conserver le jeu fictif et les fonctions réelles. L'accueil et les écrans secondaires existants ne sont pas redessinés dans ce lot.

final result: passed
