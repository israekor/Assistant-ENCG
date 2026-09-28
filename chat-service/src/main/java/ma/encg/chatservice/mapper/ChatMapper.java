package ma.encg.chatservice.mapper;

import ma.encg.chatservice.dto.response.ChatResponseDTO;
import ma.encg.chatservice.entity.Conversation;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Collections;


@Mapper(componentModel = "spring", imports = Collections.class)
public interface ChatMapper {

    @Mapping(target = "conversationId", source = "conversation.idConversation")
    @Mapping(target = "conversationTitle", source = "conversation.title")
    @Mapping(target = "messageId", source = "message.idMessage")
    @Mapping(target = "responseId", source = "response.idResponse")
    @Mapping(target = "answer", source = "response.content")
    @Mapping(target = "createdAt", source = "response.createdAt")
    ChatResponseDTO toChatResponse(
            Conversation conversation,
            Message message,
            ResponseAi response
    );

}