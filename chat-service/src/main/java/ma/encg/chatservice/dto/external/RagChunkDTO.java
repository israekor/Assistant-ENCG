package ma.encg.chatservice.dto.external;

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

    private Integer chunkIndex;

    private String category;

    private String filiere;

    private String section;

    private String subsection;

    private String sourceUrl;

    private Double rrfScore;

    private Double vectorSimilarity;

    private Double keywordScore;
}