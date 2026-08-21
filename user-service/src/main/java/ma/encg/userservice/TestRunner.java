package ma.encg.userservice;

import lombok.RequiredArgsConstructor;
import ma.encg.userservice.config.KeycloakProperties;
import ma.encg.userservice.service.KeycloakAdminService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TestRunner implements CommandLineRunner {

    private final KeycloakAdminService keycloakAdminService;
    private final KeycloakProperties properties;

    @Override
    public void run(String... args) {
        String url =
                properties.getServerUrl()
                        + "/realms/"
                        + properties.getAdmin().getRealm()
                        + "/protocol/openid-connect/token";

        System.out.println("URL = " + url);
        System.out.println(properties.getAdmin().getUsername());
        System.out.println(properties.getAdmin().getPassword());

        String token = keycloakAdminService.getAdminAccessToken();

        System.out.println(token.substring(0, 40));

    }

}