package ma.encg.chatservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.request.FeedbackRequestDTO;
import ma.encg.chatservice.dto.response.FeedbackResponseDTO;
import ma.encg.chatservice.entity.Feedback;
import ma.encg.chatservice.mapper.FeedbackMapper;
import ma.encg.chatservice.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/responses")
@RequiredArgsConstructor
@Validated
@Tag(name = "Feedback", description = "API de gestion des feedbacks")
@SecurityRequirement(name = "bearerAuth")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final FeedbackMapper feedbackMapper;

    @Operation(
            summary = "Ajouter un feedback",
            description = "Ajoute un feedback (LIKE ou DISLIKE) à une réponse générée par l'IA."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Feedback créé avec succès"),
            @ApiResponse(responseCode = "404", description = "Réponse IA introuvable"),
            @ApiResponse(responseCode = "400", description = "Données invalides")
    })
    @PostMapping("/{responseId}/feedback")
    public ResponseEntity<FeedbackResponseDTO> addFeedback(

            @Parameter(
                    description = "Identifiant de la réponse IA",
                    required = true
            )
            @PathVariable UUID responseId,

            @Valid
            @RequestBody FeedbackRequestDTO request) {

        Feedback feedback = feedbackService.addFeedback(
                responseId,
                request.getFeedbackType(),
                request.getComment()
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(feedbackMapper.toResponseDTO(feedback));
    }

    @Operation(
            summary = "Afficher les feedbacks d'une réponse",
            description = "Retourne tous les feedbacks associés à une réponse générée par l'IA."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Liste des feedbacks récupérée avec succès"),
            @ApiResponse(responseCode = "404", description = "Réponse IA introuvable"),
    })
    @GetMapping("/{responseId}/feedback")
    public ResponseEntity<List<FeedbackResponseDTO>> getResponseFeedback(
            @Parameter(
                    description = "Identifiant de la réponse IA",
                    required = true
            )
            @PathVariable UUID responseId
    ){
        List<FeedbackResponseDTO> feedbacks =
                feedbackService.getResponseFeedback(responseId)
                        .stream()
                        .map(feedbackMapper::toResponseDTO)
                        .toList();

        return ResponseEntity.ok(feedbacks);
    }
}