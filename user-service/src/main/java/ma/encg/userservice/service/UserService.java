package ma.encg.userservice.service;

import ma.encg.userservice.dto.request.RegisterRequestDTO;
import ma.encg.userservice.entity.User;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.UUID;

public interface UserService {

    User getCurrentUser(Jwt jwt);

    User getUserById(UUID id);
    
    User getOrCreateAuthenticatedUser(
            String keycloakId,
            String firstname,
            String lastname,
            String email
    );

    User register(RegisterRequestDTO request);
}