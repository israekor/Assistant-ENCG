package ma.encg.chatservice.exception;

public class FeedbackNotFoundException extends RuntimeException{

    public FeedbackNotFoundException(String message){
        super(message);
    }

}