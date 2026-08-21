package ma.encg.userservice.dto.keycloak;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponseDTO {

    @JsonProperty("access_token")
    private String accessToken;

    @JsonProperty("expires_in")
    private Integer expiresIn;

    @JsonProperty("refresh_expires_in")
    private Integer refreshExpiresIn;

    @JsonProperty("token_type")
    private String tokenType;

}