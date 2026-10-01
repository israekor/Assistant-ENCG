package ma.encg.chatservice.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/** Client interne vers /rag/admin/* du rag-service. Les réponses JSON sont relayées telles quelles. */
@Component
public class AdminClient {

    private final RestClient rest;

    public AdminClient(RestClient.Builder builder,
                          @Value("${services.rag.url}") String ragUrl,
                          @Value("${services.rag.internal-key}") String internalKey) {
        this.rest = builder.baseUrl(ragUrl + "/rag/admin")
                .defaultHeader("X-Internal-Key", internalKey)
                .build();
    }

    public Object categories() { return rest.get().uri("/categories").retrieve().body(Object.class); }
    public Object documents()  { return rest.get().uri("/documents").retrieve().body(Object.class); }
    public Object reindex()    { return rest.post().uri("/reindex").retrieve().body(Object.class); }
    public Object status()     { return rest.get().uri("/reindex/status").retrieve().body(Object.class); }

    public Object delete(String source) {
        return rest.delete().uri(u -> u.path("/documents").queryParam("source", source).build())
                .retrieve().body(Object.class);
    }

    public Object filieres() { return rest.get().uri("/filieres").retrieve().body(Object.class); }

    public Object createFiliere(Map<String, Object> body) {
        return rest.post().uri("/filieres").contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().body(Object.class);
    }

    public Object updateFiliere(String id, Map<String, Object> body) {
        return rest.put().uri("/filieres/{id}", id).contentType(MediaType.APPLICATION_JSON).body(body)
                .retrieve().body(Object.class);
    }

    public Object deleteFiliere(String id) {
        return rest.delete().uri("/filieres/{id}", id).retrieve().body(Object.class);
    }

    public Object upload(String categoryFolder, MultipartFile[] files) throws IOException {
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("category_folder", categoryFolder);
        for (MultipartFile f : files) {
            final String name = f.getOriginalFilename();
            body.add("files", new ByteArrayResource(f.getBytes()) {
                @Override public String getFilename() { return name; }
            });
        }
        return rest.post().uri("/documents")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(body).retrieve().body(Object.class);
    }
}