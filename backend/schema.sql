-- =========================================
-- 🚀 EXTENSIONS (IMPORTANT)
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================
-- 👤 USERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user', -- user / admin
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 🎲 DRAWS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS draws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numbers INTEGER[] NOT NULL,
  status TEXT DEFAULT 'pending', -- pending / generated / published
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT check_draw_numbers_length 
  CHECK (array_length(numbers, 1) = 5)
);

-- =========================================
-- 🎯 SCORES TABLE (USER PICKS)
-- =========================================
CREATE TABLE IF NOT EXISTS scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 🏆 WINNERS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS winners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  matched_numbers INTEGER,
  prize_amount NUMERIC DEFAULT 0,
  payment_status TEXT DEFAULT 'pending', -- pending / paid
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ❤️ CHARITIES TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS charities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  total_donations NUMERIC DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- 💳 SUBSCRIPTIONS TABLE
-- =========================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active', -- active / cancelled
  plan TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- ⚡ INDEXES (PERFORMANCE BOOST)
-- =========================================
CREATE INDEX IF NOT EXISTS idx_scores_user 
ON scores(user_id);

CREATE INDEX IF NOT EXISTS idx_winners_user 
ON winners(user_id);

CREATE INDEX IF NOT EXISTS idx_winners_draw 
ON winners(draw_id);

-- =========================================
-- 🔐 UNIQUE CONSTRAINT (OPTIONAL)
-- =========================================
-- Prevent duplicate entries per user (adjust if needed)
-- ALTER TABLE scores
-- ADD CONSTRAINT unique_user_entry UNIQUE(user_id, created_at);

-- =========================================
-- 🧪 SAMPLE ADMIN USER
-- =========================================
INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@test.com', 'hashedpassword', 'admin')
ON CONFLICT (email) DO NOTHING;
