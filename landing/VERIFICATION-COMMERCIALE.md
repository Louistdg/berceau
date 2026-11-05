# Vérification de la page commerciale Berceau

## Fichiers livrés

- `landing/index.html` : page française, arbre illustratif fictif, bénéfices, fonctionnement, trois propositions Graine/Racines/Héritage, FAQ et liens vers la démonstration.
- `landing/commercial.css` : styles locaux crème/vert, dispositions adaptatives, focus clavier et réduction des animations.

Les prix de 3/7/12 € par mois sont explicitement non contractuels et à valider. Aucune souscription ni aucun paiement actif. Aucune ressource tierce ajoutée.

## Contrôle statique initial

Commande Python transmise par PowerShell à `D:\TREDIO-V2\runtime\Scripts\python.exe`, depuis le dossier `landing`. Analyse du HTML avec `html.parser.HTMLParser`, lecture du CSS, résolution des références locales et calcul des empreintes SHA-256.

Sortie observée :

```text
exit_code: 0
index.html: 8969 octets
sha256: e76d80f6f209f3864ab5156020b0b6f6f2145f971c1a67ea30ff10c1166f68e5
commercial.css: 7630 octets
sha256: df9cdd990844f8dd6527a590628ecc64f952044ae356e42fa6e161bf6072c9fe
references_checked: 16
unique_anchors: 15
offers: 3
demo_links: 6
errors: []
STATIC_CHECK: PASS
```

Les références contrôlées incluent les ancres, la feuille CSS, `../app/index.html` et `../app/favicon.svg`. Le contrôle a également vérifié l'absence d'identifiants dupliqués, la présence d'un seul h1, l'absence de scripts et de formulaires, ainsi que la présence des libellés commerciaux et des règles CSS demandées.

## Contrôle navigateur — deuxième mission

Preuves : résultats TREDIO du run `fbbf958a889642579ba5c64d7e190236`, séquences 286, 292, 294, 296, 300, 302, 306, 308 et 310.

- Ouverture de `http://127.0.0.1:52949/landing/` avec `browser_open`, puis lecture avec `browser_inspect` : document chargé, état `complete`, titre « Berceau — Vos racines méritent une histoire ».
- Le texte retourné contient les trois formules Graine, Racines et Héritage avec respectivement « 3 € / mois proposés », « 7 € / mois proposés » et « 12 € / mois proposés ».
- Le caractère commercial provisoire est explicite : « Propositions non contractuelles », prix et répartition des fonctionnalités à valider, aucune souscription ni aucun paiement disponible, même démonstration pour tous les boutons.
- Clic sur `details:first-of-type > summary`, puis inspection : la réponse à « Faut-il déjà connaître toute sa famille ? » apparaît dans le texte visible. L'ouverture de cette question FAQ est confirmée.
- Clic sur `header a[href='../app/index.html']` : navigation vers `http://127.0.0.1:52949/app/index.html`, titre « Berceau · Arbre généalogique », état `complete`. L'inspection retourne l'interface Berceau, l'arbre de démonstration et ses contrôles. L'ouverture de l'application par ce lien est confirmée ; ses fonctions n'ont pas été testées individuellement.
- Retour sur `/landing/` avec `browser_open`, nouvelle inspection et capture avec `browser_screenshot`.

Capture produite par l'outil, séquence 310 :

```text
D:\TREDIO-V2\data\free-artifacts\fbbf958a889642579ba5c64d7e190236\bd475babc0bd49b2bfdf4cb4fdda8b18\browser\capture-5a0b9c74fd6b454eafd7c4b1895997a7.png
```

## Erreurs réellement observées

Les premières inspections de la page commerciale retournent `errors: []`.

Après ouverture de l'application, le navigateur signale une erreur réseau :

```text
source: network
level: error
Failed to load resource: the server responded with a status of 404 (File not found)
url: http://127.0.0.1:52949/api/contributions
networkRequestId: 10068.19
timestamp: 1793097419690.666
```

Cette même entrée, avec le même identifiant et le même horodatage, reste présente après le retour sur la page commerciale. Cela ne démontre pas une nouvelle requête défaillante provenant de landing. Aucune autre erreur n'est remontée dans les résultats fournis ; ces résultats ne constituent pas un audit exhaustif du réseau ou de la console.

Aucun défaut certain de landing n'a empêché les vérifications demandées. Aucun correctif HTML/CSS n'a été effectué pendant ce contrôle. L'erreur de l'application est documentée sans modification de `app` ou `data`.

## Limites restantes

Le navigateur a été ouvert et les interactions ci-dessus sont attestées par ses résultats. La capture a été produite, mais son image n'a pas été examinée : aucune validation visuelle du rendu n'est revendiquée.

Le rendu PC/mobile, les dimensions de fenêtre, les débordements, les contrastes, le parcours clavier et la conformité complète HTML/CSS restent à vérifier. Une seule question FAQ et un seul lien de démonstration ont été activés pendant ce parcours. Les imports, sauvegardes, exports et autres fonctions de l'application n'ont pas été exercés.

Tailles supérieures aux cibles indicatives : HTML 8969 octets et CSS 7630 octets. Aucun déploiement public effectué.
