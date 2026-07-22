package ma.encg.chatservice.config.feign;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
            super(message);
    }
}
