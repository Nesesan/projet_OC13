package com.nesesan.chat.config;

import com.nesesan.chat.chat.ChatMessage;
import com.nesesan.chat.chat.MessageType;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

/**
 * Cette classe écoute les événements WebSocket liés au cycle de vie des sessions
 * (ici : la déconnexion d’un utilisateur).
 */
@Component // Indique à Spring que cette classe est un bean géré par le conteneur
public class WebSocketEventListener {

    /**
     * Permet d'envoyer des messages via STOMP aux clients WebSocket
     */
    private final SimpMessageSendingOperations messagingTemplate;

    /**
     * Injection du messagingTemplate par Spring
     */
    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Méthode appelée automatiquement par Spring
     * lorsqu’un client se déconnecte du WebSocket
     */
    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {

        // Permet d'accéder aux headers STOMP et aux attributs de session
        StompHeaderAccessor headerAccessor =
                StompHeaderAccessor.wrap(event.getMessage());

        // Récupération du nom d'utilisateur stocké dans la session WebSocket
        String username = (String)
                headerAccessor.getSessionAttributes().get("username");

        // Vérifie que l'utilisateur existe bien
        if (username != null) {

            // Log côté serveur
            System.out.println("User disconnected: " + username);

            // Création d'un message de chat indiquant que l'utilisateur quitte
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(MessageType.LEAVE); // Type : départ du chat
            chatMessage.setSender(username);        // Utilisateur concerné

            // Envoi du message à tous les clients abonnés au topic public
            messagingTemplate.convertAndSend("/chat/public", chatMessage);
        }
    }
}
