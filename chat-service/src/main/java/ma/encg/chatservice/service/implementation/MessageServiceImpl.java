package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.exception.MessageNotFoundException;
import ma.encg.chatservice.repository.MessageRepository;
import ma.encg.chatservice.service.MessageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageServiceImpl
        implements MessageService {

    private final MessageRepository messageRepository;

    private Message findMessage(UUID id) {

        return messageRepository.findById(id)
                .orElseThrow(() ->
                        new MessageNotFoundException(
                                "Message introuvable."
                        ));
    }

    @Override
    public Message saveMessage(String content,
                               Conversation conversation) {

        Message message = Message.builder()
                .content(content)
                .conversation(conversation)
                .build();

        return messageRepository.save(message);
    }

    @Override
    @Transactional(readOnly = true)
    public Message getMessage(UUID messageId) {

        return findMessage(messageId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Message> getConversationMessages(
            Conversation conversation) {

        return messageRepository
                .findByConversationOrderByCreatedAtAsc(
                        conversation
                );
    }
}