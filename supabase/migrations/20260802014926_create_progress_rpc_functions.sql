/*
# Create RPC functions for progress tracking

1. Functions
- `add_xp(p_user_id uuid, p_amount integer)` — adds XP to user_progress, auto-creates row if missing, returns new XP total.
- `record_care_task(p_user_id uuid)` — increments tasks_completed, updates care streak based on last_care_date, returns new streak.
  - If last_care_date is yesterday, increment streak by 1.
  - If last_care_date is today, no streak change (already counted).
  - If last_care_date is older or null, reset streak to 1.
  - Also adds 10 XP per task.

2. Security
- Both functions are SECURITY DEFINER (run as owner) so they can update user_progress rows.
- EXECUTE granted to authenticated only.
- Functions validate p_user_id matches auth.uid().
*/
CREATE OR REPLACE FUNCTION add_xp(p_user_id uuid, p_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  INSERT INTO user_progress (user_id, xp)
  VALUES (p_user_id, p_amount)
  ON CONFLICT (user_id)
  DO UPDATE SET xp = user_progress.xp + p_amount, updated_at = now();

  RETURN (SELECT xp FROM user_progress WHERE user_id = p_user_id);
END;
$$;

GRANT EXECUTE ON FUNCTION add_xp TO authenticated;

CREATE OR REPLACE FUNCTION record_care_task(p_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_streak integer;
  v_last_date date;
  v_today date := CURRENT_DATE;
  v_yesterday date := CURRENT_DATE - 1;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  SELECT care_streak, last_care_date INTO v_streak, v_last_date
  FROM user_progress WHERE user_id = p_user_id;

  IF v_last_date IS NULL OR v_last_date < v_yesterday THEN
    v_streak := 1;
  ELSIF v_last_date = v_yesterday THEN
    v_streak := COALESCE(v_streak, 0) + 1;
  ELSIF v_last_date = v_today THEN
    v_streak := COALESCE(v_streak, 1);
  END IF;

  INSERT INTO user_progress (user_id, xp, care_streak, last_care_date, tasks_completed)
  VALUES (p_user_id, 10, v_streak, v_today, 1)
  ON CONFLICT (user_id)
  DO UPDATE SET
    xp = user_progress.xp + 10,
    care_streak = v_streak,
    last_care_date = v_today,
    tasks_completed = user_progress.tasks_completed + 1,
    updated_at = now();

  RETURN v_streak;
END;
$$;

GRANT EXECUTE ON FUNCTION record_care_task TO authenticated;
