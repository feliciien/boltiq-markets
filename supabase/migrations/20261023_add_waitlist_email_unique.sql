-- Migration: Add case-insensitive unique constraint on email for waitlist table
-- This ensures duplicate email registrations are prevented at the database level
-- PostgreSQL error code 23505 will be returned on violation
--
-- This migration is designed to run AFTER 20261023_create_waitlist_table.sql
-- If the table already exists without the unique index, this adds it.
-- If the unique index already exists (from the create migration), this is a no-op.
--
-- Pre-migration check for existing case-insensitive duplicates:
--   SELECT lower(email), count(*) FROM waitlist GROUP BY lower(email) HAVING count(*) > 1;
-- If duplicates exist, resolve them manually before applying this migration.

-- Add unique expression index for case-insensitive email uniqueness
-- PostgreSQL does not support expressions in UNIQUE table constraints,
-- so we use a UNIQUE INDEX instead which provides the same guarantee.
CREATE UNIQUE INDEX IF NOT EXISTS waitlist_email_unique_lower
ON waitlist (lower(email));

-- Verify the index was created
-- SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'waitlist' AND indexname = 'waitlist_email_unique_lower';