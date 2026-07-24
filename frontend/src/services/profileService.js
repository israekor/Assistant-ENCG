import api from './api';

const profileService = {
  getStatistics() {
    return api.get('/profile/statistics');
  },
};

export default profileService;
