-- Read-only preflight: run before migrations and again afterward.
SELECT lower(email) AS normalized_email, count(*)
FROM public.waitlist GROUP BY lower(email) HAVING count(*) > 1;

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'waitlist'
ORDER BY ordinal_position;

SELECT indexname, indexdef FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'waitlist';

SELECT relrowsecurity FROM pg_class
WHERE oid = 'public.waitlist'::regclass;

SELECT role_name,
  has_table_privilege(role_name, 'public.waitlist', 'SELECT') AS can_read,
  has_table_privilege(role_name, 'public.waitlist', 'INSERT') AS can_insert
FROM (VALUES ('anon'), ('authenticated'), ('service_role')) AS roles(role_name);

SELECT policyname, roles, cmd, qual, with_check FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'waitlist';
