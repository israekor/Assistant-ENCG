package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.DocumentRag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DocumentRagRepository extends JpaRepository<DocumentRag, UUID> {
    List<DocumentRag> findByDocumentType(String documentType);
    List<DocumentRag> findByLanguage(String language);
}