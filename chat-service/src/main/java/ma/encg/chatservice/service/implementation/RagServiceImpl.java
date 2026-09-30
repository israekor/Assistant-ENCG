package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.encg.chatservice.client.RagClient;
import ma.encg.chatservice.config.feign.ServiceUnavailableException;
import ma.encg.chatservice.dto.external.RagChunkDTO;
import ma.encg.chatservice.dto.external.RagRequestDTO;
import ma.encg.chatservice.dto.external.RagResponseDTO;
import ma.encg.chatservice.service.RagService;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RagServiceImpl implements RagService {

    private final RagClient ragClient;

    @Override
    public String retrieveContext(String content) {

        try {

            RagResponseDTO response =
                    ragClient.retrieve(
                            RagRequestDTO.builder()
                                    .query(content)
                                    .candidateK(10)
                                    .finalK(3)
                                    .build()
                    );

            return response.getResults()
                    .stream()
                    .map(RagChunkDTO::getContent)
                    .collect(Collectors.joining("\n\n"));

        } catch (Exception e) {

            log.error("Erreur RAG", e);

            throw new ServiceUnavailableException(
                    "RAG service unavailable: " + e.getMessage()
            );
        }
    }
}