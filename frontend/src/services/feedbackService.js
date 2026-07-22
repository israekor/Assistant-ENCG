import api from './api.js';

const feedbackService = {
  send(data) {
    return api.post('/chat/feedback', data);
  },
};

export default feedbackService;
