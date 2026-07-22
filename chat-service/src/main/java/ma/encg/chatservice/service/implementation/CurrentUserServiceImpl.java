package ma.encg.chatservice.service.implementation;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.client.UserClient;
import ma.encg.chatservice.config.feign.BadRequestException;
import ma.encg.chatservice.dto.external.CurrentUserDTO;
import ma.encg.chatservice.service.CurrentUserService;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CurrentUserServiceImpl implements CurrentUserService {

    private final UserClient userClient;

    private final HttpServletRequest request;

    @Override
    public CurrentUserDTO getCurrentUser() {

        String authorization =
                request.getHeader("Authorization");

        String guestHeader =
                request.getHeader("X-Guest-Id");

        // Cas 1 Utilisateur connecté
        if (authorization != null &&
                authorization.startsWith("Bearer ")) {

            CurrentUserDTO user =
                    userClient.getCurrentUser(authorization);

            return CurrentUserDTO.builder()
                    .authenticated(true)
                    .idUser(user.getIdUser())
                    .build();

        }

        // Cas 2 : Visiteur

        if (guestHeader == null || guestHeader.isBlank()) {
            throw new BadRequestException(
                    "Le header X-Guest-Id est obligatoire."
            );
        }

        return CurrentUserDTO.builder()
                .authenticated(false)
                .guestId(UUID.fromString(guestHeader))
                .build();
    }

}