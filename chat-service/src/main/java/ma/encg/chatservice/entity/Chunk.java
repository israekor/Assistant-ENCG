package ma.encg.chatservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "chunks")
public class Chunk extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_chunk", updatable = false, nullable = false)
    private UUID idChunk;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @NotNull
    @Column(name = "chunk_order", nullable = false)
    private Integer chunkOrder;

    @NotNull
    @Column(name = "embedding_id")
    private UUID embeddingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_doc", nullable = false)
    private DocumentRag document;

    @OneToMany(mappedBy = "chunk", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChunkResponse> chunkResponses;
}