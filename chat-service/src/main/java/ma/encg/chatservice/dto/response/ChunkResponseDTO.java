package ma.encg.chatservice.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChunkResponseDTO {

    private UUID idChunk;

    private Integer chunkOrder;

    private Float similarityScore;
}