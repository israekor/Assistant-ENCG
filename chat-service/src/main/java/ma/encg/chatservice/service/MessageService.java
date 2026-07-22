package ma.encg.chatservice.service;

import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;

import java.util.List;
import java.util.UUID;

public interface MessageService {

    List<Message> getConversationMessages(Conversation conversation);

    Message saveMessage(String content, Conversation conversation);

    Message getMessage(UUID messageId);
}