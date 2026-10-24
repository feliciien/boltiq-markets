# BoltIQ Markets launch readiness — 2026-10-24

Status: Preview signup and persistence verified. Production release remains gated on published policies and production database isolation.

## Current deployment

- Project: `feliciiens-projects/boltiq-markets` (`prj_uNpAk5PNLtqc0ElIS5T8VF9mu3Co`).
- Final preview: https://boltiq-markets-3j36yy2te-feliciiens-projects.vercel.app
- Deployment: `dpl_H5KZ2kpUffwfniFWhwZomB4WhGm1`.
- Source: working copy based on `5af6c31`, plus responsive fixes. This is a local-source deployment, not a pushed Git commit.
- Preview protection stays enabled. This work did not assign production domains.
- Production has Supabase settings added outside this work; their private values and database isolation have not been verified or overwritten.

## Verified database setup

- Dedicated project: `workfusionapp/boltiq-markets-preview`, reference `koveeuzxltnqxgtfcedm`, North Virginia.
- All three migrations executed together in a transaction through the SQL editor after user approval. SQL execution does not establish CLI migration-history records; reconcile history before a future CLI push.
- SQL verification confirmed UUID generation with `gen_random_uuid()`, a unique index on `lower(email)`, and row-level security.
- Anonymous and authenticated roles have no SELECT or INSERT table privileges; service_role has SELECT and INSERT.
- Direct REST tests: server reads succeed, while anonymous reads and inserts return 401.
- Vercel Preview has the Supabase URL and a server key stored as a Secret. No private credentials were printed or added to tracked files.

## End-to-end evidence

- Chrome signup for synthetic `BoltIQ Launch QA 20261024` succeeded and displayed confirmation with UUID `9083a4bc-569c-4ced-bc60-5b1c5ab8fced`.
- Direct database lookup found exactly one matching row with the same UUID, $100,000 tier, two-step challenge, and consent recorded.
- Missing privacy consent is rejected in the browser. The live API also returns 400 for missing consent.
- Browser duplicate submission displays the duplicate message. A raw uppercase-email request returns 409 `DUPLICATE_REGISTRATION`; exactly one matching row remains.
- Checked responses include `Cache-Control: no-store`.
- All three website images load. All section anchors resolve. Privacy and Terms still point to the FAQ and remain release blockers.
- Mobile navigation opens, follows Prop Evaluation, and closes.
- Responsive checks found and fixed marketplace overflow at 768px and navigation overflow at 1024px.
- Final deployed preview has no horizontal overflow at 320, 390, 768, 1024, 1280, and 1440 CSS pixels.
- Final deployed browser signup also succeeded with UUID `5554ee13-e039-4cc7-bc2b-5760de60c211`; a direct lookup confirms exactly one matching row. Proof: `final-preview-success-20261024.png` and `final-preview-database-proof.json`.
- All 41 automated tests pass; final layout changes pass TypeScript and the production build. Database/network outage handling is covered by automated mocks; no live outage was induced.
- Built browser assets contain neither the actual preview service key nor its private variable name.

The two marked QA rows are retained in the preview database as evidence. No customer records were deleted.

## Implemented fixes and artifacts

- Marketplace controls stack below the title on tablet screens; flex sizing is bounded and filters scroll internally.
- Full desktop navigation begins at the extra-large breakpoint, retaining the drawer at narrower widths.
- Deployment excludes the untracked dependency backup and unrelated phase report, alongside environment files and backups.
- Original untracked files and unrelated commits were preserved.
- Evidence is under ignored `.vercel/qa/`: database-verification.json/png, signup-database-proof.json, signup-success-20261024.png, duplicate-rejection-20261024.png, and responsive verification screenshots.
- Keep credential files and Vercel authentication state out of published release artifacts.

## Production gates

1. Publish first-party Privacy Policy and Terms pages and wire the footer and consent label. Business contact, retention, and applicable terms need confirmation; no unrelated policy or invented business promise was published.
2. Verify a separate production database and its credentials. Existing production environment entries are present, but isolation from QA remains unverified.
3. Apply/reconcile production migrations and verify UUIDs, uniqueness, RLS, and browser-role denial.
4. Stage a production-environment deployment without assigning domains, test registration and duplicate handling, then promote the tested build when these gates are met. Promoting Preview can rebuild with different environment settings.

Supabase CLI authentication is not needed for the completed preview verification. Reconcile migration history before adopting CLI migration management.
