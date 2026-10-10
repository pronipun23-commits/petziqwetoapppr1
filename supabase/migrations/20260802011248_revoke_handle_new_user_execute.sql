/*
# Revoke execute on handle_new_user from anon and authenticated

## Purpose
The handle_new_user() SECURITY DEFINER function is a trigger function that runs
automatically when a new auth user is created. It should NOT be callable directly
via the REST API by anon or authenticated users.

## Security
- Revoke EXECUTE on public.handle_new_user from anon and authenticated roles.
- The trigger still fires on INSERT to auth.users because triggers run with
  the caller's privileges in the trigger context (the postgres superuser during
  auth user creation), not through the REST API.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;