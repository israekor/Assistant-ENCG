package ma.encg.chatservice.service.implementation;

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

import java.util.Map;
import java.util.concurrent.Callable;

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

        String context =
                RagService.retrieveContext(message.getContent());

        String answer =
                LLMService.generateAnswer(
                        message.getContent(),
                        context
                );

        ResponseAi response =
                responseService.saveResponse(
                        message,
                        answer
                );

        conversationService.generateTitleIfNecessary(
                conversation,
                message.getContent());

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

                Mono<String> contextMono = blocking(() ->
                                RagService.retrieveContext(message.getContent()),
                        requestAttributes
                );

                return contextMono.flatMapMany(context -> {

                    Flux<String> aiStream = LLMService.streamAnswer(
                            message.getContent(), context);

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
                                ResponseAi response = responseService.saveResponse(
                                        message, fullAnswer.toString());

                                conversationService.generateTitleIfNecessary(
                                        conversation, message.getContent());

                                Map<String, Object> data = Map.of(
                                        "messageId", message.getIdMessage(),
                                        "responseId", response.getIdResponse(),
                                        "createdAt", response.getCreatedAt()
                                );

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