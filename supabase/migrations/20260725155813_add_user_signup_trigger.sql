/*
# Add trigger to auto-create profile on user signup

## Problem
The frontend calls supabase.auth.signUp() then immediately tries to INSERT into profiles.
The profiles INSERT RLS policy requires `TO authenticated WITH CHECK (auth.uid() = id)`.
When signUp returns, the session may not be active yet (e.g. email confirmation on),
so auth.uid() returns NULL and the INSERT is silently blocked by RLS — the auth user
is created but the profile row never appears.

## Fix
1. Create a SECURITY DEFINER trigger function `handle_new_user()` that inserts a profile
   row using the new user's UUID and the `full_name` / `pet_name` stored in
   `raw_user_meta_data` (passed from the frontend via signUp options.data).
2. Fire it AFTER INSERT on auth.users so the profile is created in the same transaction
   as the auth user — no client-side insert needed, no RLS issue.
3. ON CONFLICT (id) DO NOTHING prevents duplicate profiles if the trigger fires twice.

## Security
- The function is SECURITY DEFINER with search_path locked to public, so it can insert
  into profiles regardless of RLS. It only reads auth metadata and inserts — no
  sensitive data exposure.
- No changes to existing RLS policies or table structure.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, pet_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Petziq User'),
    COALESCE(NEW.raw_user_meta_data->>'pet_name', 'My Pet')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();