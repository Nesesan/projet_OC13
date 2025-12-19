'use strict';

/**
 * IIFE (Immediately Invoked Function Expression)
 * → évite de polluer le scope global
 */
(() => {

    // =======================
    // RÉFÉRENCES DOM
    // =======================

    const usernamePage = document.querySelector('#username-page'); // page login
    const chatPage = document.querySelector('#chat-page');         // page chat
    const usernameForm = document.querySelector('#usernameForm');  // formulaire username
    const messageForm = document.querySelector('#messageForm');    // formulaire message
    const messageInput = document.querySelector('#message');       // input message
    const messageArea = document.querySelector('#messageArea');    // liste messages
    const connectingElement = document.querySelector('.connecting'); // statut connexion
    const nameInput = document.querySelector('#name');             // input username


    // ÉTAT DE L'APPLICATION


    let stompClient = null; // client STOMP (Simple Text Oriented Messaging Protocol)
    let username = null;    // nom de l'utilisateur connecté

    // Couleurs utilisées pour les avatars (
    const colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];


    // CONNEXION WEBSOCKET


    function connect(e) {
        e.preventDefault(); // empêche le rechargement du formulaire

        // Récupération et nettoyage du nom d'utilisateur
        username = nameInput.value.trim();
        if (!username) return;

        // Cache la page username et affiche le chat
        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        // Création de la connexion WebSocket via SockJS
        const socket = new SockJS('/wss');

        // Création du client STOMP au-dessus du WebSocket
        stompClient = Stomp.over(socket);

        // Désactive les logs STOMP dans la console
        stompClient.debug = null;

        // Connexion au serveur
        stompClient.connect({}, onConnected, onError);
    }

    /**
     * Appelé quand la connexion WebSocket est établie
     */
    function onConnected() {

        // Abonnement au topic public du chat
        stompClient.subscribe('/chat/public', onMessageReceived);

        // Envoi d'un message JOIN au serveur
        stompClient.send(
            '/app/chat.addUser',
            {},
            JSON.stringify({ sender: username, type: 'JOIN' })
        );

        // Cache le message "Connecting..."
        connectingElement.classList.add('hidden');
    }

    /**
     * Appelé en cas d'erreur de connexion
     */
    function onError(error) {
        console.error('WebSocket error:', error);
        connectingElement.textContent =
            'Could not connect to WebSocket server. Please refresh this page.';
        connectingElement.style.color = 'red';
    }


    // GESTION DES MESSAGES


    function sendMessage(e) {
        e.preventDefault();

        // Vérifie que le client est connecté
        if (!stompClient) return;

        const content = messageInput.value.trim();
        if (!content) return;

        // Envoie un message CHAT au serveur
        stompClient.send(
            '/app/chat.sendMessage',
            {},
            JSON.stringify({
                sender: username,
                content,
                type: 'CHAT'
            })
        );

        // Vide le champ texte
        messageInput.value = '';
    }

    /**
     * Réception d'un message depuis le serveur
     */
    function onMessageReceived(payload) {

        // Conversion du message JSON
        const { sender, content, type } = JSON.parse(payload.body);

        const messageElement = document.createElement('li');

        // Message système (JOIN / LEAVE)
        if (type !== 'CHAT') {
            messageElement.classList.add('event-message');
            messageElement.textContent =
                `${sender} ${type === 'JOIN' ? 'joined' : 'left'}!`;
        }
        // Message de chat classique
        else {
            messageElement.classList.add('chat-message');
            messageElement.append(
                createAvatar(sender),
                createUsername(sender),
                createText(content)
            );
        }

        // Ajoute le message à la liste
        messageArea.appendChild(messageElement);

        // Scroll automatique vers le bas
        messageArea.scrollTop = messageArea.scrollHeight;
    }


    // FONCTIONS UTILITAIRES

    // Crée l'avatar avec la première lettre du pseudo
    function createAvatar(sender) {
        const avatar = document.createElement('i');
        avatar.textContent = sender[0];
        avatar.style.backgroundColor = getAvatarColor(sender);
        return avatar;
    }

    // Crée l'affichage du nom d'utilisateur
    function createUsername(sender) {
        const span = document.createElement('span');
        span.textContent = sender;
        return span;
    }

    // Crée le texte du message
    function createText(content) {
        const p = document.createElement('p');
        p.textContent = content;
        return p;
    }

    // Génère une couleur unique pour chaque utilisateur
    function getAvatarColor(sender) {
        let hash = 0;
        for (let i = 0; i < sender.length; i++) {
            hash = 31 * hash + sender.charCodeAt(i);
        }
        return colors[Math.abs(hash % colors.length)];
    }


    // ÉVÉNEMENTS
    usernameForm.addEventListener('submit', connect);
    messageForm.addEventListener('submit', sendMessage);

})();
