package ma.encg.chatservice.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import ma.encg.chatservice.entity.enums.FeedbackType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackRequestDTO {

    @NotNull
    private FeedbackType feedbackType;

    @Size(max = 500)
    private String comment;

}