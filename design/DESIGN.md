# La bible visuelle de Berceau

> Ce document est la référence. Tout ce qui est écrit ici a une raison, et cette raison est
> presque toujours **la personne qui va s'en servir** : quelqu'un de 70 ans, qui n'est pas à l'aise
> avec un ordinateur, et qui veut juste retrouver le nom de son grand-père.
>
> Quand un choix est joli mais gêne la lecture, **c'est la lecture qui gagne**. Toujours.

---

## 1. La première impression

Une famille, ce n'est pas une application. Les albums photo de famille ont une matière : du papier
épais, des coins un peu usés, une écriture à l'encre. Un site de généalogie ressemble aujourd'hui à
un tableur.

**Notre parti pris : un objet, pas un logiciel.** Papier crème, encre vert-bouteille, une serif pour
les noms, de l'air autour. On doit avoir envie de le montrer.

Trois sensations à produire, dans cet ordre :

1. **« C'est calme. »** — pas de couleur criarde, pas de clignotement, pas de notification.
2. **« C'est solide. »** — les choses sont alignées, rien ne saute, les boutons sont gros.
3. **« C'est pour moi. »** — le texte parle français et tutoie personne ; il dit « votre grand-père »,
   pas « entité parentale de niveau 2 ».

---

## 2. Les couleurs

### 2.1 La logique

On a **8 ambiances** parce que les yeux vieillissent différemment : certains ont besoin de contraste,
d'autres sont éblouis par le blanc, d'autres voient mieux sur fond sombre. Ce n'est pas un gadget de
personnalisation, **c'est une fonction d'accessibilité** — et c'est ainsi qu'il faut le présenter.

Chaque ambiance a la même structure : un fond (`--papier`), une surface (`--carte`), une encre
(`--ink`), un gris secondaire (`--muted`), un accent (`--vert`), un or (`--or`) pour les dates et
les filets.

### 2.2 Le défaut : Papier

| Rôle | Valeur | Pourquoi |
|---|---|---|
| Fond | `#f6f5f0` | Blanc cassé chaud : moins éblouissant qu'un blanc pur, plus « papier » |
| Carte | `#fffefa` | À peine plus clair que le fond, pour que les cartes se détachent sans trait dur |
| Encre | `#203a34` | Vert-bouteille très foncé, pas du noir : le noir pur fatigue et fait « imprimante » |
| Secondaire | `#5c6a63` | Contraste 5,1:1 minimum sur le fond — c'est la limite basse autorisée |
| Ligne | `#e4e3da` | Sépare sans crier |
| Vert | `#275447` | L'accent : boutons principaux, liens |
| Or | `#bd9656` | **Réservé** aux dates et aux filets fins : c'est la couleur du laiton et du cuir |

**Règle :** l'or ne sert jamais à un bouton ni à un texte long. C'est une couleur de détail, comme
les dorures d'un livre relié. Dès qu'on en met partout, ça devient kitsch.

### 2.3 À ajouter (manquant aujourd'hui)

Trois rôles sémantiques qui n'existent pas encore, à définir pour les 8 ambiances :

- `--danger` : rouge brique `#9c3a2e` (papier), utilisable pour le bouton de suppression.
  Jamais un rouge vif : sur un fond crème, un rouge vif fait « erreur de formulaire ».
- `--lien` : `--vert` (déjà), mais les liens doivent être **soulignés** — on ne devine pas un lien
  par sa couleur quand on voit mal les couleurs.
- `--surlignage` : `#f3e6c8` (papier) pour les recherches et les anniversaires du jour.

---

## 3. La typographie

### 3.1 Deux familles, deux rôles

- **Les noms de famille et les grands titres** : une **serif**.
  `Georgia, 'Times New Roman', serif` — installée partout, gratuite, et elle a une vraie chaleur
  d'imprimé. C'est **le** détail qui différencie du logiciel générique.
- **Tout le reste** : la sans-serif système (`system-ui`), pour la lisibilité des formulaires.

### 3.2 L'échelle

| Usage | Taille | Graisse | Interligne |
|---|---|---|---|
| Nom sur une carte | 20 px | 600 | 1,2 |
| Prénom + nom (fiche) | 34 px | 600 | 1,15 |
| Titre de page (`h1`) | 30 px | 600 | 1,2 |
| Titre de section (`h2`) | 23 px | 600 | 1,25 |
| Corps | 17 px | 400 | 1,5 |
| Dates, lieux | 15,5 px | 400 | 1,4 |
| Mentions légales, pied | 13,5 px | 400 | 1,4 |

**Jamais moins de 13,5 px**, et jamais un texte de lecture en gris clair. La taille minimale de
notre public impose le reste.

### 3.3 Les chiffres

Les dates doivent utiliser `font-variant-numeric: tabular-nums`, pour que `1937` et `2000` aient la
même largeur : dans une colonne de cartes, les années s'alignent alors verticalement, et l'œil lit
mieux. Détail invisible, effet réel.

---

## 4. L'espace

Une échelle unique, en multiples de 4 : **4, 8, 12, 16, 24, 32, 48, 64**.

- Intérieur d'une carte : 16 px (18 px sur les cartes de l'arbre).
- Entre deux cartes d'une colonne : **28 px** (déjà en place, c'est bien).
- Entre deux colonnes : 42 px.
- Marge de la toile : 32 px minimum.
- Largeur de lecture maximale d'un texte : **34 em** (au-delà, l'œil perd la ligne).

**Le vide est un composant.** Quand un écran paraît « vide », c'est souvent qu'il est juste bien
aéré. Ne jamais combler avec des lignes décoratives.

---

## 5. Les surfaces

- Rayon : **10 px** pour les boutons et champs, **14 px** pour les cartes, **20 px** pour les fenêtres.
- Ombre, deux niveaux seulement :
  - posée : `0 1px 2px rgba(32,58,52,.06)` (cartes au repos) ;
  - levée : `0 14px 34px rgba(32,58,52,.10)` (fenêtres, carte survolée).
- Bordure : toujours `1px solid var(--carte-bord)`, et **elle fait le travail de l'ombre** sur les
  cartes au repos. Une carte sans bordure sur fond crème flotte mal.
- La toile de l'arbre : un semis de points très pâles (déjà là), **6 px d'écartement, opacité 0,5**.
  C'est ce qui donne l'impression de papier millimétré de cartographe.

---

## 6. Les mouvements

- Durées : **140 ms** pour un survol, **220 ms** pour l'ouverture d'une fenêtre, **320 ms** pour
  l'arrivée d'une carte.
- Courbe : `cubic-bezier(.2, 0, 0, 1)` (départ franc, arrivée douce).
- Ce qui bouge : l'ombre, l'opacité, une translation de 4 px maximum.
- **Ce qui ne bouge jamais** : les cartes de l'arbre quand on passe la souris (on les lit, on ne
  joue pas avec), le texte, les couleurs de fond.
- `prefers-reduced-motion` : tout à 0,01 ms (déjà en place).

Une animation ne doit **jamais** retarder une action. Si le doute existe, pas d'animation.

---

## 7. Les états

C'est là que se voit un travail soigné. Chaque écran doit exister dans **cinq** états :

| État | À quoi ça ressemble chez nous |
|---|---|
| **Vide** | Une phrase qui explique quoi faire, un seul bouton. Pas d'illustration triste. |
| **Chargement** | Le texte reste en place, une barre fine en haut. **Jamais** de roue qui tourne au milieu. |
| **Erreur** | Un bandeau dans la fenêtre, en `--danger`, avec une phrase qui dit quoi faire, pas un code. |
| **Succès** | Une annonce discrète en bas (`role="status"`), qui s'efface seule au bout de 4 s. |
| **Vide après recherche** | « Personne ne correspond à « xyz ». » + un lien « effacer la recherche ». |

**Le bouton désactivé n'existe pas** chez nous : on ne montre pas un bouton qu'on ne peut pas
utiliser. Soit il est là et il marche, soit il n'est pas là.

---

## 8. Le clavier et le focus

- Le contour de focus est **toujours visible** : `3px solid var(--vert)`, décalé de 2 px, avec un
  rayon de 8 px pour épouser les coins.
- Ordre de tabulation = ordre de lecture. Jamais de `tabindex` positif.
- Échap ferme toute fenêtre. Entrée valide un formulaire.
- Dans une fenêtre, le focus est **piégé** (Tab fait le tour) et revient sur le bouton d'origine à la
  fermeture.

---

## 9. Les détails qui font « poussé »

Liste des finitions à appliquer. Aucune n'est visible seule ; ensemble, elles font la différence.

1. **Le nom en serif, le reste en sans-serif.** Déjà décrit, c'est le plus gros gain.
2. **Les années alignées** (`tabular-nums`).
3. **Les traits de l'arbre arrondis** : dans le SVG, les angles des liens sont adoucis
   (`stroke-linejoin: round`, et un rayon sur les coudes plutôt qu'un angle droit).
4. **La carte de la personne de départ** : bordure `2px solid var(--vert)` au lieu de 1 px. On doit
   voir du premier coup d'œil d'où part l'arbre.
5. **Les personnes décédées** : un petit `†` en `--or` devant la date, et **pas** de grisé — un
   ancêtre n'est pas désactivé.
6. **Les anniversaires du jour** : la date en `--surlignage`, et une phrase en haut de l'arbre :
   « Aujourd'hui, Gérard aurait eu 89 ans. » C'est le détail qui fait revenir.
7. **Le compteur** : « 7 personnes · 3 générations » plutôt que « 7 personnes ». Les générations,
   c'est ce qui impressionne.
8. **Les médaillons sans photo** : les initiales en serif, dans un rond `--vert-clair`, jamais un
   personnage gris générique.
9. **Le survol d'une carte** : l'ombre monte, rien d'autre. Pas de translation, pas de zoom.
10. **La fenêtre** : elle s'ouvre en 220 ms, l'arrière-plan se voile à 60 %, et on ne peut pas
    cliquer derrière.
11. **Les boutons** : hauteur 44 px minimum, 54 px pour les actions principales. Libellé au verbe
    (« Enregistrer », « Imprimer cette fiche »), jamais « OK ».
12. **Les champs** : le libellé est au-dessus, jamais à l'intérieur (un libellé dans le champ
    disparaît dès qu'on tape — catastrophique pour ce public).
13. **Le pied de page** : la signature « Créé par Louis Masson · aucun copyright » en 13 px, à
    gauche, avec l'air d'une mention d'imprimeur.
14. **L'impression** : une page de couverture pour le livre de famille (nom de la famille, une
    phrase, la date), puis une fiche par page.

---

## 10. Ce qu'on ne fera jamais

- Un carrousel.
- Une police décorative pour le texte courant.
- Une icône sans libellé.
- Un menu qui s'ouvre au survol.
- Une couleur qui ne sert qu'à décorer.
- Un bouton qui ne fait rien.
- Un message d'erreur technique (« TypeError », « NaN », « undefined »).
- Demander un mot de passe compliqué. On a déjà un code à 4 chiffres, c'est suffisant.
- Mettre le prénom d'un vivant dans un partage public sans le consentement de la famille. **C'est
  une règle absolue**, pas une préférence.
