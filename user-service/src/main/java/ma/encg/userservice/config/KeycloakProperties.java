package ma.encg.userservice.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "keycloak")
public class KeycloakProperties {

    private String serverUrl;

    private Admin admin = new Admin();

    private Application application = new Application();

    @Getter
    @Setter
    public static class Admin {

        private String realm;

        private String username;

        private String password;

        private String clientId;

    }

    @Getter
    @Setter
    public static class Application {

        private String realm;

        private String clientId;

    }

}