package ma.encg.chatservice.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Embeddable
public class ChunkResponseId implements Serializable {

    private UUID idChunk;
    private UUID idResponse;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ChunkResponseId)) return false;
        ChunkResponseId that = (ChunkResponseId) o;
        return Objects.equals(idChunk, that.idChunk) && Objects.equals(idResponse, that.idResponse);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idChunk, idResponse);
    }
}