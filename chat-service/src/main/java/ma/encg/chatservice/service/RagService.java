package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.external.RagContext;

public interface RagService {

    RagContext retrieve(String content);

    default String retrieveContext(String content) {
        return retrieve(content).getText();
    }
}