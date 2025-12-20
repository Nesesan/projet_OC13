package com.nesesan.chat.chat;

public class ChatMessage {

    private String content;   // Contenu du message
    private String sender;    // Nom de l'utilisateur
    private MessageType type; // Type du message (CHAT, JOIN, LEAVE)

    public ChatMessage() {} // Constructeur vide pour Jackson

    public ChatMessage(String content, String sender, MessageType type) {
        this.content = content;
        this.sender = sender;
        this.type = type;
    }

    // Getters
    public String getContent() { return content; }
    public String getSender() { return sender; }
    public MessageType getType() { return type; }

    // Setters
    public void setContent(String content) { this.content = content; }
    public void setSender(String sender) { this.sender = sender; }
    public void setType(MessageType type) { this.type = type; }
}
