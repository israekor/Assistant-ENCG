import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost/auth",
  realm: "encg-assistant",
  clientId: "encg-react",
});

export default keycloak;