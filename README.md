# projet_OC13 – POC Chat Temps Réel

## Description

Ce projet est un **Proof of Concept (POC)** dont l’objectif est de démontrer la mise en place d’un **chat temps réel simple** entre un frontend Angular et un backend Java Spring Boot via **WebSocket**.

Le périmètre du projet est volontairement limité : il vise uniquement à **valider la communication temps réel frontend ↔ backend**

---

## Stack technique

### Backend
- Java 17
- Spring Boot
- Spring WebSocket
- Maven

### Frontend
- Angular 14
- RxJS
- TypeScript
- WebSocket natif

---

## Prérequis

- Java 17 ou supérieur
- Maven
- Node.js
- Angular CLI (v14)

---

## Démarrage du projet

### 1. Lancer le backend

Depuis le dossier **backend** :


mvn clean install
mvn spring-boot:run

Depuis le dossier **FrontEnd** :
Lancer le frontend

### 2. Lancer le backend

Depuis le dossier **FrontEnd** :

npm install
npm start