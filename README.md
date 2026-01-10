# projet_OC13 – POC Chat Temps Réel

## Description
Ce projet est un Proof of Concept (POC) dont l’objectif est de démontrer la mise en place
d’un chat temps réel simple entre un frontend Angular et un backend Java Spring Boot via WebSocket.

Le périmètre du projet est volontairement limité : il vise uniquement à valider la communication
temps réel frontend ↔ backend.

---

## Stack technique

### Backend
- Java 17
- Spring Boot
- Spring WebSocket
- Maven

### Frontend
- Angular 14
- TypeScript
- RxJS
- WebSocket (STOMP)

---

## Prérequis
- Java 17 ou supérieur
- Maven 3+
- Node.js 18+
- Angular CLI v14
- MongoDB (local ou accessible via URI `mongodb://localhost:27017`)

---
## Base de données

Le script SQL des différentes tables pour le projet global se trouve dans `backend/db/init.sql`.

Pour ce POC, **les messages du chat sont stockés uniquement en mémoire** et aucune table n’est réellement utilisée.  
Le script est fourni pour démontrer la structure et permettre une évolution future vers une vraie persistance.

---
## Démarrage du projet

### 1. Lancer le backend
Depuis le dossier `backend` :

```bash
mvn clean install
mvn spring-boot:run
```

### 1. Lancer le frontend
Depuis le dossier `chat-front` :

```bash
npm install
npm install @stomp/stompjs
npm start
```
