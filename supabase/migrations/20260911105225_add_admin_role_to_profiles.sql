/*
# Add admin role to profiles table

1. Changes to existing tables
   - `profiles`: adds `role` column (text, default 'user', CHECK in 'user','admin')
2. Security
   - Column-level privilege: `role` is NOT writable by authenticated users (REVOKE UPDATE)
   - Only admins can change roles via a SECURITY DEFINER function (added in a later migration)
   - Existing row-level policies on profiles remain unchanged (owner-scoped CRUD)
3. Notes
   - The `role` column uses `raw_app_meta_data` indirectly: the app reads `profiles.role` after login
   - Default is 'user' so all existing profiles become regular users automatically
   - Admin role must be set via SQL or a privileged function — never via frontend
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Column-level security: prevent users from changing their own role
REVOKE UPDATE ON profiles FROM authenticated;
GRANT UPDATE (full_name, pet_name) ON profiles TO authenticated;

-- Allow reading the role column (needed for frontend admin checks)
GRANT SELECT ON profiles TO authenticated;
