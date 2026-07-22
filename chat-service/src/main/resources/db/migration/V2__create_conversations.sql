CREATE TABLE conversations
(
    id_conversation UUID PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    status VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    id_user UUID,

    guest_id UUID,

    CONSTRAINT chk_conversation_status
        CHECK (status IN ('ACTIVE', 'CLOSED', 'ARCHIVED'))
);

CREATE INDEX idx_conversation_user
    ON conversations(id_user);

CREATE INDEX idx_conversation_guest
    ON conversations(guest_id);