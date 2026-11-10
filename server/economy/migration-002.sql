-- Run after schema.sql. Server-clock telemetry is not a complete anti-bot solution.
CREATE TABLE IF NOT EXISTS economy_session_events (
  session_id UUID NOT NULL REFERENCES economy_learning_sessions(id),
  user_id TEXT NOT NULL REFERENCES economy_wallets(user_id),
  event_id UUID NOT NULL,
  kind TEXT NOT NULL CHECK(kind IN ('start','heartbeat','finish')),
  server_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  accepted_seconds INTEGER NOT NULL DEFAULT 0 CHECK(accepted_seconds BETWEEN 0 AND 90),
  PRIMARY KEY(session_id,event_id)
);
CREATE INDEX IF NOT EXISTS economy_session_events_recent ON economy_session_events(user_id,server_at DESC);
CREATE TABLE IF NOT EXISTS economy_entitlements (
  user_id TEXT PRIMARY KEY REFERENCES economy_wallets(user_id),
  provider TEXT NOT NULL CHECK(provider IN ('apple','google')),
  provider_original_transaction_id TEXT NOT NULL UNIQUE,
  product_id TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Only trusted server-to-store verification may populate economy_entitlements.
