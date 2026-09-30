package ma.encg.userservice.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.encg.userservice.dto.response.UserResponseDTO;
import ma.encg.userservice.entity.User;
import ma.encg.userservice.mapper.UserMapper;
import ma.encg.userservice.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Validated
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Users", description = "API de gestion des utilisateurs")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;

    @Operation(
            summary = "Récupérer l'utilisateur courant",
            description = "Retourne les informations de l'utilisateur connecté ou du visiteur courant."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Utilisateur récupéré avec succès"),
            @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser(
            @AuthenticationPrincipal Jwt jwt
    ) {
        User user = userService.getCurrentUser(jwt);
        return ResponseEntity.ok(
                userMapper.toResponseDTO(user)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(
            @PathVariable UUID id
    ) {
        User user = userService.getUserById(id);

        return ResponseEntity.ok(
                userMapper.toResponseDTO(user)
        );
    }

}