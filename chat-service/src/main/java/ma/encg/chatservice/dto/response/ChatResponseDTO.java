package ma.encg.chatservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatResponseDTO {

    private UUID conversationId;

    private String conversationTitle;

    private UUID messageId;

    private UUID responseId;

    private String answer;

    private LocalDateTime createdAt;

}