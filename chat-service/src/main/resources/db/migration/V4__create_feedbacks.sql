CREATE TABLE feedbacks
(
    id_feedback UUID PRIMARY KEY,

    feedback_type VARCHAR(20),

    comment VARCHAR(500),

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    id_response UUID NOT NULL,

    CONSTRAINT chk_feedback_type
        CHECK (feedback_type IN ('LIKE', 'DISLIKE')),

    CONSTRAINT fk_feedback_response
        FOREIGN KEY (id_response)
            REFERENCES responses_ai(id_response)
            ON DELETE CASCADE
);

CREATE INDEX idx_feedback_response
    ON feedbacks(id_response);