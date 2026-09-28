package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.external.StreamEventDTO;
import ma.encg.chatservice.dto.response.*;
import ma.encg.chatservice.dto.request.*;
import org.springframework.http.codec.ServerSentEvent;
import reactor.core.publisher.Flux;

public interface ChatService {

    ChatResponseDTO chat(ChatRequestDTO request);

    Flux<ServerSentEvent<StreamEventDTO>> streamChat(
            ChatRequestDTO request
    );

}