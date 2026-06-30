-- 003_auth_foundation.sql — Phase 0: first-party auth foundation (ADDITIVE).
-- Target: D1 `islamicfiqh-analytics` (binding env.DB). Apply ONCE.
--
-- Runs parallel to live Clerk; no gate logic depends on these tables yet.
-- Provider-agnostic so Apple/Passkey slot in later with zero teardown.
--
-- NOTE on the legacy `users` stub: this D1 already had an EMPTY, incompatible
-- `users` table (CREATE TABLE users (clerk_user_id TEXT PRIMARY KEY, email,
-- created_at); 0 rows, referenced by no worker). A1/owner confirmed it is safe
-- to drop. We DROP it first so the new schema below actually applies (a plain
-- CREATE TABLE IF NOT EXISTS would otherwise be a silent no-op and the new
-- columns would never exist). This is a ONE-TIME migration — do not re-run it
-- against a populated `users` table.

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  user_id       TEXT PRIMARY KEY,           -- e.g. 'usr_' + base64url(16 random bytes)
  email         TEXT,
  email_verified INTEGER NOT NULL DEFAULT 0,
  display_name  TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
-- At most ONE verified account per email. Partial unique index (rows with
-- email_verified=1 only) so multiple UNVERIFIED rows are still allowed, but two
-- concurrent verified-email OAuth callbacks can't create duplicate verified users.
-- linkOrCreateUser links onto the single surviving verified row on conflict.
CREATE UNIQUE INDEX IF NOT EXISTS users_verified_email_uidx ON users(email) WHERE email_verified = 1;

CREATE TABLE IF NOT EXISTS oauth_accounts (
  provider      TEXT NOT NULL,              -- 'google' | 'apple'
  provider_sub  TEXT NOT NULL,              -- the provider's stable subject id
  user_id       TEXT NOT NULL,
  email         TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (provider, provider_sub)
);
CREATE INDEX IF NOT EXISTS oauth_user_idx ON oauth_accounts(user_id);

CREATE TABLE IF NOT EXISTS passkey_credentials (
  cred_id       TEXT PRIMARY KEY,           -- base64url credential id
  user_id       TEXT NOT NULL,
  public_key    TEXT NOT NULL,              -- base64url COSE public key
  counter       INTEGER NOT NULL DEFAULT 0, -- WebAuthn sign-count (clone detection)
  transports    TEXT,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS passkey_user_idx ON passkey_credentials(user_id);

CREATE TABLE IF NOT EXISTS sessions (
  session_hash  TEXT PRIMARY KEY,           -- sha256(raw token); raw token is NEVER stored
  user_id       TEXT NOT NULL,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS auth_challenges (
  challenge     TEXT PRIMARY KEY,           -- short-lived, single-use
  kind          TEXT NOT NULL,              -- 'webauthn-reg' | 'webauthn-login' | 'oauth-state'
  ref           TEXT,
  expires_at    TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Additive: keep clerk_user_id; do NOT drop it. Run ONCE — skip if it already
-- exists (verified absent at authoring time: subscriptions had only sub_id,
-- clerk_user_id, plan_id, status, current_period_end, source).
ALTER TABLE subscriptions ADD COLUMN user_id TEXT;
