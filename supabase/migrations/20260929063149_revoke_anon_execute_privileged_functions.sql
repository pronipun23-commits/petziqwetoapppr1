/*
# Revoke anon execute on privileged SECURITY DEFINER functions

Several SECURITY DEFINER functions were callable by the anon role, which is
a security risk for admin/mutation functions. This migration revokes EXECUTE
from anon for functions that should only be called by authenticated users
(or admin-only). Public read functions (search_animal_records, get_animal_types,
get_public_tag_info, is_admin) remain callable by anon as intended.

## Functions revoked from anon:
- batch_insert_animal_records — admin-only batch import
- get_admin_stats — admin-only dashboard stats
- activate_smart_tag — requires authenticated user
- deactivate_smart_tag — requires authenticated user
- update_order_status — admin-only
- update_tag_status — admin-only
- generate_smart_tags — admin-only
- assign_tags_to_order — admin-only
- create_smart_tag_order — public checkout (keeps anon for order placement)
- add_xp — internal, should not be callable by anon
- record_care_task — internal, should not be callable by anon

## Functions that KEEP anon execute (intentionally public):
- search_animal_records — public breed search
- get_animal_types — public filter data
- get_public_tag_info — public tag scanning
- is_admin — used by RLS policies
- create_smart_tag_order — public checkout flow

## Security
No new tables. Only REVOKE statements — safe to re-run.
*/

REVOKE EXECUTE ON FUNCTION batch_insert_animal_records(jsonb) FROM anon;
REVOKE EXECUTE ON FUNCTION get_admin_stats() FROM anon;
REVOKE EXECUTE ON FUNCTION activate_smart_tag(text, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION deactivate_smart_tag(text) FROM anon;
REVOKE EXECUTE ON FUNCTION update_order_status(uuid, text, text, text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION update_tag_status(text, text) FROM anon;
REVOKE EXECUTE ON FUNCTION generate_smart_tags(int) FROM anon;
REVOKE EXECUTE ON FUNCTION assign_tags_to_order(uuid, text[]) FROM anon;
REVOKE EXECUTE ON FUNCTION add_xp(uuid, int) FROM anon;
REVOKE EXECUTE ON FUNCTION record_care_task(uuid) FROM anon;
