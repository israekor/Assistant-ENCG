package ma.encg.chatservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversationResponseDTO {

    private UUID idConversation;

    private String title;

    private String status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}