import Keycloak from "keycloak-connect";
import session from "express-session";

const keycloakConfig = {
    "realm": process.env.KEYCLOAK_REALM,
    "auth-server-url": process.env.KEYCLOAK_URL,
    "ssl-required": "external",
    "resource": process.env.KEYCLOAK_CLIENT_ID,
    "verify-token-audience": true,
    "credentials": {
        "secret": process.env.KEYCLOAK_SECRET
    },
    "bearer-only": true,
    "use-resource-role-mappings": true,
    "confidential-port": 0
}

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

export { keycloak, memoryStore };