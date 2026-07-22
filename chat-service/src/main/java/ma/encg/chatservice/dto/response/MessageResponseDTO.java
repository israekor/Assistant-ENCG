package ma.encg.chatservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageResponseDTO {

    private UUID idMessage;

    private String content;

    private LocalDateTime createdAt;
}