package ma.encg.chatservice.dto.external;


import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CurrentUserDTO {

    private UUID idUser;

    private UUID guestId;

    private boolean authenticated;

}