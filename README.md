# 🛒 Test Technique / Catalogue d'Articles avec Pagination & Filtres

Ce projet est une application web full-stack (React / Node.js / MongoDB) permettant de naviguer de maniere fluide et performante dans un catalogue de produits. L'accent a ete mis sur l'optimisation des requetes de base de donnees, la securite et la robustesse face aux erreurs.

---

# Link

[test-pagination](https://thomas-milin-test-pagination.onrender.com)

---

## 🚀 Fonctionnalites & Reponses au Cahier des Charges

### 1. Performance & Pagination (Cote Serveur)
* **Strategie retenue :** Pagination classique par numéros de page + selecteur de limite (`limit`) (nombre d'article affiche).
* **Implementation Backend :** Contrairement a un chargement global, les donnees sont extraites par blocs ("chunks") directement depuis MongoDB en utilisant les opérateurs `.skip()` et `.limit()` (methode mongo).
* **Optimisation :** La reponse de l'API renvoie egalement le nombre total d'articles correspondants (`total`), permettant au Frontend de calculer dynamiquement le nombre de pages sans surcharger le reseau.

### 2. Recherche, Filtrage et Tri
* **Filtrage par Categorie :** Cote Backend, la requete utilise un filtre dynamique `{ category: ... }` uniquement si le paramètre est fourni.
* **Tri par Prix :** Integration d'un tri numerique croissant et decroissant via l'operateur `.sort()` de MongoDB (ex: `{ price: 1 }` ou `{ price: -1 }`).
* **Tri par Date :** Integration d'un tri chronologique via l'operateur `.sort()` de MongoDB (ex: `{ createdAt: 1 }` ou `{ createdAt: -1 }`) permettant d'afficher les nouveautes en premier ou en dernier.

### 3. Fiabilite & Gestion des Cas Limites
L'application a eete blindee pour eviter tout crash (`exit 1`) ou comportement imprevu :
* **Paramètres invalides :** Si un utilisateur injecte une page negative ou du texte a la place d'un nombre (ex: `page=abc`), le Backend applique des valeurs par defaut securisees (`page = 1`, `limit = 10`).
* **Resultats vides :** Si un filtre ne retourne aucun article, le Frontend l'intercepte proprement et affiche un message collaboratif à l'utilisateur ("Aucun produit trouve") au lieu de crasher.
* **Erreurs Reseau / Serveur :** Utilisation de blocs `try/catch` globaux sur les routes Express avec renvoi de codes HTTP appropries (`500 Internal Server Error`) (`backend block app.get("/api/products ...`).

---

## 🛠️ Contraintes Techniques Respectees

| Couche | Technologie Choisie | Justification / Respect des contraintes |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Interface utilisateur reactive, synchronisation de la pagination avec l'etat local. |
| **Backend** | Node.js / Express | Architecture REST propre avec parsing des query parameters (`req.query`). |
| **Base de donnees** | MongoDB Natif | **Utilisation stricte du driver `mongodb` officiel, sans Mongoose.** Les requetes de tri sont ecrites manuellement. |

### 🔒 Securite & Environnement
Pour eviter l'exposition d'identifiants sensibles sur GitHub (notamment pour la connexion à MongoDB Cloud Atlas), l'URI de la base de donnees a ete totalement externalisee dans un fichier `.env` local, appele de maniere securisee par Docker Compose via la variable `${CLOUD_MONGO_URI}`.
Vite a ete retouche pour pouvoir ajouter `usePolling : true` (reactivite par LiveReload), `base : './'` (pour la portabilite de "l'application" (pour que l'hebergeur de site render puisse lire mon css));

---

## 📦 Documentation de l'API REST

### `GET /api/products`
Recupere la liste des articles filtree et paginee.

**Parametres de requete (Query Params) :**
* `page` (Number, optionnel) : Numero de la page (Defaut : `1`).
* `limit` (Number, optionnel) : Nombre d'articles par page (Defaut : `8`).
* `category` (String, optionnel) : Filtre par categorie (Ex: `?category=Chaussures` Default: "").
* `sort` (String, optionnel) : Champ sur lequel appliquer le tri. Valeurs : `price` ou `createdAt` (Defaut : `createdAt`).
* `order` (String, optionnel) : Direction du tri. Valeurs : `asc` ou `desc` (Defaut : `desc`, ce qui affiche les nouveautes en premier).

### tree
```
.
├── backend
│   ├── Dockerfile
│   ├── package.json
│   └── src
│       └── index.js         # ajout du bloc entre //////////
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── src
│   │   ├── App.jsx          # utilisation du useEffect : getProduct appel loadProduct pour charger les produits.
│   │   ├── index.css        # legere retouche graphique pour rendre le site plus "beau ?"
│   │   ├── loadProduct.jsx  # appel d'api avec les filtre category/limit/page/sort/order -> return la data pour getProduct.
│   │   └── main.jsx
│   └── vite.config.js
├── mongo-seed
│   ├── package.json         # ajout des packets mongo pour connecter le cloud et dotenv pour lire les variables d'environnement du .env
│   ├── package-lock.json      # ajout automatique !?
│   └── seed.js              # modification de seed.js pour connecter notre seed a notre cloud
└── README.md
```
