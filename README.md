# Recommendation-poject-SOA
 # 🔮 Système de Recommandations Personnalisées - Microservices Architecture

## 🎯 Objectif de l'application

Fournir des recommandations personnalisées à des utilisateurs en se basant sur leurs **préférences** et **comportements** (clics, évaluations, historique…).

---

## 🧱 Architecture Microservices

| Microservice               | Type        | Description |
|---------------------------|-------------|-------------|
| `user-service`            | REST        | Gestion des utilisateurs et de leurs profils |
| `item-service`            | REST        | Gestion des items recommandables (films, produits, musiques...) |
| `activity-tracking-service` | Kafka Producer | Publie les activités utilisateur (clics, likes, vues…) dans Kafka |
| `recommendation-service`  | gRPC        | Consomme Kafka, calcule et stocke les recommandations personnalisées |
| `graphql-gateway`         | GraphQL     | Permet des requêtes flexibles pour accéder aux recommandations |
| `api-gateway`             | Express.js  | Fait l’orchestration entre REST, GraphQL et gRPC |

---


---

## ⚙️ Fonctionnalités Implémentées

### ✅ `user-service` (REST)
- CRUD des utilisateurs
- Endpoint `GET /users` pour récupérer la liste
- Stockage MongoDB

### ✅ `item-service` (REST)
- CRUD des items
- Endpoint `GET /items` pour récupérer tous les items
- Stockage MongoDB

### ✅ `activity-tracking-service` (Kafka Producer)
- Endpoint `POST /trackActivity`
- Envoie les événements dans un topic Kafka
- Format : `{ username, action, itemId, timestamp }`

### ✅ `recommendation-service` (gRPC)
- Consomme les événements Kafka
- Calcule les recommandations personnalisées (logique simple ou à améliorer)
- Stocke les résultats en mémoire ou base

### ✅ `graphql-gateway`
- Requête `getRecommendationsByUsername(username: String): Recommendation`
- Renvoie une liste d’`itemIds` personnalisés

### ✅ `api-gateway` (Express.js)
- Orchestration :
  - REST (`/users`, `/items`, `/trackActivity`)
  - GraphQL (`/graphql`)
  - gRPC (vers le `recommendation-service`)
- Point d’entrée principal pour le frontend

---


