package ma.encg.chatservice.service.implementation;

import ma.encg.chatservice.service.*;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.request.ChatRequestDTO;
import ma.encg.chatservice.dto.response.ChatResponseDTO;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import org.springframework.stereotype.Service;
import ma.encg.chatservice.mapper.ChatMapper;

@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final ConversationService conversationService;
    private final MessageService messageService;
    private final LLMService LLMService;
    private final RagService RagService;
    private final ResponseService responseService;
    private final ChatMapper chatMapper;

    @Override
    public ChatResponseDTO chat(ChatRequestDTO request) {

        Conversation conversation =
                conversationService.getOrCreateConversation(
                        request.getConversationId()
                );

        Message message =
                messageService.saveMessage(
                        request.getMessage(),
                        conversation
                );

        String context =
                RagService.retrieveContext(message.getContent());

        String answer =
                LLMService.generateAnswer(
                        message.getContent(),
                        context
                );

        ResponseAi response =
                responseService.saveResponse(
                        message,
                        answer
                );

        conversationService.generateTitleIfNecessary(conversation);

        return chatMapper.toChatResponse(
                conversation,
                message,
                response
        );
    }
}