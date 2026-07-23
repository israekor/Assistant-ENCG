package ma.encg.chatservice.dto.response;

import lombok.*;
import ma.encg.chatservice.entity.enums.ChatRole;

import java.util.UUID;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationHistoryResponseDTO {

    private UUID id;

    private ChatRole role;

    private String content;

    private UUID responseId;

    private FeedbackResponseDTO feedback;

    private LocalDateTime createdAt;
}