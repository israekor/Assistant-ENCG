package ma.encg.chatservice.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.dto.external.UserStatisticsDTO;
import ma.encg.chatservice.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping("/statistics")
    public ResponseEntity<UserStatisticsDTO> getStatistics() {

        return ResponseEntity.ok(
                profileService.getStatistics()
        );
    }

}