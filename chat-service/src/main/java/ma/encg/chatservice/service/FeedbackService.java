package ma.encg.chatservice.service;

import ma.encg.chatservice.entity.Feedback;
import ma.encg.chatservice.entity.enums.FeedbackType;

import java.util.UUID;

public interface FeedbackService {

    Feedback saveOrUpdateFeedback(
            UUID responseId,
            FeedbackType type,
            String comment
    );

    Feedback getFeedback(
            UUID responseId
    );

    // Map<FeedbackType, Long> statistics();

}