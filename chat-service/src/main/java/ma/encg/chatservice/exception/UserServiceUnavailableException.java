package ma.encg.chatservice.exception;

public class UserServiceUnavailableException extends RuntimeException{
    public UserServiceUnavailableException(String message){
        super(message);
    }
}
