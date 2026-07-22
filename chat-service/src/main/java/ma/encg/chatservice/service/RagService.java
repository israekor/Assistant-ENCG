package ma.encg.chatservice.service;


public interface RagService {

    // List<Chunk> retrieveRelevantChunks(String question);

    String retrieveContext(String content);

}