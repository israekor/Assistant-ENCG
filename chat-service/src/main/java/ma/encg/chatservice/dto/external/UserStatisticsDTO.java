package ma.encg.chatservice.dto.external;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserStatisticsDTO {

    private long conversations;

    private long archivedConversations;

    private long messages;

    private long likes;

    private long dislikes;

}