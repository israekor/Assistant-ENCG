import api from './api';

const feedbackService = {
  async addFeedback(responseId, feedbackType, comment = '') {
    const { data } = await api.post(`/responses/${responseId}/feedback`, {
      feedbackType,
      comment,
    });

    return data;
  },

  async getFeedback(responseId) {
    const { data } = await api.get(`/responses/${responseId}/feedback`);

    return data;
  },
};

export default feedbackService;
