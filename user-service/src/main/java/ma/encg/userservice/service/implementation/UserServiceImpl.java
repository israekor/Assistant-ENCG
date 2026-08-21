package ma.encg.userservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.userservice.dto.request.RegisterRequestDTO;
import ma.encg.userservice.entity.User;
import ma.encg.userservice.exception.EmailAlreadyExistsException;
import ma.encg.userservice.exception.UserNotFoundException;
import ma.encg.userservice.repository.UserRepository;
import ma.encg.userservice.service.KeycloakAdminService;
import ma.encg.userservice.service.UserService;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final KeycloakAdminService keycloakAdminService;

    @Override
    public User getCurrentUser(Jwt jwt) {

        if (jwt == null) {
            throw new UserNotFoundException("Utilisateur non authentifié.");
        }

        return getOrCreateAuthenticatedUser(
                jwt.getSubject(),
                jwt.getClaimAsString("given_name"),
                jwt.getClaimAsString("family_name"),
                jwt.getClaimAsString("email")
        );
    }

    @Transactional(readOnly = true)
    @Override
    public User getUserById(UUID id){
        return userRepository.findById(id).orElseThrow(() ->
                new UserNotFoundException("Utilisateur introuvable."));
    }

    @Override
    public User getOrCreateAuthenticatedUser(
            String keycloakId,
            String firstname,
            String lastname,
            String email) {

        return userRepository.findByKeycloakId(keycloakId)
                .map(user -> {

                    user.setFirstname(firstname);
                    user.setLastname(lastname);
                    user.setEmail(email);

                    User saved = userRepository.save(user);

                    return saved;

                })
                .orElseGet(() -> {

                    User user = User.builder()
                            .keycloakId(keycloakId)
                            .firstname(firstname)
                            .lastname(lastname)
                            .email(email)
                            .build();

                    User saved = userRepository.save(user);

                    return saved;
                });
    }

    @Override
    public User register(RegisterRequestDTO request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new EmailAlreadyExistsException("Cette adresse email est déjà utilisée.");
        }

        String keycloakId = keycloakAdminService.createUser(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                request.getPassword()
        );

        User user = User.builder()
                .keycloakId(keycloakId)
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .build();

        return userRepository.save(user);
    }
}