/*
# Revoke PUBLIC execute on handle_new_user

The function still had EXECUTE granted to PUBLIC (the default for new functions).
Revoke it so only service_role and postgres can call it — the trigger still
fires because it runs in the trigger context during auth.users INSERT.
*/

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;