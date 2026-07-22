package ma.encg.chatservice.service;

public interface LLMService {

    String generateAnswer(String message, String context);

}