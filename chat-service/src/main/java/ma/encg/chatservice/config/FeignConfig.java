package ma.encg.chatservice.config;

import feign.codec.ErrorDecoder;
import ma.encg.chatservice.config.feign.FeignErrorDecoder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FeignConfig {
    @Bean
    ErrorDecoder errorDecoder() {
        return new FeignErrorDecoder();
    }
}