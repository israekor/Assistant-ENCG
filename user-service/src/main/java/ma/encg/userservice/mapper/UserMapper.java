package ma.encg.userservice.mapper;

import ma.encg.userservice.dto.UserResponseDTO;
import ma.encg.userservice.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponseDTO toResponseDTO(User user);

}