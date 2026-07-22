package ma.encg.chatservice.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRequestDTO {

    private UUID conversationId;

    @NotBlank(message = "Le message ne peut pas être vide.")
    private String message;

}