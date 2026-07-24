package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    Optional<Feedback> findByResponseAiIdResponse(UUID idResponse);

    @Query("""
    SELECT COUNT(f)
    FROM Feedback f
    WHERE f.feedbackType = 'LIKE'
      AND f.responseAi.message.conversation.userId = :userId
""")
    long countLikesByUserId(UUID userId);

    @Query("""
    SELECT COUNT(f)
    FROM Feedback f
    WHERE f.feedbackType = 'DISLIKE'
      AND f.responseAi.message.conversation.userId = :userId
""")
    long countDislikesByUserId(UUID userId);

    @Query("""
    SELECT COUNT(f)
    FROM Feedback f
    WHERE f.feedbackType = 'LIKE'
      AND f.responseAi.message.conversation.guestId = :guestId
""")
    long countLikesByGuestId(UUID guestId);

    @Query("""
    SELECT COUNT(f)
    FROM Feedback f
    WHERE f.feedbackType = 'DISLIKE'
      AND f.responseAi.message.conversation.guestId = :guestId
""")
    long countDislikesByGuestId(UUID guestId);

}