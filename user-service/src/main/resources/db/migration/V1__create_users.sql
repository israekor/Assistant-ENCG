CREATE TABLE users
(
    id_user UUID PRIMARY KEY,

    guest_id UUID UNIQUE,

    keycloak_id VARCHAR(255) UNIQUE,

    firstname VARCHAR(255),

    lastname VARCHAR(255),

    email VARCHAR(255) UNIQUE,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_users_guest
    ON users(guest_id);

CREATE INDEX idx_users_email
    ON users(email);

CREATE INDEX idx_users_keycloak
    ON users(keycloak_id);