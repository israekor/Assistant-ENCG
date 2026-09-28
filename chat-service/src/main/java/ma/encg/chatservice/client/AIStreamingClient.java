package ma.encg.chatservice.client;

import ma.encg.chatservice.dto.external.AIRequestDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import reactor.core.publisher.Flux;

@Component
public class AIStreamingClient {

    @Value("${services.ai.url}")
    private String aiServiceUrl;

    public Flux<String> stream(
            String message,
            String context
    ) {

        return WebClient
                .builder()
                .baseUrl(aiServiceUrl)
                .build()
                .post()
                .uri("/chat/stream")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(
                        AIRequestDTO.builder()
                                .message(message)
                                .context(context)
                                .build()
                )
                .retrieve()
                .bodyToFlux(String.class)
                .doOnNext(chunk ->
                        System.out.println(
                                "AI STREAM CHUNK: [" + chunk + "]"
                        )
                )
                .doOnComplete(() ->
                        System.out.println(
                                "AI STREAM COMPLETED"
                        )
                )
                .doOnError(error ->
                        System.err.println(
                                "AI STREAM ERROR: " +
                                        error.getMessage()
                        )
                );
    }
}