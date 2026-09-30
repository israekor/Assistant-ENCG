package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.external.CurrentUserDTO;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import ma.encg.chatservice.entity.enums.Status;
import ma.encg.chatservice.exception.ConversationNotFoundException;
import ma.encg.chatservice.exception.UnauthorizedException;
import ma.encg.chatservice.mapper.ConversationHistoryMapper;
import ma.encg.chatservice.repository.ConversationRepository;
import ma.encg.chatservice.service.ConversationService;
import ma.encg.chatservice.dto.response.ConversationHistoryResponseDTO;
import ma.encg.chatservice.service.CurrentUserService;
import ma.encg.chatservice.service.MessageService;
import ma.encg.chatservice.service.ResponseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ConversationServiceImpl
        implements ConversationService {

    private final ConversationRepository conversationRepository;
    private final CurrentUserService currentUserService;
    private final MessageService messageService;
    private final ResponseService responseService;
    private final ConversationHistoryMapper conversationHistoryMapper;

    private Conversation findCurrentUserConversation(UUID conversationId) {

        CurrentUserDTO currentUser = currentUserService.getCurrentUser();

        if (currentUser.isAuthenticated()) {

                return conversationRepository
                        .findByIdConversationAndUserId(
                                conversationId,
                                currentUser.getIdUser()
                        )
                        .orElseThrow(() ->
                                new ConversationNotFoundException(
                                        "Conversation introuvable."
                                ));

        }

        return conversationRepository
                .findByIdConversationAndGuestId(
                        conversationId,
                        currentUser.getGuestId()
                )
                .orElseThrow(() ->
                        new ConversationNotFoundException(
                                "Conversation introuvable."
                        ));
        }

    @Override
    public Conversation createConversation() {

        CurrentUserDTO currentUser =
                currentUserService.getCurrentUser();

        Conversation.ConversationBuilder builder =
                Conversation.builder()
                        .title("Nouvelle conversation")
                        .status(Status.ACTIVE);

        if (currentUser.isAuthenticated()) {

            builder.userId(currentUser.getIdUser());

        } else {

            builder.guestId(currentUser.getGuestId());

        }

        return conversationRepository.save(builder.build());
    }

    @Override
    @Transactional(readOnly = true)
    public Conversation getConversation(UUID conversationId) {

        return findCurrentUserConversation(conversationId);

    }

    @Override
    public Conversation getOrCreateConversation(UUID conversationId) {

        if (conversationId == null) {
            return createConversation();
        }

        return getConversation(conversationId);
    }

    @Override
    public List<ConversationHistoryResponseDTO> getConversationHistory(UUID conversationId) {
        Conversation conversation = getConversation(conversationId);

        List<Message> messages =
                messageService.getConversationMessages(conversation);

        List<ConversationHistoryResponseDTO> history = new ArrayList<>();

        for (Message message : messages) {

            history.add(
                    conversationHistoryMapper.toUserDTO(message)
            );

            ResponseAi response =
                    responseService.getResponseByMessage(message);

            history.add(
                    conversationHistoryMapper.toAssistantDTO(response)
            );

        }

        return history;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Conversation> getCurrentUserConversations() {

        CurrentUserDTO currentUser =
                currentUserService.getCurrentUser();

        if(currentUser.isAuthenticated()){

            return conversationRepository
                    .findByUserIdAndStatusInOrderByUpdatedAtDesc(
                            currentUser.getIdUser(),
                            List.of(Status.ACTIVE, Status.ARCHIVED)
                    );
        }

        return conversationRepository
                .findByUserIdAndStatusInOrderByUpdatedAtDesc(
                        currentUser.getGuestId(),
                        List.of(Status.ACTIVE, Status.ARCHIVED)
                );
    }

    @Override
    @Transactional(readOnly = true)
    public List<Conversation> getActiveConversations() {

        CurrentUserDTO currentUser =
                currentUserService.getCurrentUser();

        if(currentUser.isAuthenticated()){

            return conversationRepository
                    .findByUserIdAndStatusOrderByUpdatedAtDesc(
                            currentUser.getIdUser(),
                            Status.ACTIVE
                    );
        }

        return conversationRepository
                .findByGuestIdAndStatusOrderByUpdatedAtDesc(
                        currentUser.getGuestId(),
                        Status.ACTIVE
                );
    }

    @Override
    public void linkGuestConversation(
            UUID guestId
    ) {

        CurrentUserDTO currentUser = currentUserService.getCurrentUser();

        if (!currentUser.isAuthenticated()) {
            throw new UnauthorizedException(
                    "Vous devez être connecté."
            );
        }

        conversationRepository.transferGuestConversation(
                guestId,
                currentUser.getIdUser()
        );

    }

    @Override
    public void archiveConversation(UUID conversationId) {

        Conversation conversation = findCurrentUserConversation(conversationId);

        conversation.setStatus(Status.ARCHIVED);
    }

    @Override
    public void restoreConversation(UUID conversationId) {

        Conversation conversation = findCurrentUserConversation(conversationId);

        conversation.setStatus(Status.ACTIVE);
    }

    @Override
    public void deleteConversation(UUID conversationId) {

        Conversation conversation = findCurrentUserConversation(conversationId);

        conversation.setStatus(Status.CLOSED);
    }

    @Override
    public void deleteAllCurrentUserConversations() {

        UUID userId = currentUserService
                .getCurrentUser()
                .getIdUser();

        List<Conversation> conversations =
                conversationRepository.findAllByUserId(userId);
        if (conversations.isEmpty()) {
            return;
        }

        conversationRepository.deleteAll(conversations);

    }

    private String generateTemporaryTitle(String message) {
        String title = message.trim().replaceAll("\\s+", " ");

        if (title.length() <= 50) {
            return title;
        }

        int cut = title.lastIndexOf(' ', 50);
        return title.substring(0, cut > 20 ? cut : 50) + "...";
    }

    @Override
    public String generateTitleIfNecessary(UUID conversationId, String firstMessage) {
        if (firstMessage == null || firstMessage.isBlank()) {
            return null;
        }
        String title = generateTemporaryTitle(firstMessage);
        int updated = conversationRepository.updateTitleIfDefault(conversationId, title);
        return updated > 0 ? title : null;
    }

}