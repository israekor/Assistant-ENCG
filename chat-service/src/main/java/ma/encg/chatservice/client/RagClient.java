package ma.encg.chatservice.client;

import ma.encg.chatservice.dto.external.RagRequestDTO;
import ma.encg.chatservice.dto.external.RagResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(
        name = "rag-service",
        url = "${services.rag.url}"
)
public interface RagClient {

    @PostMapping("/rag/retrieve")
    RagResponseDTO retrieve(
            @RequestBody RagRequestDTO request
    );
}