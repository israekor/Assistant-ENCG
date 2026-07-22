package ma.encg.chatservice.repository;

import ma.encg.chatservice.entity.ChunkResponse;
import ma.encg.chatservice.entity.ChunkResponseId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ChunkResponseRepository extends JpaRepository<ChunkResponse, ChunkResponseId> {
    List<ChunkResponse> findByChunkIdChunk(UUID idChunk);
    List<ChunkResponse> findByResponseAiIdResponse(UUID idResponse);
}