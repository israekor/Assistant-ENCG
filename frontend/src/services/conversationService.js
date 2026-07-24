import api from './api.js';

const conversationService = {
  getAll() {
    return api.get('/conversations');
  },

  getActive() {
    return api.get('/conversations/active');
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
    return api.patch(`/conversations/${id}`);
  },

  async deleteAll() {
    const response = await api.delete('/conversations');
    return response.data;
  },
};

export default conversationService;
