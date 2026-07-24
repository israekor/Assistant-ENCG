package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {

    Optional<Conversation> findByIdConversationAndUserId(
            UUID conversationId,
            UUID userId
    );

    List<Conversation> findByUserIdAndStatusOrderByUpdatedAtDesc(
            UUID userId,
            Status status
    );

    List<Conversation>findByUserIdAndStatusInOrderByUpdatedAtDesc(
            UUID userId,
            List<Status> statuses
    );

    List<Conversation> findByGuestIdAndStatusOrderByUpdatedAtDesc(
            UUID guestId,
            Status status
    );

    List<Conversation> findByUserIdOrderByUpdatedAtDesc(UUID userId);

    Optional<Conversation> findByIdConversationAndGuestId(
            UUID conversationId,
            UUID guestId
    );

    List<Conversation> findByGuestIdOrderByUpdatedAtDesc(UUID guestId);

    @Modifying
    @Query("""
    UPDATE Conversation c
    SET c.userId = :userId,
        c.guestId = null
    WHERE c.guestId = :guestId
    """)
    void transferGuestConversation(
            @Param("guestId") UUID guestId,
            @Param("userId") UUID userId
    );

    long countByUserId(UUID userId);

    long countByGuestId(UUID guestId);

    long countByUserIdAndStatus(
            UUID userId,
            Status status
    );

    long countByGuestIdAndStatus(
            UUID guestId,
            Status status
    );

    List<Conversation> findAllByUserId(UUID userId);

}