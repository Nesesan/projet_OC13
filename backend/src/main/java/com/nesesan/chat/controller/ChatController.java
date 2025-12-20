package com.nesesan.chat.controller;

import com.nesesan.chat.chat.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

/**
 * Contrôleur WebSocket qui gère les messages du chat
 * Il joue le même rôle qu'un @RestController,
 * mais pour les communications WebSocket (STOMP)
 */
@Controller
public class ChatController {

    /**
     * Reçoit les messages envoyés par le client vers :
     *   /app/chat.sendMessage
     *
     * @MessageMapping = équivalent de @PostMapping en WebSocket
     * @SendTo = destination vers laquelle le message est diffusé
     */
    @MessageMapping("/chat.sendMessage")
    @SendTo("/chat/public")
    public ChatMessage sendMessage(
            @Payload ChatMessage chatMessage) {

        // Le message reçu est simplement renvoyé
        // à tous les clients abonnés à /chat/public
        return chatMessage;
    }

    /**
     * Gère l'arrivée d'un nouvel utilisateur dans le chat
     *
     * Le client envoie un message vers :
     *   /app/chat.addUser
     */
    @MessageMapping("/chat.addUser")
    @SendTo("/chat/public")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor) {

        // Stocke le nom d'utilisateur dans la session WebSocket
        // Il sera ensuite récupéré lors de la déconnexion
        headerAccessor.getSessionAttributes()
                .put("username", chatMessage.getSender());

        // Le message (JOIN) est envoyé à tous les clients
        return chatMessage;
    }
}
