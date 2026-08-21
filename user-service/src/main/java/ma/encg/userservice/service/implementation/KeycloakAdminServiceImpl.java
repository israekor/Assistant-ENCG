package ma.encg.userservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.userservice.config.KeycloakProperties;
import ma.encg.userservice.dto.keycloak.CreateUserRequestDTO;
import ma.encg.userservice.dto.keycloak.CredentialDTO;
import ma.encg.userservice.dto.keycloak.TokenResponseDTO;
import ma.encg.userservice.exception.EmailAlreadyExistsException;
import ma.encg.userservice.service.KeycloakAdminService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakAdminServiceImpl implements KeycloakAdminService {

    private final RestClient restClient;
    private final KeycloakProperties properties;

    @Override
    public String getAdminAccessToken() {

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();

        form.add("grant_type", "password");
        form.add("client_id", properties.getAdmin().getClientId());
        form.add("username", properties.getAdmin().getUsername());
        form.add("password", properties.getAdmin().getPassword());

        TokenResponseDTO response = restClient
                .post()
                .uri(
                        properties.getServerUrl()
                                + "/realms/"
                                + properties.getAdmin().getRealm()
                                + "/protocol/openid-connect/token"
                )
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(TokenResponseDTO.class);

        return response.getAccessToken();
    }

    @Override
    public String createUser(
            String firstname,
            String lastname,
            String email,
            String password
    ) {
        String token = getAdminAccessToken();

        CredentialDTO credential = CredentialDTO.builder()
                .type("password")
                .value(password)
                .temporary(false)
                .build();

        CreateUserRequestDTO request = CreateUserRequestDTO.builder()
                .username(email)
                .email(email)
                .firstName(firstname)
                .lastName(lastname)
                .enabled(true)
                .emailVerified(false)
                .credentials(List.of(credential))
                .build();

        try {
            ResponseEntity<Void> response = restClient
                    .post()
                    .uri(
                            properties.getServerUrl()
                                    + "/admin/realms/"
                                    + properties.getApplication().getRealm()
                                    + "/users"
                    )
                    .header(
                            HttpHeaders.AUTHORIZATION,
                            "Bearer " + token
                    )
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .toBodilessEntity();

            String location =
                    response.getHeaders()
                            .getFirst(HttpHeaders.LOCATION);

            if (location == null) {
                throw new RuntimeException(
                        "Impossible de récupérer l'identifiant Keycloak."
                );

            }
            return location.substring(location.lastIndexOf("/") + 1);

        }
        // correspond au HTTP 409 Conflict
        catch (HttpClientErrorException e) {
            throw new EmailAlreadyExistsException(
                    "Cette adresse email est déjà utilisée."
            );
        }
    }

}