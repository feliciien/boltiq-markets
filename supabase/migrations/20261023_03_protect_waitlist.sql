-- The server API uses service_role. Browser roles must not read or write PII.
BEGIN;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.waitlist FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.waitlist TO service_role;
COMMIT;
