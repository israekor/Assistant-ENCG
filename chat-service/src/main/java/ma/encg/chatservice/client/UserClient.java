package ma.encg.chatservice.client;

import ma.encg.chatservice.config.FeignConfig;
import ma.encg.chatservice.dto.external.CurrentUserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;


import java.util.UUID;

@FeignClient(
        name = "user-service",
        url = "${services.user.url}",
        configuration = FeignConfig.class
)
public interface UserClient {

    @GetMapping("/users/me")
    CurrentUserDTO getCurrentUser(
            @RequestHeader("Authorization")
            String authorization
    );

}