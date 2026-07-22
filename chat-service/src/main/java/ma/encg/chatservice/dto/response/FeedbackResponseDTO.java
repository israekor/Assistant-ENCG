package ma.encg.chatservice.dto.response;

import lombok.*;
import ma.encg.chatservice.entity.enums.FeedbackType;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackResponseDTO {

    private UUID idFeedback;

    private FeedbackType feedbackType;

    private String comment;

    private LocalDateTime createdAt;
}