-- Migration: Create waitlist table with proper constraints
-- This migration creates the waitlist table if it doesn't exist,
-- defines correct field types and constraints, and enforces
-- case-insensitive email uniqueness.
--
-- Prerequisites:
--   - Supabase project with PostgreSQL database
--   - Appropriate permissions to create tables and constraints
--   - Run this migration before deploying the waitlist API
--
-- Compatibility:
--   - Safe to run on existing databases (uses IF NOT EXISTS)
--   - Does not modify existing data
--   - Adds unique expression index on lower(email) for case-insensitive uniqueness
--
-- Pre-migration check for existing case-insensitive duplicates:
--   SELECT lower(email), count(*) FROM waitlist GROUP BY lower(email) HAVING count(*) > 1;
-- If duplicates exist, resolve them manually before applying this migration.

-- Create waitlist table if it doesn't exist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  account_tier INTEGER NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('one-step', 'two-step')),
  privacy_accepted BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create unique expression index for case-insensitive email uniqueness
-- PostgreSQL does not support expressions in UNIQUE table constraints,
-- so we use a UNIQUE INDEX instead which provides the same guarantee.
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique_lower
ON waitlist (lower(email));

-- Verify the index was created
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'waitlist' AND indexname = 'waitlist_email_unique_lower';

-- Grant necessary permissions for the API to work
-- (Adjust roles as needed for your Supabase setup)
-- GRANT SELECT, INSERT ON waitlist TO anon, authenticated, service_role;