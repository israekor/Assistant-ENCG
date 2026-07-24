package ma.encg.chatservice.service;

import ma.encg.chatservice.dto.external.UserStatisticsDTO;

public interface ProfileService {

    UserStatisticsDTO getStatistics();

}