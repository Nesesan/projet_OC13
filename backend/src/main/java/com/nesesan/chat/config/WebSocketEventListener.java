package com.nesesan.chat.config;

import com.nesesan.chat.chat.ChatMessage;
import com.nesesan.chat.chat.MessageType;
import com.nesesan.chat.service.ChatService;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;
    private final ChatService chatMessageService;

    public WebSocketEventListener(SimpMessageSendingOperations messagingTemplate,
                                  ChatService chatMessageService) {
        this.messagingTemplate = messagingTemplate;
        this.chatMessageService = chatMessageService;
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");

        if (username != null) {
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setType(MessageType.LEAVE);
            chatMessage.setSender(username);

            messagingTemplate.convertAndSend("/chat/public", chatMessage);

            // Sauvegarde en base
            chatMessageService.saveMessage(chatMessage);
        }
    }
}
