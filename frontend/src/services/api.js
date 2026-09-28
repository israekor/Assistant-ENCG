import axios from 'axios';
import keycloak from '../auth/keycloak';
import { getGuestId } from '../utils/guest';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(async (config) => {
  config.headers = config.headers ?? {};

  config.headers['X-Guest-Id'] = getGuestId();

  console.log('API REQUEST:', config.url);
  console.log('Keycloak authenticated:', keycloak.authenticated);
  console.log('Keycloak token:', keycloak.token);

  if (keycloak.authenticated) {
    await keycloak.updateToken(30);

    config.headers.Authorization = `Bearer ${keycloak.token}`;
  }

  return config;
});

export default api;
