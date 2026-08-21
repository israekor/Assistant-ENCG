package ma.encg.userservice.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import ma.encg.userservice.dto.request.RegisterRequestDTO;
import ma.encg.userservice.dto.response.RegisterResponseDTO;
import ma.encg.userservice.entity.User;
import ma.encg.userservice.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Validated
@Tag(name = "Authentication", description = "API d'authentification")
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(
            @Valid @RequestBody RegisterRequestDTO request
    ) {

        User user = userService.register(request);

        RegisterResponseDTO response = RegisterResponseDTO.builder()
                .message("Compte créé avec succès.")
                .email(user.getEmail())
                .build();

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }
}