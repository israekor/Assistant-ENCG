package ma.encg.chatservice.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
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

    @JsonProperty("candidate_k")
    private Integer candidateK;

    @JsonProperty("final_k")
    private Integer finalK;
}