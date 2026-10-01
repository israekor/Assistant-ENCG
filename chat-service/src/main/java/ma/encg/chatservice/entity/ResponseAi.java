package ma.encg.chatservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "responses_ai")
public class ResponseAi extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_response", updatable = false, nullable = false)
    private UUID idResponse;

    @NotBlank
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "rag_top_score")
    private Double ragTopScore;

    @Column(name = "rag_top_similarity")
    private Double ragTopSimilarity;

    @Column(name = "rag_chunks")
    private Integer ragChunks;

    @Column(name = "rag_top_source", length = 500)
    private String ragTopSource;

    @Column(name = "rag_ms")
    private Integer ragMs;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_message", nullable = false, unique = true)
    private Message message;

    @OneToOne(mappedBy = "responseAi",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    private Feedback feedback;

}