package ma.encg.chatservice.entity;

import jakarta.persistence.*;
import lombok.*;
import ma.encg.chatservice.entity.enums.FeedbackType;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "feedbacks")
public class Feedback extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id_feedback", updatable = false, nullable = false)
    private UUID idFeedback;

    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type")
    private FeedbackType feedbackType;

    @Column(length = 500)
    private String comment;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "id_response",
            unique = true,
            nullable = false
    )
    private ResponseAi responseAi;
}