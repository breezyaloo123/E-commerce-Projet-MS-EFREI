# 🛒 Plateforme E-Commerce en Microservices

Projet complet et prêt à l'emploi basé sur une architecture de microservices avec **Node.js**, **Express**, **Docker** et **React.js**.

---

## 🏛️ Vue d'ensemble de l'Architecture

```
                                +-----------------------------------+
                                |         Client Frontend           |
                                |       (React 18 + Vite)           |
                                |      http://localhost:5173        |
                                +-----------------+-----------------+
                                                  |
                                                  | Requêtes HTTP /api/*
                                                  v
                                +-----------------------------------+
                                |            API Gateway            |
                                |         (Express + Proxy)         |
                                |       http://localhost:5000       |
                                +----+----------+----------+--------+
                                     |          |          |
            +------------------------+          |          +------------------------+
            |                                   |                                   |
            v                                   v                                   v
+-----------------------+           +-----------------------+           +-----------------------+
|     Auth Service      |           |    Product Service    |           |     Order Service     |
|   (JWT & Utilisateurs)|           |  (Catalogue & Stocks) |           |  (Paniers & Commandes)|
| http://localhost:5001 |           | http://localhost:5002 |           | http://localhost:5003 |
+-----------------------+           +-----------------------+           +-----------+-----------+
                                                                                    |
                                                                                    | Appel HTTP inter-service
                                                                                    v
                                                                        +-----------------------+
                                                                        |    Payment Service    |
                                                                        |   (Stripe / Factures) |
                                                                        | http://localhost:5004 |
                                                                        +-----------------------+
```

---

## 📦 Découpage des Microservices

| Service | Port | Rôle & Fonctionnalités | Technologies |
| :--- | :--- | :--- | :--- |
| **API Gateway** | `5000` | Point d'entrée unique, reverse proxy, agrégation du health check, CORS | Express, `http-proxy-middleware`, Axios |
| **Auth Service** | `5001` | Inscription, connexion, hachage bcrypt, tokens JWT, profils et rôles | Express, `jsonwebtoken`, `bcryptjs` |
| **Product Service** | `5002` | Gestion des articles, catégories, stocks, recherche et filtres | Express, CRUD produits |
| **Order Service** | `5003` | Création et suivi des commandes, appel synchrone au Payment Service | Express, Axios, modèle de commande |
| **Payment Service** | `5004` | Traitement des règlements, génération d'identifiants de transaction | Express, simulation paiement / Stripe-ready |
| **Frontend** | `5173` | Interface client moderne, réactive avec dashboard de statut microservices | React 18, Vite, Context API, Lucide Icons |

---

## 🚀 Démarrage Rapide

### Option 1 : Lancement en local avec Node.js & Concurrently

1. **Installation de toutes les dépendances** :
   ```bash
   npm run install:all
   ```

2. **Démarrage simultané de tous les microservices et du frontend** :
   ```bash
   npm run dev
   ```

3. Ouvrez votre navigateur sur : **[http://localhost:5173](http://localhost:5173)**

---

### Option 2 : Lancement avec Docker & Docker Compose

Si Docker Desktop est installé sur votre machine :

```bash
docker-compose up --build
```

Tous les microservices et le frontend démarreront dans un réseau Docker isolé (`ecommerce-network`).

---

## 🔌 Points de Terminaison (Endpoints API)

### 1. API Gateway (`http://localhost:5000`)
- `GET /api/health` : Statut en temps réel de tous les microservices et latences
- `ALL /api/auth/*` : Redirige vers l'Auth Service
- `ALL /api/products/*` : Redirige vers le Product Service
- `ALL /api/orders/*` : Redirige vers l'Order Service
- `ALL /api/payments/*` : Redirige vers le Payment Service

### 2. Auth Service (`http://localhost:5001`)
- `POST /register` : `{ name, email, password }`
- `POST /login` : `{ email, password }`
- `GET /profile` : Récupère le profil (Nécessite le Header `Authorization: Bearer <token>`)
- `GET /verify` : Valide l'authenticité d'un jeton JWT

### 3. Product Service (`http://localhost:5002`)
- `GET /` : Liste des articles (paramètres optionnels `?category=...&search=...`)
- `GET /categories` : Liste de toutes les catégories
- `GET /:id` : Fiche détaillée d'un article
- `POST /` : Ajout d'un nouvel article `{ name, price, description, category, stock, imageUrl }`
- `PUT /:id` : Mise à jour d'un article
- `DELETE /:id` : Suppression d'un article

### 4. Order Service (`http://localhost:5003`)
- `GET /` : Liste de toutes les commandes (filtrage possible `?userId=...`)
- `GET /:id` : Détail d'une commande
- `POST /` : Création de commande avec règlement automatique via le Payment Service
- `PATCH /:id/status` : Mise à jour du statut (`PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)

### 5. Payment Service (`http://localhost:5004`)
- `POST /process` : `{ orderId, amount, currency, paymentMethod }`
- `GET /status/:transactionId` : Statut d'une transaction
- `GET /transactions` : Historique des transactions de paiement

---

## 🔑 Comptes de Démonstration (Pré-configurés)

Dans l'interface frontend, vous pouvez utiliser les boutons d'accès rapide ou vous connecter avec :

- **Client Démo :**
  - Email : `alice@example.com`
  - Mot de passe : `password123`

- **Administrateur Démo :**
  - Email : `admin@example.com`
  - Mot de passe : `admin123`

---

## 🛠️ Comment brancher des vraies bases de données ?

Chaque microservice est conçu selon le principe de **Database per Service** (une base par service pour garantir l'indépendance) :

1. **Auth Service** :
   - Brancher MongoDB (`mongoose`) ou PostgreSQL (`prisma`) dans `services/auth-service/src/models/userModel.js`.
2. **Product Service** :
   - Brancher MongoDB ou PostgreSQL dans `services/product-service/src/controllers/productController.js`.
3. **Order Service** :
   - Brancher PostgreSQL (recommandé pour les commandes et transactions ACID) ou MongoDB.
4. **Communication Asynchrone (optionnel pour haute volumétrie)** :
   - Ajouter un courtier de messages comme **RabbitMQ** ou **Kafka** pour notifier les commandes payées sans bloquer la requête HTTP.
