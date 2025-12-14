'use strict';

(() => {

    // DOM
    const usernamePage = document.querySelector('#username-page');
    const chatPage = document.querySelector('#chat-page');
    const usernameForm = document.querySelector('#usernameForm');
    const messageForm = document.querySelector('#messageForm');
    const messageInput = document.querySelector('#message');
    const messageArea = document.querySelector('#messageArea');
    const connectingElement = document.querySelector('.connecting');
    const nameInput = document.querySelector('#name');

    //  STATE
    let stompClient = null;
    let username = null;

    const colors = [
        '#2196F3', '#32c787', '#00BCD4', '#ff5652',
        '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
    ];

    // CONNECTION
    function connect(e) {
        e.preventDefault();

        username = nameInput.value.trim();
        if (!username) return;

        usernamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/wss');
        stompClient = Stomp.over(socket);
        stompClient.debug = null; // désactive logs STOMP

        stompClient.connect({}, onConnected, onError);
    }

    function onConnected() {
        stompClient.subscribe('/chat/public', onMessageReceived);

        stompClient.send(
            '/app/chat.addUser',
            {},
            JSON.stringify({ sender: username, type: 'JOIN' })
        );

        connectingElement.classList.add('hidden');
    }

    function onError(error) {
        console.error('WebSocket error:', error);
        connectingElement.textContent =
            'Could not connect to WebSocket server. Please refresh this page.';
        connectingElement.style.color = 'red';
    }

    // MESSAGES
    function sendMessage(e) {
        e.preventDefault();

        if (!stompClient) return;

        const content = messageInput.value.trim();
        if (!content) return;

        stompClient.send(
            '/app/chat.sendMessage',
            {},
            JSON.stringify({
                sender: username,
                content,
                type: 'CHAT'
            })
        );

        messageInput.value = '';
    }

    function onMessageReceived(payload) {
        const { sender, content, type } = JSON.parse(payload.body);
        const messageElement = document.createElement('li');

        if (type !== 'CHAT') {
            messageElement.classList.add('event-message');
            messageElement.textContent =
                `${sender} ${type === 'JOIN' ? 'joined' : 'left'}!`;
        } else {
            messageElement.classList.add('chat-message');
            messageElement.append(
                createAvatar(sender),
                createUsername(sender),
                createText(content)
            );
        }

        messageArea.appendChild(messageElement);
        messageArea.scrollTop = messageArea.scrollHeight;
    }

    // HELPERS
    function createAvatar(sender) {
        const avatar = document.createElement('i');
        avatar.textContent = sender[0];
        avatar.style.backgroundColor = getAvatarColor(sender);
        return avatar;
    }

    function createUsername(sender) {
        const span = document.createElement('span');
        span.textContent = sender;
        return span;
    }

    function createText(content) {
        const p = document.createElement('p');
        p.textContent = content;
        return p;
    }

    function getAvatarColor(sender) {
        let hash = 0;
        for (let i = 0; i < sender.length; i++) {
            hash = 31 * hash + sender.charCodeAt(i);
        }
        return colors[Math.abs(hash % colors.length)];
    }

    // EVENTS
    usernameForm.addEventListener('submit', connect);
    messageForm.addEventListener('submit', sendMessage);

})();
