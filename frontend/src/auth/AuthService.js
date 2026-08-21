import keycloak from './keycloak';
import { clearGuest } from '../utils/guest';

const AuthService = {
  async init() {
    const authenticated = await keycloak.init({
      onLoad: 'check-sso',
      pkceMethod: 'S256',
    });

    return authenticated;
  },

  login() {
    return keycloak.login({
      redirectUri: `${window.location.origin}/chat`,
    });
  },

  logout() {
    clearGuest();

    return keycloak.logout({
      redirectUri: window.location.origin,
    });
  },

  isAuthenticated() {
    return keycloak.authenticated;
  },

  getToken() {
    return keycloak.token;
  },

  getProfile() {
    return keycloak.tokenParsed;
  },

  getKeycloak() {
    return keycloak;
  },
};

export default AuthService;
