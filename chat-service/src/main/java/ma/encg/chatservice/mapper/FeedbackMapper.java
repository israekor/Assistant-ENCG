package ma.encg.chatservice.mapper;

import ma.encg.chatservice.dto.response.FeedbackResponseDTO;
import ma.encg.chatservice.entity.Feedback;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FeedbackMapper {

    FeedbackResponseDTO toResponseDTO(Feedback feedback);

}