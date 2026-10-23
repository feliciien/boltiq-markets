-- Migration: Add unique constraint on email for waitlist table
-- This ensures duplicate email registrations are prevented at the database level
-- PostgreSQL error code 23505 will be returned on violation

-- Add unique constraint on email column
ALTER TABLE waitlist 
ADD CONSTRAINT waitlist_email_unique UNIQUE (email);

-- Optional: Add index for faster lookups (unique constraint creates index automatically)
-- CREATE INDEX idx_waitlist_email ON waitlist(email);

-- Verify the constraint was created
-- SELECT conname, contype, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'waitlist'::regclass AND contype = 'u';