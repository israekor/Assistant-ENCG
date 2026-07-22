package ma.encg.chatservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.response.ConversationHistoryResponseDTO;
import ma.encg.chatservice.dto.response.ConversationResponseDTO;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.mapper.ConversationMapper;
import ma.encg.chatservice.service.ConversationService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/conversations")
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Conversation", description = "API de gestion des conversations")
public class ConversationController {

    private final ConversationService conversationService;
    private final ConversationMapper conversationMapper;

    @Operation(
            summary = "Afficher la liste des conversations"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Liste des conversations récupérée avec succès"
            ),
            @ApiResponse(responseCode = "404", description = "Liste introuvable")
    })
    @GetMapping
    public ResponseEntity<List<ConversationResponseDTO>> getConversations() {

        List<ConversationResponseDTO> conversations =
                conversationService.getCurrentUserConversations()
                        .stream()
                        .map(conversationMapper::toResponseDTO)
                        .toList();

        return ResponseEntity.ok(conversations);
    }

    @Operation(
            summary = "Afficher une conversation"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Conversation récupérée avec succès"
            ),
            @ApiResponse(responseCode = "400", description = "Requête invalide"),
            @ApiResponse(responseCode = "404", description = "Conversation introuvable")
    })
    @GetMapping("/{conversationId}")
    public ResponseEntity<ConversationResponseDTO> getConversation(
            @PathVariable UUID conversationId) {

        Conversation conversation =
                conversationService.getConversation(conversationId);

        return ResponseEntity.ok(
                conversationMapper.toResponseDTO(conversation)
        );
    }

    @Operation(
            summary = "Afficher les messages d'une conversation"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Historique des messages récupéré avec succès"
            ),
            @ApiResponse(responseCode = "404", description = "Liste introuvable")
    })
    @GetMapping("/{conversationId}/history")
    public ResponseEntity<List<ConversationHistoryResponseDTO>> getHistory(
            @PathVariable UUID conversationId) {

        return ResponseEntity.ok(
                conversationService.getConversationHistory(conversationId)
        );

    }
    @PostMapping("/link-guest")
    public ResponseEntity<Void> linkGuestConversation(
            @RequestHeader("X-Guest-Id") UUID guestId
    ) {

        conversationService.linkGuestConversation(guestId);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Archiver une conversation"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Conversation archivée avec succès"
            ),
            @ApiResponse(responseCode = "404", description = "Conversation introuvable")
    })
    @PatchMapping("/{conversationId}/archive")
    public ResponseEntity<Void> archiveConversation(
            @PathVariable UUID conversationId) {

        conversationService.archiveConversation(conversationId);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Supprimer une conversation"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "204",
                    description = "Conversation supprimée avec succès"
            ),
            @ApiResponse(responseCode = "404", description = "Conversation introuvable")
    })
    @DeleteMapping("/{conversationId}")
    public ResponseEntity<Void> deleteConversation(
            @PathVariable UUID conversationId) {

        conversationService.deleteConversation(conversationId);

        return ResponseEntity.noContent().build();
    }
}