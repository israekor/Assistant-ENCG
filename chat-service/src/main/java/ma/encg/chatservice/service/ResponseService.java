package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.external.RagContext;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;

import java.util.UUID;

public interface ResponseService {

    ResponseAi saveResponse(
            Message message,
            String answer
    );

    ResponseAi getResponse(UUID responseId);

    ResponseAi getResponseByMessage(Message message);

    ResponseAi saveResponse(Message message, String answer, RagContext rag);

}