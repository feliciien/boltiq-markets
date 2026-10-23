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
--   - Adds unique constraint on lower(email) for case-insensitive uniqueness

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

-- Create index for faster email lookups (case-insensitive)
CREATE INDEX IF NOT EXISTS idx_waitlist_email_lower ON waitlist (lower(email));

-- Add unique constraint on lower(email) for case-insensitive uniqueness
-- This prevents duplicate registrations regardless of email case
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'waitlist_email_unique'
    AND conrelid = 'waitlist'::regclass
  ) THEN
    ALTER TABLE waitlist
    ADD CONSTRAINT waitlist_email_unique UNIQUE (lower(email));
  END IF;
END $$;

-- Verify the constraint was created
-- SELECT conname, contype, pg_get_constraintdef(oid)
-- FROM pg_constraint
-- WHERE conrelid = 'waitlist'::regclass AND contype = 'u';

-- Grant necessary permissions for the API to work
-- (Adjust roles as needed for your Supabase setup)
-- GRANT SELECT, INSERT ON waitlist TO anon, authenticated, service_role;