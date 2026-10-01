package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.encg.chatservice.client.RagClient;
import ma.encg.chatservice.config.feign.ServiceUnavailableException;
import ma.encg.chatservice.dto.external.RagChunkDTO;
import ma.encg.chatservice.dto.external.RagContext;
import ma.encg.chatservice.dto.external.RagRequestDTO;
import ma.encg.chatservice.dto.external.RagResponseDTO;
import ma.encg.chatservice.service.RagService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagServiceImpl implements RagService {

    private final RagClient ragClient;

    @Override
    public RagContext retrieve(String content) {

        long start = System.currentTimeMillis();

        try {
            RagResponseDTO response = ragClient.retrieve(
                    RagRequestDTO.builder()
                            .query(content)
                            .candidateK(10)
                            .finalK(3)
                            .build()
            );

            List<RagChunkDTO> chunks =
                    response.getResults() == null ? List.of() : response.getResults();

            String text = chunks.stream()
                    .map(RagChunkDTO::getContent)
                    .collect(Collectors.joining("\n\n"));

            // Score brut du reranker (le score "normalized" vaut toujours 1.0 pour le premier)
            RagChunkDTO best = chunks.stream()
                    .filter(c -> c.getRerankerScore() != null)
                    .max(Comparator.comparingDouble(RagChunkDTO::getRerankerScore))
                    .orElse(null);

            Double bestSimilarity = chunks.stream()
                    .map(RagChunkDTO::getVectorSimilarity)
                    .filter(Objects::nonNull)
                    .max(Double::compare)
                    .orElse(null);

            return new RagContext(
                    text,
                    best != null ? best.getRerankerScore() : null,
                    bestSimilarity,
                    chunks.size(),
                    best != null ? best.getSource() : null,
                    (int) (System.currentTimeMillis() - start)
            );

        } catch (Exception e) {
            log.error("Erreur RAG", e);
            throw new ServiceUnavailableException("RAG service unavailable: " + e.getMessage());
        }
    }
}