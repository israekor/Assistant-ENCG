import api from './api.js';

const chatService = {
  sendMessage(data) {
    return api.post('/chat', data);
  },
};

export default chatService;
