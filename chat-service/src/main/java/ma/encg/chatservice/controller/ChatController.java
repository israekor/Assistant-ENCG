package ma.encg.chatservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.external.StreamEventDTO;
import ma.encg.chatservice.dto.request.ChatRequestDTO;
import ma.encg.chatservice.dto.response.ChatResponseDTO;
import ma.encg.chatservice.service.ChatService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;

@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@Tag(name = "Chat", description = "API de communication avec le chatbot")
public class ChatController {

    private final ChatService chatService;

    @Operation(
            summary = "Envoyer un message",
            description = "Envoie un message au chatbot et retourne la réponse."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Réponse générée"),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Conversation introuvable")
    })
    @PostMapping
    public ResponseEntity<ChatResponseDTO> chat(
            @Valid @RequestBody ChatRequestDTO request){

        return ResponseEntity.ok(chatService.chat(request));
    }

    @PostMapping(
            value = "/stream",
            produces = MediaType.TEXT_EVENT_STREAM_VALUE
    )
    public Flux<ServerSentEvent<StreamEventDTO>> streamChat(
            @Valid @RequestBody ChatRequestDTO request
    ) {

        return chatService.streamChat(request);
    }
}