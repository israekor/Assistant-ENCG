package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.entity.Feedback;
import ma.encg.chatservice.entity.ResponseAi;
import ma.encg.chatservice.entity.enums.FeedbackType;
import ma.encg.chatservice.repository.FeedbackRepository;
import ma.encg.chatservice.service.FeedbackService;
import ma.encg.chatservice.service.ResponseService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final ResponseService responseService;

    @Override
    public Feedback addFeedback(UUID responseId,
                                FeedbackType type,
                                String comment) {

        ResponseAi response =
                responseService.getResponse(responseId);

        Feedback feedback = Feedback.builder()
                .feedbackType(type)
                .comment(comment)
                .responseAi(response)
                .build();

        return feedbackRepository.save(feedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Feedback> getResponseFeedback(UUID responseId) {

        responseService.getResponse(responseId);

        return feedbackRepository
                .findByResponseAiIdResponse(responseId);
    }

}