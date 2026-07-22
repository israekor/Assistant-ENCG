package ma.encg.chatservice.service.implementation;

import ma.encg.chatservice.config.AppConstants;
import ma.encg.chatservice.service.LLMService;
import org.springframework.stereotype.Service;

@Service
public class LLMServiceImpl implements LLMService {

    @Override
    public String generateAnswer(String message, String context) {

        return AppConstants.MOCK_AI_RESPONSE;

    }

}