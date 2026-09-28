package ma.encg.chatservice.service;

import reactor.core.publisher.Flux;

public interface LLMService {

    String generateAnswer(String message, String context);

    Flux<String> streamAnswer(String message, String context);

}