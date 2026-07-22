CREATE TABLE chunks
(
    id_chunk UUID PRIMARY KEY,

    content TEXT NOT NULL,

    chunk_order INTEGER NOT NULL,

    embedding_id UUID,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL,

    id_doc UUID NOT NULL,

    CONSTRAINT fk_chunk_document
        FOREIGN KEY (id_doc)
            REFERENCES documents(id_doc)
            ON DELETE CASCADE,

    CONSTRAINT uq_chunk_document_order
        UNIQUE (id_doc, chunk_order)
);

CREATE INDEX idx_chunk_document
    ON chunks(id_doc);