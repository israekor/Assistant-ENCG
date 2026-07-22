package ma.encg.chatservice.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponseDTO {

    private UUID idDoc;

    private String title;

    private String source;

    private String documentType;

    private String language;
}