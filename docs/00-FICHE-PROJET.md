# 00 — FICHE DE MIGRATION DU PROJET

> Remplie le 19/10/2026. Chaque fait vient d'une mesure locale ou d'une lecture de la configuration Railway. Ce qui n'a pas pu être mesuré est écrit INCONNU, avec ce qu'il faudrait pour le savoir.

## 1. Identité

- **Nom du projet** : BERCEAU
- **Nom commercial** : Berceau (arbre familial)
- **Propriétaire / contact** : Louis Masson — louis.masson@outlook.com
- **Dernière mise à jour** (AAAA-MM-JJ) : 2026-10-19
- **État** : démo publique, jeu de données **fictif** (469 personnes) ; pas encore vendu
- **Priorité de migration** : haute

## 2. Adresses et domaines

- **URL actuelle** : https://arbre-famille-copie-production.up.railway.app/
- **Domaine souhaité** : INCONNU (aucun nom de domaine acheté à ma connaissance) — il faut demander au propriétaire
- **Sous-domaine souhaité** : INCONNU
- **Registrar** : INCONNU (aucun domaine déclaré)
- **DNS géré où** : INCONNU
- **Adresse e-mail associée** : louis.masson@outlook.com (compte de déploiement Railway ; ce n'est pas forcément l'adresse du domaine)
- **Redirections / anciennes URLs à conserver** : l'URL Railway peut rester en service pour les démonstrations (décision du propriétaire). Aucune redirection en place.

## 3. Technologie

- **Type** : statique (une seule page HTML autonome) + un petit serveur qui la sert
- **Framework** : aucun. HTML + CSS + JavaScript vanilla, SVG pour l'arbre
- **Version du runtime** : local **Node v24.21.0** ; cible **Node 22** (O2switch). Côté Railway, le serveur tourne sous **Bun — version INCONNU** (il faudrait `bun --version` dans un shell Railway)
- **Gestionnaire de paquets** : aucun (pas de `package.json`, aucune dépendance)
- **Commande d'installation** : aucune — `npm install` est inutile
- **Commande de build** : aucune — pas d'étape de compilation
- **Commande de démarrage** : sur Railway, `./run.sh <base64 du serveur>` (22 241 caractères) ; en local, servir `app/index.html` avec n'importe quel serveur statique
- **Port d'écoute** : `PORT` ou 3000 par défaut
- **Fichier d'entrée** : `server/railway-function.js` (extrait de Railway, voir `server/LISEZ-MOI.txt`)
- **Variables d'environnement nécessaires** (noms seulement) : `APP_CHUNK_0` … `APP_CHUNK_9`, `APP_CHUNK_COUNT`, `PORT`, `DATA_DIR`, `EDIT_PIN_HASH`, `EDIT_PIN_SALT`, `EDIT_SESSION_SECRET`
- **Fichiers/dossiers à ne pas versionner** : `sauvegardes/` (contient l'arbre familial réel), `data/` (jeux de test), `_ancien-prototype/`, `outils/_famille-pages.html`, `outils/_deploiement-famille.html`, `SECRETS-LOCAL.txt`

## 4. Base de données

- **Type** : aucune
- **Chemin ou nom de la base** : sans objet côté serveur. Les arbres sont dans le **localStorage** du navigateur, clé `arbres.v1`
- **Taille** : la page `deploy/index.html` pèse **763 389 octets** et contient le jeu de démonstration fictif (la copie de travail `app/index.html` faisait 762 903 octets avant l'ajout du favicon et le déplacement du bouton d'export)
- **Export fourni dans** : `database/AUCUNE.txt`
- **Migrations / schéma** : aucune. Format des données décrit dans `data/schema.md` (non inclus dans le zip : dossier de données)
- **Sauvegardes existantes** : copies HTML datées dans `sauvegardes/` sur le poste du propriétaire (non incluses : données réelles)
- **Données sensibles** : **oui** — l'arbre familial réel (472 personnes) existe dans un autre service Railway et dans `sauvegardes/`. Il n'est **pas** dans ce dossier de migration.

## 5. Fichiers et stockage

- **Fichiers uploadés par les utilisateurs** : oui, des photos, mais **stockées dans le navigateur** (IndexedDB), pas sur le serveur
- **Dossier de stockage** : aucun côté serveur
- **Taille totale** : 0 octet côté serveur
- **Stockage externe** : aucun
- **Sauvegarde de ces fichiers** : incluse dans le fichier de sauvegarde `.berceau` exporté par l'application

## 6. Services externes

- **Paiement** : aucun
- **E-mail transactionnel** : aucun
- **SMS / push** : aucun
- **API tierces** : aucune (aucun appel réseau sortant ; polices système)
- **Webhooks** : aucun
- **Cron / tâches planifiées** : aucun
- **WebSockets / SSE / temps réel** : non

## 7. Authentification et rôles

- **Type d'authentification** : code PIN + cookie signé HMAC (`family_edit`), utilisé **uniquement** par le service de l'arbre familial
- **Rôles existants** : visiteur (lecture) / session déverrouillée (ajout et correction de fiches)
- **Comptes de test** : aucun compte nominatif ; le code PIN n'est pas noté ici
- **2FA** : non
- **Réinitialisation de mot de passe** : non (le PIN se change par variable d'environnement)

## 8. Build et tests — preuves

```text
$ node --version
v24.21.0

$ npm --version
11.19.0

$ bun --version
bun: commande introuvable

$ node --check server/railway-function.js
(aucune sortie)
code de sortie : 0
```

```text
$ node server-test.js            # serveur Railway, sous Node, sans variables
Error: Application bundle missing
    at file:///.../server-test.js:18:22
code de sortie : 1   duree : 0,1 s
```

```text
$ node server-test.js            # avec APP_CHUNK_0..9 et APP_CHUNK_COUNT=10
(aucune sortie)
code de sortie : 0
port 8099 /health : aucune connexion
```

Conclusion mesurée : **le serveur ne démarre pas sous Node** — il attend `globalThis.Bun`. Ce n'est pas une erreur de configuration, c'est un portage à faire (voir §11).

```text
# Page servie en statique sur 127.0.0.1:8099, Chrome piloté
1440x900 : accueil affiché, arbre ouvert, 8 cartes / 8 entièrement visibles
390x844  : accueil affiché, arbre ouvert, 4 cartes / 4 entièrement visibles
erreurs console : 404 sur /api/contributions, script servi en text/html
```

Les deux erreurs console viennent du **serveur statique de test** (il ne sert ni `/api/*` ni `/sw.js` comme le fait Railway). Sur Railway, le serveur les gère. Sorties complètes : `logs/03-test-navigateur.txt`.

- **Build local** : sans objet (aucun build)
- **Tests** : OK pour la page (8/8 et 4/4 cartes) ; le serveur, lui, n'est pas testable sous Node
- **Démarrage local** : OK en statique ; ÉCHEC pour `server/railway-function.js` sous Node
- **Page d'accueil** : OK (HTTP 200, écran d'accueil puis arbre)

## 9. Captures et journaux

- Captures : `captures/01-accueil-1440.png`, `02-arbre-1440.png`, `03-noms-1440.png`, `04-accueil-390.png`, `05-arbre-390.png`, `06-noms-390.png`
- Journaux : `logs/01-runtimes.txt`, `02-demarrage-serveur-node.txt`, `03-test-navigateur.txt`, `04-contenu-source.txt`

## 10. Déploiement actuel

- **Hébergeur actuel** : Railway
- **Type d'offre** : service « arbre-famille-copie » (projet `3cb90630-0cef-4ab4-a686-6d984fc6317b`, environnement `d64e6aad-ba62-4627-8382-1bc5df11b214`)
- **Système** : conteneur Linux géré par Railway (Bun)
- **Accès SSH** : non (pas nécessaire)
- **Chemin du projet sur le serveur** : INCONNU (le code de la page est dans les variables `APP_CHUNK_*`, pas sur un disque)
- **Service / process manager** : Railway, `startCommand` = `./run.sh <base64>`
- **Reverse proxy** : Railway (HTTPS terminé par la plateforme)
- **Certificat HTTPS** : fourni par Railway
- **Sauvegarde automatique** : non. Volume `arbre-famille-copie-volume` (`1a2257cf-0c17-4ac6-a984-1092e3041d84`) monté sur `/data`, non sauvegardé automatiquement
- **Identifiant du service** : `6b8753bc-4605-4584-9c3e-aed69e16885f`

## 11. Migration souhaitée

- **Destination** : O2switch, Offre Unique Cloud (cPanel, Node 22 via Passenger)
- **Pourquoi** : hébergement mutualisé français, sortie de Railway pour la production ; Railway reste pour les démonstrations
- **Contraintes** :
  - **Bun n'existe pas sur O2switch** : le serveur actuel ne démarre pas tel quel ;
  - le code de la page est stocké dans des **variables d'environnement** Railway (10 morceaux base64), pas dans un dépôt : il faut repartir de `app/index.html` ;
  - **une seule page de 762 Ko** : aucun build, mais chaque modification est un remplacement de fichier complet ;
  - les données vivent dans le **navigateur** (localStorage/IndexedDB) : rien à migrer côté serveur, mais rien à sauvegarder côté serveur non plus.
- **Ce qui doit rester identique** : la page et ses écrans, les 8 thèmes, les pages « Les noms / Chronologie / Les lieux », l'import GEDCOM, les données fictives de démonstration.
- **Ce qui peut changer** : le mode de service. Pour la démo, un simple serveur statique suffit ; l'API de contributions n'est utile qu'à l'arbre familial.

## 12. Ce qui marche, ce qui ne marche pas

- **Fonctionnalités opérationnelles** : arbre et navigation, fiches, recherche, 8 thèmes, pages Les noms / Chronologie / Les lieux, calendrier familial, vue éventail, masquer les vivants, import GEDCOM (modèle de données aligné le 18/10), export SVG, impression, sauvegarde `.berceau`, photos locales.
- **Fonctionnalités cassées** : néant constaté sur la page. En revanche **le serveur n'est pas portable en l'état** (Bun) et le démarrage sous Node est un échec mesuré.
- **Contournements connus** : servir `app/index.html` en statique (ce qui a été testé ici).
- **Dettes techniques** : page unique de 762 Ko ; code ajouté par blocs successifs (le fichier contient plusieurs couches de correctifs) ; données en localStorage (perdues si l'on change d'appareil) ; serveur propre à Bun ; `APP_CHUNK_*` comme mécanisme de déploiement. Le dépôt GitHub (`main`, commit `7ec2793`) contient une page de **433 Ko**, antérieure à la version locale de **762 Ko** : il est en retard, le zip est la référence (voir `git-repo.txt`).
- **Sécurité** : `noindex` + `robots.txt` fermé (volontaire pour une démo) ; pas de compte utilisateur ; le PIN ne protège que l'arbre familial ; aucun secret dans le zip.

## 13. Checklist avant migration

- [x] `source.zip` créé sans `node_modules`, sans `.git`, sans données réelles, sans secrets (28 entrées, 261 Ko)
- [x] Build testé et loggé : sans objet (aucun build)
- [x] Tests testés et loggés : navigateur 8/8 et 4/4 cartes, `logs/03-test-navigateur.txt`
- [x] Démarrage testé et loggé : statique OK ; Node ÉCHEC, `logs/02-demarrage-serveur-node.txt`
- [x] Export de base fourni : `database/AUCUNE.txt` (aucune base)
- [x] Fichiers utilisateurs inventoriés : photos en IndexedDB, aucun stockage serveur
- [x] Variables d'environnement listées
- [x] Secrets placés dans `SECRETS-LOCAL.txt` uniquement
- [ ] Domaines et DNS listés : **INCONNU** — il faut le domaine et l'accès DNS du propriétaire
- [x] Captures des écrans principaux : 6 fichiers dans `captures/`
- [x] Fiche remplie sans « je pense »

## 14. Décision de l'agent

- **Recommandation** : **migrer**, en commençant par la version statique (la démo n'a besoin d'aucun serveur).
- **Risque principal** : le serveur actuel est écrit pour Bun ; si l'on veut garder l'API de contributions sur O2switch, il faut le porter vers `node:http` et `process.env` (le reste est du JavaScript standard).
- **Temps estimé** : **0,5 jour** pour la démo statique (fichier + configuration cPanel) ; **1 à 2 jours** si l'on porte aussi l'API et le PIN.
- **Ce qu'il faut demander au propriétaire** : le nom de domaine et l'accès DNS ; l'adresse e-mail à associer ; le thème par défaut souhaité (aujourd'hui Sauge) ; la décision sur `noindex` (garder fermé tant que c'est une démo) ; confirmer que l'arbre familial réel reste sur Railway et n'est pas concerné par cette migration.

## 15. Résumé en dix lignes

1. Berceau est une page HTML autonome de 762 Ko, sans framework, sans build, sans dépendance.
2. Elle est servie aujourd'hui par un petit serveur écrit pour **Bun**, stocké dans le `startCommand` Railway.
3. Sous Node 22 elle ne démarre pas : c'est le seul vrai obstacle technique de la migration.
4. Pour la démo, aucun serveur n'est nécessaire : un hébergement statique suffit (testé, 200 OK).
5. Les données (arbres, photos) vivent dans le navigateur : rien à migrer côté base.
6. Aucune base de données, aucun cron, aucun service externe, aucun paiement.
7. Le jeu de démonstration est **fictif** ; l'arbre familial réel est hors périmètre.
8. Les captures et les journaux sont fournis ; les tests navigateur passent (8/8 et 4/4 cartes).
9. Il manque : le domaine, le DNS, l'e-mail, et la décision sur le thème et l'indexation.
10. Verdict : migration simple en statique, portage du serveur seulement si l'on garde l'API.
