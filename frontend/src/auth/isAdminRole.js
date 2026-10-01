import keycloak from './keycloak';

export default function isAdminRole() {
  const roles = keycloak.tokenParsed?.realm_access?.roles ?? [];
  return roles.some((r) => r.toLowerCase() === 'admin');
}
