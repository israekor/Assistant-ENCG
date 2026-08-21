package ma.encg.userservice.dto.response;

import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {

    private UUID idUser;

    private String firstname;

    private String lastname;

    private String email;
}
