import api from './api';

const registerService = {
  async register(data) {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};

export default registerService;
