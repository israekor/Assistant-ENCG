import axios from 'axios';
import keycloak from '../auth/keycloak';
import { getGuestId } from '../utils/guest';

const api = axios.create({
  baseURL: 'http://localhost/api',
});

api.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};

  config.headers['X-Guest-Id'] = getGuestId();

  if (keycloak.authenticated) {
    await keycloak.updateToken(30);

    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

export default api;
