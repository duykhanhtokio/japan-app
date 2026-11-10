-- PostgreSQL reference schema; not deployed. All writes require a trusted server.
CREATE TABLE IF NOT EXISTS economy_wallets (
  user_id TEXT PRIMARY KEY,
  available_points BIGINT NOT NULL DEFAULT 0 CHECK (available_points >= 0),
  held_points BIGINT NOT NULL DEFAULT 0 CHECK (held_points >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS economy_ledger (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES economy_wallets(user_id),
  idempotency_key TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('learning','referral','redemption_hold','redemption_release','redemption_complete','admin_adjustment')),
  delta_points BIGINT NOT NULL CHECK (delta_points <> 0),
  reference_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS economy_ledger_user_created ON economy_ledger(user_id,created_at DESC);
CREATE TABLE IF NOT EXISTS economy_redemptions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES economy_wallets(user_id),
  amount_yen INTEGER NOT NULL CHECK (amount_yen >= 1000),
  points BIGINT NOT NULL CHECK (points >= 10000),
  status TEXT NOT NULL CHECK (status IN ('pending','approved','fulfilled','rejected','cancelled')),
  provider_reference TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (points = amount_yen * 10)
);
CREATE TABLE IF NOT EXISTS economy_learning_sessions (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES economy_wallets(user_id),
  activity TEXT NOT NULL,
  verified_seconds INTEGER NOT NULL CHECK (verified_seconds >= 0),
  credited_points BIGINT NOT NULL DEFAULT 0 CHECK (credited_points >= 0),
  verification_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id,id)
);
CREATE TABLE IF NOT EXISTS economy_referrals (
  referred_user_id TEXT PRIMARY KEY,
  referrer_user_id TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free','premium')),
  status TEXT NOT NULL CHECK (status IN ('pending','approved','rejected','paid')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (referrer_user_id <> referred_user_id)
);
-- Server must use SELECT ... FOR UPDATE on economy_wallets and update wallet,
-- ledger and redemption rows in ONE transaction. Never expose direct client writes.
-- Enable database permissions/RLS denying untrusted clients access to these tables.
