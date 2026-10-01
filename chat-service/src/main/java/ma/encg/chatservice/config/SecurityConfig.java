package ma.encg.chatservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;

import java.util.Collection;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/swagger-ui/**",
                                "/api-docs/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/chat/**").permitAll()
                        .requestMatchers("/responses/**").permitAll()
                        // Conversations utilisables par un invité (identifié par X-Guest-Id)
                        .requestMatchers(HttpMethod.GET,
                                "/conversations/active",
                                "/conversations/{id}",
                                "/conversations/{id}/history"
                        ).permitAll()

                        .requestMatchers(HttpMethod.PATCH,
                                "/conversations/{id}",
                                "/conversations/{id}/archive",
                                "/conversations/{id}/restore"
                        ).permitAll()

                        // GET /conversations (historique complet), DELETE /conversations,
                        // POST /conversations/link-guest
                        .requestMatchers("/conversations/**").authenticated()
                )
                .oauth2ResourceServer(o -> o.jwt(jwt -> jwt.jwtAuthenticationConverter(keycloakConverter())));

        return http.build();
    }
    private JwtAuthenticationConverter keycloakConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(jwt -> {
            Object realmAccess = jwt.getClaim("realm_access");
            if (realmAccess instanceof Map<?, ?> map && map.get("roles") instanceof Collection<?> roles) {
                return roles.stream()
                        .<GrantedAuthority>map(r -> new SimpleGrantedAuthority("ROLE_" + r.toString().toUpperCase()))
                        .toList();
            }
            return List.of();
        });
        return converter;
    }
}