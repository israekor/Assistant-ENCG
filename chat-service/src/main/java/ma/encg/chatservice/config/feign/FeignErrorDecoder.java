package ma.encg.chatservice.config.feign;

import feign.Response;
import feign.codec.ErrorDecoder;

public class FeignErrorDecoder implements ErrorDecoder {

    @Override
    public Exception decode(String methodKey, Response response) {

        return switch (response.status()) {

            case 400 ->
                    new BadRequestException(
                            "Bad request while calling remote service."
                    );

            case 401 ->
                    new UnauthorizedException(
                            "Unauthorized request to remote service."
                    );

            case 403 ->
                    new ForbiddenException(
                            "Access denied by remote service."
                    );

            case 404 ->
                    new ResourceNotFoundException(
                            "Requested resource not found."
                    );

            case 503 ->
                    new ServiceUnavailableException(
                            "Remote service unavailable."
                    );

            default ->
                    new RuntimeException(
                            "Unexpected error while calling remote service."
                    );
        };
    }
}