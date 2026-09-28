import api from './api.js';
import { streamChat } from './sseClient.js';

const chatService = {
  sendMessage(data) {
    return api.post('/chat', data);
  },

  streamMessage(data, handlers, signal) {
    return streamChat(data, handlers, signal);
  },
};

export default chatService;
