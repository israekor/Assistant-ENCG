import api from './api';

const getCurrentUser = () => api.get('/users/me');

export default {
  getCurrentUser,
};
