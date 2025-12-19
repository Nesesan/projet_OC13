package com.nesesan.chat.chat;

/**
 * Représente un message échangé dans le chat WebSocket
 * Cet objet est envoyé entre le client et le serveur
 */
public class ChatMessage {

    /**
     * Contenu du message (texte écrit par l'utilisateur)
     */
    private String content;

    /**
     * Nom de l'utilisateur qui envoie le message
     */
    private String sender;

    /**
     * Type du message :
     * CHAT  → message classique
     * JOIN  → utilisateur qui rejoint le chat
     * LEAVE → utilisateur qui quitte le chat
     */
    private MessageType type;

    /**
     * Constructeur vide
     * Obligatoire pour la désérialisation JSON (Jackson)
     */
    public ChatMessage() {}

    /**
     * Constructeur complet
     */
    public ChatMessage(String content, String sender, MessageType type) {
        this.content = content;
        this.sender = sender;
        this.type = type;
    }


    // Getters
    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

    public MessageType getType() {
        return type;
    }


    // Setters

    public void setContent(String content) {
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}
