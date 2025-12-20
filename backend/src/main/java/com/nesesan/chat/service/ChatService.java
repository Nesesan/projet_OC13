package com.nesesan.chat.service;

import com.nesesan.chat.chat.ChatMessage;
import com.nesesan.chat.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    private final ChatMessageRepository repository;

    public ChatService(ChatMessageRepository repository) {
        this.repository = repository;
    }

    public ChatMessage saveMessage(ChatMessage message) {
        return repository.save(message);
    }
}
