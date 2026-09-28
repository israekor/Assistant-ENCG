package ma.encg.chatservice.dto.external;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagResponseDTO {

    private String query;

    private List<RagChunkDTO> results;
}