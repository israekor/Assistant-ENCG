package ma.encg.chatservice.controller;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.client.AdminClient;
import ma.encg.chatservice.service.AdminService;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService statsService;
    private final AdminClient rag;

    @GetMapping("/stats")
    public Object stats() { return statsService.stats(); }

    @GetMapping("/rag/categories")
    public Object categories() { return rag.categories(); }

    @GetMapping("/rag/documents")
    public Object documents() { return rag.documents(); }

    @PostMapping(value = "/rag/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public Object upload(@RequestParam String categoryFolder,
                         @RequestParam("files") MultipartFile[] files) throws IOException {
        return rag.upload(categoryFolder, files);
    }

    @DeleteMapping("/rag/documents")
    public Object delete(@RequestParam String source) { return rag.delete(source); }

    @PostMapping("/rag/reindex")
    public ResponseEntity<Object> reindex() { return ResponseEntity.accepted().body(rag.reindex()); }

    @GetMapping("/rag/reindex/status")
    public Object status() { return rag.status(); }

    @GetMapping("/rag/filieres")
    public Object filieres() { return rag.filieres(); }

    @PostMapping("/rag/filieres")
    public ResponseEntity<Object> createFiliere(@RequestBody Map<String, Object> body) {
        return ResponseEntity.status(201).body(rag.createFiliere(body));
    }

    @PutMapping("/rag/filieres/{id}")
    public Object updateFiliere(@PathVariable String id, @RequestBody Map<String, Object> body) {
        return rag.updateFiliere(id, body);
    }

    @DeleteMapping("/rag/filieres/{id}")
    public Object deleteFiliere(@PathVariable String id) { return rag.deleteFiliere(id); }

    /** Relaye le code et le message d'erreur du rag-service (409 déjà en cours, 400, 413...). */
    @ExceptionHandler(RestClientResponseException.class)
    public ResponseEntity<String> relay(RestClientResponseException e) {
        return ResponseEntity.status(HttpStatusCode.valueOf(e.getStatusCode().value()))
                .contentType(MediaType.APPLICATION_JSON).body(e.getResponseBodyAsString());
    }
}
