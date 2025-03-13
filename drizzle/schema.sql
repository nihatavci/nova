-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  clerk_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create financial_profiles table
CREATE TABLE IF NOT EXISTS financial_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  residency_status TEXT NOT NULL,
  family_status TEXT NOT NULL,
  employment_income INTEGER DEFAULT 0,
  business_income INTEGER DEFAULT 0,
  investment_income INTEGER DEFAULT 0,
  other_income INTEGER DEFAULT 0,
  real_estate JSONB,
  investments JSONB,
  cash INTEGER DEFAULT 0,
  other_assets JSONB,
  tax_residency TEXT NOT NULL,
  tax_obligations JSONB,
  retirement_planning BOOLEAN DEFAULT FALSE,
  wealth_accumulation BOOLEAN DEFAULT FALSE,
  tax_optimization BOOLEAN DEFAULT FALSE,
  other_goals TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  profile_id INTEGER NOT NULL REFERENCES financial_profiles(id),
  report_content TEXT NOT NULL,
  recommendations JSONB,
  potential_savings INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create dashboard_settings table
CREATE TABLE IF NOT EXISTS dashboard_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  language TEXT NOT NULL DEFAULT 'en',
  currency TEXT NOT NULL DEFAULT 'EUR',
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create shared_results table
CREATE TABLE IF NOT EXISTS shared_results (
  id SERIAL PRIMARY KEY,
  share_id TEXT NOT NULL UNIQUE,
  result_data JSONB NOT NULL,
  score JSONB,
  is_protected BOOLEAN DEFAULT FALSE,
  access_password TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  view_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP
); 