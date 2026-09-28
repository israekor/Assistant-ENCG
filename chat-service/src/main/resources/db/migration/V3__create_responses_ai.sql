CREATE TABLE responses_ai
(
    id_response UUID PRIMARY KEY,

    content TEXT NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    id_message UUID NOT NULL UNIQUE,

    CONSTRAINT fk_response_message
        FOREIGN KEY (id_message)
            REFERENCES messages(id_message)
            ON DELETE CASCADE
);

CREATE INDEX idx_response_message
    ON responses_ai(id_message);