package ma.encg.chatservice.dto.external;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AIRequestDTO {

    private String message;

    private String context;

}