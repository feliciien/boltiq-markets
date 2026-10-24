-- Apply alongside the retention endpoint when provisioning a database.
-- Existing Supabase service_role defaults may already include DELETE.
BEGIN;
GRANT DELETE ON TABLE public.waitlist TO service_role;
CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON public.waitlist (created_at);
COMMIT;
