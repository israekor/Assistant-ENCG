package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.encg.chatservice.client.AIClient;
import ma.encg.chatservice.client.AIStreamingClient;
import ma.encg.chatservice.config.feign.ServiceUnavailableException;
import ma.encg.chatservice.dto.external.AIRequestDTO;
import ma.encg.chatservice.dto.external.AIResponseDTO;
import ma.encg.chatservice.service.LLMService;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;

@Slf4j
@Service
@RequiredArgsConstructor
public class LLMServiceImpl implements LLMService {

    private final AIClient aiClient;
    private final AIStreamingClient aiStreamingClient;

    @Override
    public String generateAnswer(
            String message,
            String context
    ) {

        try {

            AIResponseDTO response =
                    aiClient.chat(
                            AIRequestDTO.builder()
                                    .message(message)
                                    .context(context)
                                    .build()
                    );

            return response.getResponse();

        } catch (Exception e) {

            log.error("Erreur IA", e);

            throw new ServiceUnavailableException(
                    e.getMessage()
            );
        }
    }

    @Override
    public Flux<String> streamAnswer(
            String message,
            String context
    ) {

        return aiStreamingClient.stream(
                message,
                context
        );
    }
}