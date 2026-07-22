package ma.encg.chatservice.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SourceResponseDTO {

    private UUID chunkId;

    private String documentTitle;

    private Float similarityScore;

}