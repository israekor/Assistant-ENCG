package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface ResponseAiRepository extends JpaRepository<ResponseAi, UUID> {

    Optional<ResponseAi> findById(UUID id);

    Optional<ResponseAi> findByMessage(Message message);

    Optional<ResponseAi> findByIdResponseAndMessageConversationUserId(
            UUID idResponse,
            UUID userId
    );
}