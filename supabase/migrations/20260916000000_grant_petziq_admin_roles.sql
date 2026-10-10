/*
# Grant Petziq administrator roles (server-side authorization)

## Purpose
Admin access is decided by `profiles.role`, not by the frontend. This migration
provisions the authorized Petziq team accounts and makes the `role` constraint
match the values the application already understands.

## Changes
1. `profiles.role` CHECK constraint widened to `('user', 'admin', 'marketing_admin')`
   so the `marketing_admin` role the frontend already supports can be stored.
   The previous migration only allowed `('user', 'admin')`, which made the
   marketing admin role impossible to persist.
2. Existing profiles whose auth email matches an authorized Petziq admin are
   promoted to `role = 'admin'`.

## Security
- Existing row-level policies are untouched.
- `role` remains unwritable by the `authenticated` role (column-level REVOKE
  from 20260911105225_add_admin_role_to_profiles.sql), so users cannot grant
  themselves admin access from the client.
- This migration is idempotent and only promotes the explicitly listed emails.

## THIRD ADMIN SLOT
When the third authorized admin email is provided, add it to the IN (...) list
below and re-run this migration, and add it to FULL_ADMIN_EMAILS in
`src/hooks/useAdmin.ts`.
*/

-- ============================================================================
-- 1. Align the role CHECK constraint with the roles the app supports
-- ============================================================================
DO $$
DECLARE
  con_name text;
BEGIN
  SELECT conname INTO con_name
  FROM pg_constraint
  WHERE conrelid = 'profiles'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%role%';

  IF con_name IS NOT NULL THEN
    EXECUTE format('ALTER TABLE profiles DROP CONSTRAINT %I', con_name);
  END IF;

  ALTER TABLE profiles
    ADD CONSTRAINT profiles_role_check
    CHECK (role IN ('user', 'admin', 'marketing_admin'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================================
-- 2. Provision the authorized Petziq Full Admins
-- ============================================================================
UPDATE profiles p
SET role = 'admin'
FROM auth.users u
WHERE p.id = u.id
  AND lower(u.email) IN (
    'pronipun23@gmail.com',
    'petziq.team@gmail.com',
    'nipunmenon2509@gmail.com'
    -- THIRD ADMIN SLOT: add the third authorized admin email here when provided.
  );

-- ============================================================================
-- 3. Provision the Marketing Admin
-- ============================================================================
UPDATE profiles p
SET role = 'marketing_admin'
FROM auth.users u
WHERE p.id = u.id
  AND lower(u.email) IN (
    'gavishvarun@gmail.com'
  );
