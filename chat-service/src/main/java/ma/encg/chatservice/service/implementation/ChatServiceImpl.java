package ma.encg.chatservice.service.implementation;

import lombok.extern.slf4j.Slf4j;
import ma.encg.chatservice.dto.external.RagContext;
import ma.encg.chatservice.dto.external.StreamEventDTO;
import ma.encg.chatservice.service.*;
import org.springframework.http.codec.ServerSentEvent;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.request.ChatRequestDTO;
import ma.encg.chatservice.dto.response.ChatResponseDTO;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import org.springframework.stereotype.Service;
import ma.encg.chatservice.mapper.ChatMapper;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationService conversationService;
    private final MessageService messageService;
    private final LLMService LLMService;
    private final RagService RagService;
    private final ResponseService responseService;
    private final ChatMapper chatMapper;

    @Override
    @Transactional
    public ChatResponseDTO chat(ChatRequestDTO request) {

        Conversation conversation =
                conversationService.getOrCreateConversation(
                        request.getConversationId()
                );

        Message message =
                messageService.saveMessage(
                        request.getMessage(),
                        conversation
                );

        RagContext rag = RagService.retrieve(message.getContent());
        String context = rag.getText();

        String answer =
                LLMService.generateAnswer(
                        message.getContent(),
                        context
                );

        ResponseAi response =
                responseService.saveResponse(message, answer, rag);

        String newTitle = null;
        try {
            newTitle = conversationService.generateTitleIfNecessary(
                    conversation.getIdConversation(), message.getContent());
        } catch (Exception e) {
            log.warn("Titre non généré", e);
        }
        if (newTitle != null) {
            conversation.setTitle(newTitle);
        }

        return chatMapper.toChatResponse(
                conversation,
                message,
                response
        );
    }

    /**
     * Exécute un traitement bloquant sur un thread boundedElastic,
     * en propageant manuellement le RequestAttributes du thread Tomcat
     * d'origine (nécessaire pour que HttpServletRequest / CurrentUserService
     * fonctionnent correctement en dehors du thread de la requête).
     */
    private <T> Mono<T> blocking(Callable<T> callable, RequestAttributes requestAttributes) {
        return Mono.fromCallable(() -> {
                    RequestContextHolder.setRequestAttributes(requestAttributes);
                    try {
                        return callable.call();
                    } finally {
                        RequestContextHolder.resetRequestAttributes();
                    }
                })
                .subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Flux<ServerSentEvent<StreamEventDTO>> streamChat(ChatRequestDTO request) {

        // Capturé sur le thread Tomcat d'origine, AVANT tout subscribeOn
        RequestAttributes requestAttributes = RequestContextHolder.currentRequestAttributes();

        Mono<Conversation> conversationMono = blocking(() ->
                        conversationService.getOrCreateConversation(request.getConversationId()),
                requestAttributes
        );

        return conversationMono.flatMapMany(conversation -> {

            Mono<Message> messageMono = blocking(() ->
                            messageService.saveMessage(request.getMessage(), conversation),
                    requestAttributes
            );

            return messageMono.flatMapMany(message -> {

                Mono<RagContext> contextMono = blocking(() ->
                        RagService.retrieve(message.getContent()), requestAttributes);

                return contextMono.flatMapMany(context -> {

                    Flux<String> aiStream = LLMService.streamAnswer(message.getContent(), context.getText());

                    StringBuilder fullAnswer = new StringBuilder();

                    Flux<ServerSentEvent<StreamEventDTO>> conversationEvent = Flux.just(
                            ServerSentEvent.<StreamEventDTO>builder()
                                    .event("conversation")
                                    .data(StreamEventDTO.builder()
                                            .type("conversation")
                                            .data(Map.of(
                                                    "conversationId", conversation.getIdConversation(),
                                                    "conversationTitle", conversation.getTitle()
                                            ))
                                            .build())
                                    .build()
                    );

                    Flux<ServerSentEvent<StreamEventDTO>> tokenEvents = aiStream
                            .doOnNext(fullAnswer::append)
                            .map(chunk -> ServerSentEvent.<StreamEventDTO>builder()
                                    .event("token")
                                    .data(StreamEventDTO.builder()
                                            .type("token")
                                            .data(chunk)
                                            .build())
                                    .build());

                    Mono<ServerSentEvent<StreamEventDTO>> doneEvent = blocking(() -> {
                                ResponseAi response = responseService.saveResponse(message, fullAnswer.toString(), context);

                                String newTitle = null;
                                try {
                                    newTitle = conversationService.generateTitleIfNecessary(
                                            conversation.getIdConversation(), message.getContent());
                                } catch (Exception e) {
                                    log.warn("Titre non généré", e);
                                }

                                Map<String, Object> data = new HashMap<>();   // Map.of refuse les null
                                data.put("messageId", message.getIdMessage());
                                data.put("responseId", response.getIdResponse());
                                data.put("createdAt", response.getCreatedAt());
                                if (newTitle != null) {
                                    data.put("conversationTitle", newTitle);
                                }

                                return ServerSentEvent.<StreamEventDTO>builder()
                                        .event("done")
                                        .data(StreamEventDTO.builder()
                                                .type("done")
                                                .data(data)
                                                .build())
                                        .build();
                            },
                            requestAttributes
                    );

                    return Flux.concat(conversationEvent, tokenEvents, doneEvent)
                            .doOnError(e -> log.error("Erreur pendant le streaming du chat", e))
                            .onErrorResume(error -> Flux.just(
                                    ServerSentEvent.<StreamEventDTO>builder()
                                            .event("error")
                                            .data(StreamEventDTO.builder()
                                                    .type("error")
                                                    .data(Map.of("message",
                                                            "Erreur lors de la génération de la réponse."))
                                                    .build())
                                            .build()
                            ));
                });
            });
        });
    }
}