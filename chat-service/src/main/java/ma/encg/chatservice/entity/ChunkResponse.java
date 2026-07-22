package ma.encg.chatservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chunk_response")
public class ChunkResponse {

    @EmbeddedId
    private ChunkResponseId id = new ChunkResponseId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idChunk")
    @JoinColumn(name = "id_chunk", nullable = false)
    private Chunk chunk;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("idResponse")
    @JoinColumn(name = "id_response", nullable = false)
    private ResponseAi responseAi;

    @NotNull
    @Column(name = "similarity_score")
    private Float similarityScore;
}