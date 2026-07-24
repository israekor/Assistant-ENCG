package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.external.CurrentUserDTO;
import ma.encg.chatservice.dto.external.UserStatisticsDTO;
import ma.encg.chatservice.entity.enums.Status;
import ma.encg.chatservice.repository.ConversationRepository;
import ma.encg.chatservice.repository.FeedbackRepository;
import ma.encg.chatservice.repository.MessageRepository;
import ma.encg.chatservice.service.CurrentUserService;
import ma.encg.chatservice.service.ProfileService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProfileServiceImpl implements ProfileService {

    private final CurrentUserService currentUserService;

    private final ConversationRepository conversationRepository;
    private final MessageRepository messageRepository;
    private final FeedbackRepository feedbackRepository;

    @Override
    public UserStatisticsDTO getStatistics() {

        CurrentUserDTO currentUser =
                currentUserService.getCurrentUser();

        long conversations;
        long archived;
        long messages;
        long likes;
        long dislikes;

        if (currentUser.isAuthenticated()) {

            UUID userId = currentUser.getIdUser();

            conversations =
                    conversationRepository.countByUserId(userId);

            archived =
                    conversationRepository.countByUserIdAndStatus(
                            userId,
                            Status.ARCHIVED
                    );

            messages =
                    messageRepository.countByConversationUserId(userId);

            likes =
                    feedbackRepository.countLikesByUserId(userId);

            dislikes =
                    feedbackRepository.countDislikesByUserId(userId);

        } else {

            UUID guestId = currentUser.getGuestId();

            conversations =
                    conversationRepository.countByGuestId(guestId);

            archived =
                    conversationRepository.countByGuestIdAndStatus(
                            guestId,
                            Status.ARCHIVED
                    );

            messages =
                    messageRepository.countByConversationGuestId(guestId);

            likes =
                    feedbackRepository.countLikesByGuestId(guestId);

            dislikes =
                    feedbackRepository.countDislikesByGuestId(guestId);

        }

        return UserStatisticsDTO.builder()
                .conversations(conversations)
                .archivedConversations(archived)
                .messages(messages)
                .likes(likes)
                .dislikes(dislikes)
                .build();
    }
}