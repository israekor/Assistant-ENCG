package ma.encg.chatservice.client;

import ma.encg.chatservice.dto.external.AIRequestDTO;
import ma.encg.chatservice.dto.external.AIResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "ai-service",
        url = "${services.ai.url}"
)
public interface AIClient {

    @PostMapping("/chat")
    AIResponseDTO chat(
            @RequestBody AIRequestDTO request
    );

}