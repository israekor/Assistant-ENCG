package ma.encg.chatservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

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
                .oauth2ResourceServer(oauth2 ->
                        oauth2.jwt(Customizer.withDefaults())

                );

        return http.build();
    }
}
