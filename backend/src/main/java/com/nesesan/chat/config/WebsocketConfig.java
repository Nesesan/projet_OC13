package com.nesesan.chat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Classe de configuration WebSocket avec STOMP
 * Elle définit :
 * - le point d'entrée WebSocket
 * - la façon dont les messages sont routés (client → serveur → clients)
 */
@Configuration // Indique que cette classe contient une configuration Spring
@EnableWebSocketMessageBroker // Active la gestion des messages WebSocket avec STOMP
public class WebsocketConfig implements WebSocketMessageBrokerConfigurer {

    /**
     * Enregistre le endpoint WebSocket auquel les clients vont se connecter
     * Exemple côté client :
     *   const socket = new SockJS('/wss');
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        // Endpoint WebSocket principal
        // withSockJS() permet de gérer les navigateurs qui ne supportent pas WebSocket
        registry.addEndpoint("/wss")
                .withSockJS();
    }

    /**
     * Configure le broker de messages
     * Définit les règles de routage des messages STOMP
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {

        // Tous les messages envoyés par le client vers le serveur
        // devront commencer par /app
        // Exemple : /app/chat.sendMessage
        registry.setApplicationDestinationPrefixes("/app");

        // Active un broker de messages simple (en mémoire)
        // Les clients peuvent s'abonner à ces destinations
        // Exemple : /chat/public
        registry.enableSimpleBroker("/chat");
    }
}
