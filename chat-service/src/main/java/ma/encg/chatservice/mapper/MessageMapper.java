package ma.encg.chatservice.mapper;

import ma.encg.chatservice.dto.response.MessageResponseDTO;
import ma.encg.chatservice.entity.Message;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MessageMapper {

    MessageResponseDTO toResponseDTO(Message message);

}