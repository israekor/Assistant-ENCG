CREATE TABLE chunk_response
(
    id_chunk UUID NOT NULL,

    id_response UUID NOT NULL,

    similarity_score REAL NOT NULL,

    PRIMARY KEY (id_chunk, id_response),

    CONSTRAINT fk_chunk_response_chunk
        FOREIGN KEY (id_chunk)
            REFERENCES chunks(id_chunk)
            ON DELETE CASCADE,

    CONSTRAINT fk_chunk_response_response
        FOREIGN KEY (id_response)
            REFERENCES responses_ai(id_response)
            ON DELETE CASCADE
);

CREATE INDEX idx_chunk_response_response
    ON chunk_response(id_response);