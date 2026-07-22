package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FeedbackRepository extends JpaRepository<Feedback, UUID> {

    List<Feedback> findByResponseAiIdResponse(UUID idResponse);

    Optional<Feedback> findById(UUID id);
}