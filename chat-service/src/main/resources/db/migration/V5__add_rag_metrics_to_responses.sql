ALTER TABLE responses_ai
    ADD COLUMN rag_top_score      DOUBLE PRECISION,
    ADD COLUMN rag_top_similarity DOUBLE PRECISION,
    ADD COLUMN rag_chunks         INTEGER,
    ADD COLUMN rag_top_source     VARCHAR(500),
    ADD COLUMN rag_ms             INTEGER;

CREATE INDEX idx_response_rag_score ON responses_ai(rag_top_score);