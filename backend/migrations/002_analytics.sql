CREATE TABLE IF NOT EXISTS analytics_visits (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  ip TEXT,
  device_type TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_visits_created_at_idx
  ON analytics_visits(created_at DESC);
