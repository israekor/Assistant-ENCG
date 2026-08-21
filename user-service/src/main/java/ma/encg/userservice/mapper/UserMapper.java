package ma.encg.userservice.mapper;

import ma.encg.userservice.dto.response.UserResponseDTO;
import ma.encg.userservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toResponseDTO(User user);

}