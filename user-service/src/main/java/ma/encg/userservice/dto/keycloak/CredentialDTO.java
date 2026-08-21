package ma.encg.userservice.dto.keycloak;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CredentialDTO {

    private String type;

    private String value;

    private boolean temporary;

}