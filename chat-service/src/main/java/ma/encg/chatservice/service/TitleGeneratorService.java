package ma.encg.chatservice.service;

import ma.encg.chatservice.entity.Conversation;

public interface TitleGeneratorService {

    String generateTitle(Conversation conversation);

}