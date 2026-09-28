package ma.encg.chatservice.dto.external;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StreamEventDTO {

    private String type;

    private Object data;
}