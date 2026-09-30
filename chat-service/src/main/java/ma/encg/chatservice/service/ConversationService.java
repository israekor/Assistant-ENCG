package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.response.ConversationHistoryResponseDTO;
import ma.encg.chatservice.entity.Conversation;

import java.util.List;
import java.util.UUID;

public interface ConversationService {

    Conversation createConversation();

    Conversation getConversation(UUID conversationId);

    Conversation getOrCreateConversation(UUID conversationId);

    List<ConversationHistoryResponseDTO> getConversationHistory(UUID conversationId);

    void linkGuestConversation(UUID guestId);

    List<Conversation> getCurrentUserConversations();

    List<Conversation> getActiveConversations();

    void archiveConversation(UUID conversationId);

    void restoreConversation(UUID conversationId);

    void deleteConversation(UUID conversationId);

    String generateTitleIfNecessary(UUID conversationId, String firstMessage);

    void deleteAllCurrentUserConversations();

}