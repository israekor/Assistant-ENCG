package ma.encg.chatservice.mapper;

import ma.encg.chatservice.dto.response.ConversationResponseDTO;
import ma.encg.chatservice.entity.Conversation;
import org.mapstruct.Mapper;


@Mapper(componentModel = "spring")
public interface ConversationMapper {

    ConversationResponseDTO toResponseDTO(Conversation conversation);

}