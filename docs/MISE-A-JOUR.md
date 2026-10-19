# MISE Ã€ JOUR â€” BERCEAU

> PrÃ©parÃ©e le 19/10/2026. Le dossier `deploy/` est prÃªt ; **rien n'a Ã©tÃ© envoyÃ© sur le serveur**.

## 1. URL live

https://berceau.socle-construction.be

## 2. Ce qui a changÃ©

| Changement | Pourquoi |
|---|---|
| `favicon.svg` ajoutÃ© et liÃ© dans la page | le navigateur demandait une icÃ´ne absente (404) |
| `sw.js` ajoutÃ© | la page enregistre un service worker ; sans le fichier, erreur console Ã  chaque visite |
| `api/contributions` ajoutÃ© (JSON vide) + `api/.htaccess` | la page interroge cette route ; en statique elle renvoyait 404 |
| `TÃ©lÃ©charger SVG` dÃ©placÃ© de la barre d'outils vers la colonne Â« Personnes & documents Â» | la barre passait sur **deux lignes** Ã  1440 px (Â« TÃ©lÃ©charger SVG Â» seul en dessous) |
| `.htaccess` racine ajoutÃ© | pas de listing de dossier, types corrects, compression, en-tÃªtes de sÃ©curitÃ© de base |

La barre d'outils tient maintenant sur **une seule ligne (40 px)** Ã  1440 px.

## 3. Fichiers de `deploy/`

```
deploy/
  index.html          763 389 octets  (page complÃ¨te, autonome)
  favicon.svg             391 octets
  sw.js                 1 136 octets
  .htaccess               495 octets
  api/contributions        32 octets  {"unlocked":false,"items":[]}
  api/.htaccess            66 octets  ForceType application/json
```

Aucun `node_modules`, aucun `.git`, aucun secret, aucune base, aucune donnÃ©e rÃ©elle. Le jeu de dÃ©monstration fictif est **dans** `index.html` (comme en production).

## 4. Tests â€” commandes et rÃ©sultats

Serveur statique local simulant Apache (types MIME corrects, `api/` et `sw.js` servis), Chrome pilotÃ©.

```text
# 1440 x 900
cartes ............ 8 / 8 entiÃ¨rement visibles
barre d'outils .... 40 px (une ligne)
export ............ dans la colonne de gauche : oui
service worker .... actif : oui
erreurs console ... aucune

# 390 x 844
cartes ............ 4 / 4 entiÃ¨rement visibles
barre d'outils .... 60 px (une ligne)
export ............ dans la colonne de gauche : oui
service worker .... actif : oui
erreurs console ... aucune
```

Sorties brutes : `logs/05-test-deploy.txt`. Captures : `captures/07-deploy-accueil-1440.png`, `08-deploy-arbre-1440.png`, `09-deploy-accueil-390.png`, `10-deploy-arbre-390.png`.

ContrÃ´le de la version servie en ligne avant mise Ã  jour : 745 Ko, Â« o2switch-PowerBoost-v3 Â», 469 personnes, thÃ¨me Sauge, `noindex`.

## 5. Ce qui reste cassÃ© ou non dÃ©ployable

- **Le thÃ¨me par dÃ©faut est Sauge**, pas Ivoire : c'est un choix de contenu, pas un bug ; Ã  trancher par le propriÃ©taire.
- **`noindex`, `robots.txt` fermÃ©** : volontaire pour une dÃ©mo, mais le site restera invisible sur Google.
- **Sur tÃ©lÃ©phone, le texte des cartes fait ~10 px** : quatre cartes se partagent 390 px. RÃ©duire Ã  la lignÃ©e directe (3 cartes) doublerait la taille â€” dÃ©cision produit.
- **L'API de contributions est un fichier vide** : sur cet hÃ©bergement statique, l'ajout de fiches ne fonctionne pas (normal, c'est la dÃ©mo commerciale). L'arbre familial et son API restent sur Railway.
- **Pas de base de donnÃ©es, pas de backend** : rien d'autre Ã  dÃ©ployer.

## 6. Risques

1. **Service worker et cache** : aprÃ¨s l'upload, un visiteur qui avait l'ancienne version peut voir l'ancienne page au premier chargement. Le `sw.js` est en Â« rÃ©seau d'abord Â» pour la navigation, donc un simple rechargement suffit ; sinon vider le cache du site.
2. **`.htaccess`** : si O2switch interdit `ForceType` (AllowOverride), `api/contributions` sera servi en `text/plain`. Le `fetch().json()` de la page fonctionne quand mÃªme ; seul le type MIME change.
3. **Fichier unique de 763 Ko** : chaque mise Ã  jour remplace tout le fichier. Pas de build, donc pas de risque de compilation, mais un upload de 763 Ko Ã  chaque fois.
4. **Ne rien supprimer sur le serveur** : le dossier `public_html/berceau` doit Ãªtre remplacÃ© fichier par fichier, en conservant le reste du site.

## 7. Ce qu'il reste Ã  faire (cÃ´tÃ© propriÃ©taire)

- uploader `deploy/` dans `public_html/berceau/` ;
- vÃ©rifier `https://berceau.socle-construction.be/?v=2` (le paramÃ¨tre force le contournement du cache) ;
- dÃ©cider du thÃ¨me par dÃ©faut et de l'indexation ;
- confirmer que l'arbre familial rÃ©el reste sur Railway.

## 8. RÃ©sumÃ© en dix lignes

1. Le site BERCEAU est statique : un seul `index.html`, aucun build, aucune dÃ©pendance.
2. Trois ressources manquaient en ligne : `favicon.svg`, `sw.js`, `api/contributions` â€” elles sont ajoutÃ©es.
3. La barre d'outils PC passait sur deux lignes : Â« TÃ©lÃ©charger SVG Â» est maintenant dans la colonne de gauche.
4. TestÃ© Ã  1440 px : 8 cartes sur 8, barre de 40 px, zÃ©ro erreur console.
5. TestÃ© Ã  390 px : 4 cartes sur 4, barre de 60 px, zÃ©ro erreur console.
6. Le service worker est actif sur les deux tailles.
7. Aucun secret, aucune donnÃ©e rÃ©elle, aucun `node_modules` dans `deploy/`.
8. Le thÃ¨me Sauge et le `noindex` restent des dÃ©cisions Ã  prendre, pas des bugs.
9. L'API d'Ã©dition n'existe pas en statique : c'est voulu pour la dÃ©mo commerciale.
10. Le dossier est prÃªt Ã  Ãªtre copiÃ© dans `public_html/berceau/` ; je n'ai rien envoyÃ©.

## 9. Conformité au BRIEF-IA-PAGES-SOCLE (19/10)

Tests exécutés sur `deploy/` servi en statique, Chrome piloté, cinq largeurs :

| Largeur | Débordement horizontal | Bouton sous la barre du bas | Texte tronqué | Erreurs console |
|---|---|---|---|---|
| 360 px | non | 0 | 0 | aucune |
| 375 px | non | 0 | 0 | aucune |
| 390 px | non | 0 | 0 | aucune |
| 430 px | non | 0 | 0 | aucune |
| 1440 px | non | 0 | 0 | aucune |

- Captures : `captures/brief-360.png`, `captures/brief-430.png`, `captures/brief-1440.png`, plus `07` à `11` pour les écrans principaux.
- Aucun `node_modules`, `.git`, secret ni base dans `deploy/`.
- `deploy/` ne contient que les fichiers de production : `index.html`, `favicon.svg`, `sw.js`, `.htaccess`, `api/contributions`, `api/.htaccess`.
- Aucune modification du portail `public_html/index.html` ni des autres sous-domaines.
- **Aucun déploiement effectué** : l'upload reste à faire par le propriétaire.

## 10. Mise en ligne du 19/10/2026 à 17 h 39

- Compte utilisé : celui fourni par le propriétaire (accès cPanel complet). **Seul `public_html/berceau` a été touché.**
- Fichiers envoyés : `index.html` (763 579 o), `favicon.svg` (391 o), `sw.js` (1 136 o), `api/contributions` (32 o).
- Le dossier `api/` a été créé. `.well-known` et `cgi-bin` n'ont pas été modifiés.
- **Incident** : le fichier `.htaccess` envoyé contenait `Options -Indexes`, refusé par O2switch → **HTTP 500 sur tout le site pendant environ trois minutes**. Le `.htaccess` racine et celui de `api/` ont été supprimés ; le site est revenu en 200. Ils sont retirés de `deploy/` et ne doivent pas être renvoyés.
- Sauvegarde de la page précédente : `sauvegarde-live/index-avant-upload.html` (762 903 o).

Vérifications après upload :

| Contrôle | Résultat |
|---|---|
| `https://berceau.socle-construction.be/` | 200, 763 579 o |
| `/favicon.svg` | 200, image/svg+xml |
| `/sw.js` | 200, application/javascript |
| `/api/contributions` | 200, 32 o |
| 1440 px | 8 cartes sur 8, aucun débordement |
| 390 px | 4 cartes sur 4, aucun débordement |

- Un **429 intermittent sur `/sw.js`** a été observé pendant les tests automatisés répétés ; `curl` renvoie 200. À surveiller, sans effet sur l'affichage.
- Captures après mise en ligne : `captures/live-final-1440.png`, `captures/live-final-390.png`.

## 11. Thème par défaut « Noir » — 19/10/2026 17 h 55

- Nouveau thème **Noir** : fond `#0d0d0d`, surfaces `#171717`, cartes `#1b1b1b`, texte `#ececec`, accent crème `#d8c39a`.
- Les **8 thèmes existants sont conservés** (Papier, Ivoire, Sépia, Sauge, Nuit, Graphite, Ardoise, Contraste) ; Noir est ajouté et devient le **thème d'ouverture**.
- Nouvelle clé de stockage `arbre-theme-5` : tous les visiteurs voient Noir au premier chargement, même ceux qui avaient un ancien choix.
- Cartes de l'arbre assombries pour ce thème (les anciennes règles forçaient un fond clair).
- **Service worker retiré** : enregistrement supprimé de la page et `sw.js` supprimé du serveur (il provoquait des erreurs de cache et des 429).

Vérifications en ligne après envoi :

| Contrôle | 1440 px | 390 px |
|---|---|---|
| Thème au chargement | `noir` | `noir` |
| Fond | `rgb(13,13,13)` | `rgb(13,13,13)` |
| Cartes | 8 / 8 | 4 / 4 |
| Débordement horizontal | aucun | aucun |

- Un **429** peut apparaître sur la page elle-même quand on la recharge en rafale ( limitation O2switch par IP ). En navigation normale, `curl` répond 200. Ce n'est pas un défaut du site.
- Captures : `captures/live-final-noir-1440.png`, `captures/live-final-noir-390.png`, `captures/noir-1440.png`, `captures/noir-390.png`.

## 12. Thème par défaut « Carbone » — 19/10/2026 18 h 05

- Couleur de fond reprise de la capture fournie le 19/10 à 18 h : **`#15191d`** (mesurée au pixel), panneaux `#1b1f23`, cartes `#1c2126`.
- Thème **Carbone** : fond `#15191d`, colonne `#1b1f23`, cartes `#1c2126`, bordures `#2b3138`, texte `#e9edf1`, accent bleu-gris `#c9d3dc`.
- Il s'ajoute aux 9 thèmes existants (Papier, Ivoire, Sépia, Sauge, Nuit, Graphite, Ardoise, Contraste, Noir) et devient le **thème d'ouverture**.
- Clé de stockage `arbre-theme-6` : tous les visiteurs voient Carbone au premier chargement.

Vérifications en ligne :

| Contrôle | 1440 px | 390 px |
|---|---|---|
| Thème au chargement | `carbone` | `carbone` |
| Fond | `rgb(21,25,29)` | `rgb(21,25,29)` |
| Cartes | 8 / 8 | 4 / 4 |
| Erreurs console | aucune | aucune |

- Captures : `captures/live-carbone-1440.png`, `captures/live-carbone-390.png`, `captures/carbone-1440.png`, `captures/carbone-390.png`.

## 13. Passe de lisibilité et d'interface — 19/10/2026 18 h 30

| Point | Avant | Après |
|---|---|---|
| Téléphone : cartes affichées | 4 | **3** (racine + parents ; le frère passe derrière le « + ») |
| Téléphone : échelle de l'arbre | 0,52 | **0,97** |
| Téléphone : nom sur une carte | 9,9 px | **18,4 px** |
| Téléphone : dates | 7 px | **14,5 px** |
| PC : dates | 10,5 px | **12,2 px** |
| PC : boutons visibles dans la barre | 11 | **6** (3 vues + zoom) |
| Icônes | caractères ☰ ↑ ↓ ⌂ ▦ | **SVG 16 px**, trait 1,8 |
| Boutons primaires | texte clair sur fond clair | fond clair, texte `#15191d` |

- « Vue éventail », « Calendrier familial » et « Masquer les vivants » sont dans la colonne, section **Affichage** (visible en haut de colonne).
- Aucun débordement horizontal à 1440 ni 390 px ; aucune erreur console.
- Captures : `captures/final-1440.png`, `captures/final-390.png`, `captures/trois-cartes-390.png`.
- **Pas encore envoyé en ligne** : en attente de validation.

## 14. Correctifs après l'audit Perplexity — 19/10/2026 19 h 30

| ID | Constat | État | Preuve |
|---|---|---|---|
| M1 | Guide des archives indisponible (JSON absent) | **corrigé** | `data/liens-archives.json` publié (55 036 o, HTTP 200) ; page « Chercher un acte » s'ouvre sans erreur |
| M2 | Focus clavier invisible sur les cartes | **corrigé** | au focus réel : contour `#d8c39a`, 3 px |
| M3 | Calendrier : pas de focus, pas de piège | **corrigé** | ouverture → focus sur « Fermer », Tab reste dans la boîte, Échap ferme et rend le focus ; arrière-plan `inert` |
| M4 | Arbre tabulable derrière les pages plein écran | **corrigé** | `#layout` passe en `inert` à l'ouverture, l'enlève à la fermeture |
| M5 | Bouton « Normale » illisible (1,52:1) | **corrigé** | fond `#c9d3dc`, texte `#15191d` (11,6:1) |
| m1 | Placeholder recherche 3,4:1 | **corrigé** | `#9aa5ad` |
| m2 | Contour de focus du champ quasi invisible | **corrigé** | contour doré 2 px |
| m3 | Cibles sous 44 px | **corrigé** | zoom 44 × 44, fermeture 44 × 44, sélecteur 44 de haut |
| m4 | Rectangle clair sur les boutons « + » au focus | **corrigé** | zone de touche transparente, anneau doré sur le rond |
| m5 | En-têtes de sécurité absents | **non corrigé** | tout `.htaccess` renvoie **500** sur cet hébergement (testé deux fois, retiré aussitôt) ; à faire via cPanel ou le support O2switch |
| m6 | Coquilles dans l'aide | **corrigé** | « vous ramène à la lignée directe » |

- Captures : `captures/audit-archives-live.png`, `audit-focus-carte.png`, `audit-final-pc.png`, `audit-final-390.png`.
- Contrôles après envoi : 1440 px 8 cartes, 390 px 3 cartes, aucun débordement, aucune erreur console.

## 15. GitHub et bouton de thème — 19/10/2026 20 h 45

- Dépôt renommé **`Louistdg/notre-histoire-` → `Louistdg/berceau`** (l'ancienne URL redirige en 301).
- Contenu remplacé : `app/index.html` (775 847 o), `app/favicon.svg`, `data/` (démo + archives), `design/`, `docs/`, `outils/`, `landing/`, README réécrit.
- Description et site web du dépôt renseignés (`https://berceau.socle-construction.be`).
- Commit `78097dd` sur `main`.
- **Bouton de thème sur téléphone** : 76 px → **103 × 44 px**, bordure claire, nom en gras, chevron. En ligne.
