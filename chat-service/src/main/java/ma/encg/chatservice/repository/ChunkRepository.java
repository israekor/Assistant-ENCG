package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.Chunk;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChunkRepository extends JpaRepository<Chunk, UUID> {
    List<Chunk> findByDocumentIdDoc(UUID idDoc);
}