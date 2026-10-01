package ma.encg.chatservice.service.implementation;


import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.external.RagContext;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import ma.encg.chatservice.exception.ResponseNotFoundException;
import ma.encg.chatservice.repository.ResponseAiRepository;
import ma.encg.chatservice.service.CurrentUserService;
import ma.encg.chatservice.service.ResponseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class ResponseServiceImpl
        implements ResponseService {

    private final ResponseAiRepository responseRepository;
    private final CurrentUserService currentUserService;

    @Override
    public ResponseAi saveResponse(Message message,
                                   String answer) {

        ResponseAi response = ResponseAi.builder()
                .content(answer)
                .message(message)
                .build();

        return responseRepository.save(response);
    }

    @Override
    public ResponseAi getResponse(UUID responseId) {

        UUID currentUserId = currentUserService
                .getCurrentUser()
                .getIdUser();

        return responseRepository
                .findByIdResponseAndMessageConversationUserId(
                        responseId,
                        currentUserId
                )
                .orElseThrow(() ->
                        new ResponseNotFoundException(
                                "Réponse introuvable."
                        ));
    }

    @Override
    public ResponseAi getResponseByMessage(Message message) {
        return responseRepository
                .findByMessage(message)
                .orElseThrow(() ->
                        new ResponseNotFoundException(
                                "Réponse introuvable."
                        ));
    }

    @Override
    public ResponseAi saveResponse(Message message, String answer, RagContext rag) {

        ResponseAi response = ResponseAi.builder()
                .content(answer)
                .message(message)
                .ragTopScore(rag != null ? rag.getTopRerankerScore() : null)
                .ragTopSimilarity(rag != null ? rag.getTopVectorSimilarity() : null)
                .ragChunks(rag != null ? rag.getChunkCount() : null)
                .ragTopSource(rag != null ? rag.getTopSource() : null)
                .ragMs(rag != null ? rag.getRetrievalMs() : null)
                .build();

        return responseRepository.save(response);
    }
}