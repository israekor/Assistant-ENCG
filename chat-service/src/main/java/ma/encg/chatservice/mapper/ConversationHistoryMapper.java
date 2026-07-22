package ma.encg.chatservice.mapper;

import ma.encg.chatservice.dto.response.ConversationHistoryResponseDTO;
import ma.encg.chatservice.entity.Message;
import ma.encg.chatservice.entity.ResponseAi;
import ma.encg.chatservice.entity.enums.ChatRole;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", imports = ChatRole.class)
public interface ConversationHistoryMapper {

    @Mapping(target = "id", source = "idMessage")
    @Mapping(target = "role", expression = "java(ChatRole.USER)")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "responseId", ignore = true)
    @Mapping(target = "createdAt", source = "createdAt")
    ConversationHistoryResponseDTO toUserDTO(Message message);

    @Mapping(target = "id", source = "idResponse")
    @Mapping(target = "role", expression = "java(ChatRole.ASSISTANT)")
    @Mapping(target = "content", source = "content")
    @Mapping(target = "responseId", source = "idResponse")
    @Mapping(target = "createdAt", source = "createdAt")
    ConversationHistoryResponseDTO toAssistantDTO(ResponseAi response);

}