package ma.encg.chatservice.exception;

public class ResponseNotFoundException extends RuntimeException{

    public ResponseNotFoundException(String message){
        super(message);
    }

}