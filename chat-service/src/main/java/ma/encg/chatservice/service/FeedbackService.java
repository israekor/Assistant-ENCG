package ma.encg.chatservice.service;

import ma.encg.chatservice.entity.Feedback;
import ma.encg.chatservice.entity.enums.FeedbackType;

import java.util.List;
import java.util.UUID;

public interface FeedbackService {

    Feedback addFeedback(
            UUID responseId,
            FeedbackType type,
            String comment
    );

    List<Feedback> getResponseFeedback(
            UUID responseId
    );

    // Map<FeedbackType, Long> statistics();

}