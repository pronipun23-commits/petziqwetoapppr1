/*
# Create profiles table for Petziq user accounts

## Purpose
Stores the user's display name and pet's name alongside their Supabase auth account.
The auth.users table handles email/password; this table extends it with app-specific profile data.

## New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users) — one row per auth user
  - `full_name` (text, not null) — the user's display name collected at registration
  - `pet_name` (text, not null) — the user's pet's name collected at registration
  - `created_at` (timestamptz, defaults to now())

## Security
- Row Level Security enabled on `profiles`.
- Each authenticated user can only read, insert, update, and delete their own profile row.
- The `id` column defaults to `auth.uid()` so inserts from the client (which omit `id`) are auto-filled.
- No access for the `anon` role — this table is for signed-in users only.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  pet_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
  ON profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = id);