package ma.encg.chatservice.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseAiResponseDTO {

    private UUID idResponse;

    private String content;

    private LocalDateTime createdAt;
}