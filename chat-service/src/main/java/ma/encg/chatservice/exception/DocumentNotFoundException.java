package ma.encg.chatservice.exception;

public class DocumentNotFoundException extends RuntimeException{

    public DocumentNotFoundException(String message){
        super(message);
    }

}