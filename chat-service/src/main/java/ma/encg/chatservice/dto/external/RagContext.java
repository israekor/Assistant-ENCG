package ma.encg.chatservice.dto.external;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RagContext {
    private String text;
    private Double topRerankerScore;
    private Double topVectorSimilarity;
    private int chunkCount;
    private String topSource;
    private int retrievalMs;
}