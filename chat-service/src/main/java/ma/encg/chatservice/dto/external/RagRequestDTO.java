package ma.encg.chatservice.dto.external;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RagRequestDTO {

    private String query;

    private Integer candidateK;

    private Integer finalK;
}