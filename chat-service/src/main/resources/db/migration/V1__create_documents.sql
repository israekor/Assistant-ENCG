CREATE TABLE documents
(
    id_doc UUID PRIMARY KEY,

    title VARCHAR(255) NOT NULL,

    source VARCHAR(500) NOT NULL,

    document_type VARCHAR(100) NOT NULL,

    language VARCHAR(50) NOT NULL,

    created_at TIMESTAMP NOT NULL,

    updated_at TIMESTAMP NOT NULL
);