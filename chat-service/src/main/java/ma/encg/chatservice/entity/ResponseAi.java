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

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_message", nullable = false, unique = true)
    private Message message;

    @OneToOne(mappedBy = "responseAi",
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY,
            orphanRemoval = true)
    private Feedback feedback;

    @OneToMany(mappedBy = "responseAi", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChunkResponse> chunkResponses;
}