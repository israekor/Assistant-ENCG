package ma.encg.userservice.service;


public interface KeycloakAdminService {

    String getAdminAccessToken();

    String createUser(
            String firstname,
            String lastname,
            String email,
            String password
    );

    // String createUser(RegisterRequestDTO request);

}