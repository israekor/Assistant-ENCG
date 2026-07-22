CREATE TABLE messages
(
    id_message UUID PRIMARY KEY,

    content TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    id_conversation UUID NOT NULL,

    CONSTRAINT fk_message_conversation
        FOREIGN KEY (id_conversation)
            REFERENCES conversations(id_conversation)
            ON DELETE CASCADE
);

CREATE INDEX idx_message_conversation
    ON messages(id_conversation);