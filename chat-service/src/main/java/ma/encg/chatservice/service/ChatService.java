package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.response.*;
import ma.encg.chatservice.dto.request.*;

public interface ChatService {

    ChatResponseDTO chat(ChatRequestDTO request);

}