package ma.encg.userservice.dto.response;

import jakarta.validation.constraints.Email;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterResponseDTO {

    private String message;

    @Email
    private String email;
}