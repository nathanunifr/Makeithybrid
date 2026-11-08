# MakeItHybrid — ton carnet d'entraînement sur iPhone

**Version initiale : 1.0 (novembre 2026)**  
Application web installable (PWA), sans abonnement ni bibliothèque externe.


## Nouveau : thème forêt et guides d'exercices

- Palette vert forêt, sauge et tons naturels, sans accent fluo.
- Dans **Planning → séance** ou **Séances → bibliothèque**, toucher **Photo / vidéo** à côté d'un exercice.
- Des photos de deux positions sont disponibles pour **49 exercices distincts** du programme, avec certains doublons/variantes ; les mouvements sans illustration restent accessibles au journal d'entraînement.
- Des vidéos de démonstration sélectionnées sont disponibles pour le développé couché barre, le tirage vertical, le rowing un bras, le soulevé de terre roumain et le goblet squat ; elles ne sont chargées qu'après un clic.
- Dans une fiche, déplier **Ajouter ou modifier une photo / vidéo** pour coller l'URL HTTPS d'une image ou d'une vidéo YouTube/MP4/WebM. Les liens personnalisés restent sur le même appareil, avec la sauvegarde JSON.
- Les photos proviennent de [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) (Unlicense / domaine public), et sont chargées depuis son dépôt uniquement à l'ouverture du guide. Nécessite Internet pour consulter les médias externes ; vérifier les licences de tout média personnalisé.
- Ouvrir YouTube peut transmettre des données techniques au fournisseur vidéo ; aucun lecteur YouTube n'est chargé avant l'action de lecture.

## Ce qui est déjà inclus

- **30 séances préchargées** du programme hybride du 9 novembre 2026 au 3 janvier 2027, avec **175 exercices** et leurs consignes, volumes et charges indicatives.
- Accueil, calendrier hebdomadaire et mensuel, déplacement et édition des séances.
- Création, duplication, suppression et réorganisation des exercices dans une séance.
- Bibliothèque d'exercices du programme et exercices personnels.
- Journal de musculation : séries, répétitions, kg, historique et volume.
- Journal cardio : durée, distance, vitesse tapis, FC, dénivelé, calcul d'allure.
- Chronomètre de repos, chronomètre d'intervalles avec pause et reprise, réglages personnalisés.
- Graphiques hebdomadaires, records de charges, poids et mensurations.
- Sauvegarde locale sur l'appareil, export complet JSON, export CSV, restauration JSON.
- Installation sur écran d'accueil et ressources disponibles hors connexion après un premier chargement complet.

L'application a été conçue pour **une seule personne, un seul appareil à la fois**. Il n'y a ni compte utilisateur, ni serveur qui enregistre tes performances, ni synchronisation entre téléphones.

## La méthode la plus simple : l'installer sur iPhone

### Étape 1 : mettre l'application en ligne gratuitement

1. Télécharge l'archive ZIP **MakeItHybrid-iPhone.zip**.
2. Depuis un ordinateur, ouvre **https://app.netlify.com/drop**.
3. Glisse directement le fichier ZIP sur la zone de dépôt (ou extrais l'archive puis dépose son dossier). Le ZIP contient `index.html` à sa racine : tu n'as rien à compiler.
4. Netlify te fournit une adresse `https://...netlify.app`.
5. Crée un compte Netlify gratuit et associe le site à ton compte si tu veux conserver son adresse et pouvoir publier des mises à jour facilement.

**Important :** le site est accessible publiquement par son URL, mais le ZIP ne contient *aucun historique sportif personnel*. Les performances saisies ensuite restent sur ton iPhone.

### Étape 2 : ajouter l'app sur l'iPhone

1. Ouvre l'URL Netlify dans **Safari sur l'iPhone**.
2. Touche **Partager** → **Sur l'écran d'accueil**.
3. Active **Ouvrir comme app web** si cette option apparaît.
4. Touche **Ajouter**.
5. Lance MakeItHybrid depuis son icône sur ton écran d'accueil.

Référence Apple : https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios

### Étape 3 : enregistrer ta première séance

1. Ouvre **Planning** ; le programme commence le lundi 9 novembre 2026.
2. Choisis une séance, puis **Commencer cette séance**.
3. Inscris les charges, répétitions ou informations cardio et valide tes séries.
4. Touche **Terminer et enregistrer la séance**.
5. Consulte **Progrès** pour suivre ton évolution.

## Protéger tes performances

- La sauvegarde automatique utilise **IndexedDB dans le navigateur de ton iPhone**.
- Les données restent si tu fermes l'application ou redémarres ton iPhone. Toutefois, elles **peuvent être perdues** si tu supprimes les données du site, si l'iPhone les purge ou si tu changes l'adresse du site.
- Dans **Profil**, utilise régulièrement **Exporter une sauvegarde complète (JSON)**, puis conserve ce fichier dans Fichiers/iCloud Drive, sur ton ordinateur ou une autre destination de ton choix.
- Pour restaurer : **Profil** → **Restaurer une sauvegarde JSON**.
- Si tu republies une mise à jour de l'application, garde **la même adresse Netlify** pour conserver l'accès aux données locales associées à cette origine. Sinon, exporte JSON puis importe-le sur le nouveau site.

## Limites actuelles

- Ce n'est **pas** une application native publiée dans l'App Store : il s'agit d'une PWA installée sur l'écran d'accueil.
- Les sons, vibrations, notifications et minuteurs d'intervalles ne sont **pas fiables en arrière-plan sur iOS**. Laisse MakeItHybrid ouverte au premier plan pendant les intervalles. Le chronomètre recalcule le temps écoulé lorsque tu reviens dans l'app, sans garantir les alertes manquées.
- Pas d'intégration GPS, Apple Santé, Polar, Garmin ou Strava.
- Pas de synchronisation cloud multi-appareils.
- Les descriptions d'exercices sont incluses ; **pas encore de photos/vidéos d'exercices**.
- À tester sur ton propre iPhone une fois publié. Les vérifications automatisées ont été exécutées dans un navigateur Chromium simulé et ne remplacent pas un test sur Safari iOS.

## Utilisation sur ordinateur, sans déployer

Si tu as Python sur ton ordinateur :

```bash
# Depuis le dossier qui contient index.html
python3 -m http.server 8000
```

Ouvre `http://localhost:8000` dans ton navigateur. Il ne suffit pas de double-cliquer `index.html` directement en mode fichier, car le programme est chargé avec `fetch` et nécessite une origine web.

## Architecture et tests

- `index.html` : document de l'application.
- `src/styles.css` : thème et interface mobile.
- `src/app.mjs` : navigation, programmes, journal, statistiques, chrono et formulaires.
- `src/utils.mjs` : fonctions de dates et calculs sportifs.
- `src/store.mjs` : sauvegarde IndexedDB.
- `public/programme.json` : **30 séances / 175 exercices** extraits du programme original.
- `public/icon.svg` et `public/icon-apple.png` : icône de l'app.
- `manifest.webmanifest` et `sw.js` : installation PWA et cache hors ligne.
- `tests/test-utils.mjs` : tests de calculs et validation des données.

Les fichiers fonctionnent sans npm, sans React, sans serveur applicatif et sans appel API.

Tests facultatifs si Node.js est installé :

```bash
node --test tests/test-utils.mjs
```

## Évolutions envisageables

Suivi d'un cycle de préparation spécifique jusqu'à Sierre-Zinal 2027, modèles de séances plus avancés, photos des mouvements et synchronisation optionnelle multi-appareils.
