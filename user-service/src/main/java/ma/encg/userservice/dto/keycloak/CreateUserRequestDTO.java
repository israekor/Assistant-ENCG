package ma.encg.userservice.dto.keycloak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateUserRequestDTO {

    private String username;

    private String email;

    private String firstName;

    private String lastName;

    private boolean enabled;

    private boolean emailVerified;

    private List<CredentialDTO> credentials;

}