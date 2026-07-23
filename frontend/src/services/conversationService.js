import api from './api.js';

const conversationService = {
  getAll() {
    return api.get('/conversations');
  },

  getConversation(id) {
    return api.get(`/conversations/${id}`);
  },

  getHistory(conversationId) {
    return api.get(`/conversations/${conversationId}/history`);
  },

  linkGuest() {
    return api.post('/conversations/link-guest');
  },

  archiveConversation(id) {
    return api.patch(`/conversations/${id}/archive`);
  },

  restoreConversation(id) {
    return api.patch(`/conversations/${id}/restore`);
  },

  deleteConversation(id) {
    return api.delete(`/conversations/${id}`);
  },
};

export default conversationService;
