package ma.encg.chatservice.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagChunkDTO {

    private Integer rank;
    private String content;
    private String source;

    @JsonProperty("chunk_index")
    private Integer chunkIndex;

    private String category;
    private String filiere;
    private String section;
    private String subsection;

    @JsonProperty("source_url")
    private String sourceUrl;

    @JsonProperty("rrf_score")
    private Double rrfScore;

    @JsonProperty("vector_similarity")
    private Double vectorSimilarity;

    @JsonProperty("keyword_score")
    private Double keywordScore;

    @JsonProperty("reranker_score")
    private Double rerankerScore;
}