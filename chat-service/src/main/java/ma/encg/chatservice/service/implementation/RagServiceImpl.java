package ma.encg.chatservice.service.implementation;

import lombok.RequiredArgsConstructor;
import ma.encg.chatservice.service.RagService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RagServiceImpl implements RagService {

    @Override
    public String retrieveContext(String content){
        return content;
    }

}