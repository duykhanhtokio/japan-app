-- Apply after schema.sql and migration-002.sql. No direct client table permissions.
CREATE TABLE IF NOT EXISTS learning_accounts (
    user_id TEXT PRIMARY KEY,
    state JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Every read-modify-write uses SELECT FOR UPDATE in one database transaction.
-- Free exam identity, rewards, ticket grants and premium run grants share that lock.
