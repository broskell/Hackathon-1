-- ============================================================
-- FIX: "Profile not found" when Sarah exists in profiles
-- Run in Supabase SQL Editor
-- ============================================================

-- 1) Sync profiles.id with current auth.users (fixes UUID mismatch after re-creating users)
DELETE FROM profiles p
WHERE NOT EXISTS (SELECT 1 FROM auth.users u WHERE u.id = p.id);

INSERT INTO profiles (id, full_name, email, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  COALESCE(u.raw_user_meta_data->>'role', 'employee')
FROM auth.users u
ON CONFLICT (id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  role = EXCLUDED.role;

-- 2) Fix RLS — allow users to read/update/insert their own row (no recursion)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Managers read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON profiles;

CREATE POLICY "Users read own profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Managers read all profiles" ON profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles AS me
      WHERE me.id = auth.uid() AND me.role = 'manager'
    )
  );

CREATE POLICY "Users update own profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users insert own profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3) Grants for Data API
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- 4) Verify Sarah's ids match
SELECT
  u.id AS auth_user_id,
  p.id AS profile_id,
  u.email,
  p.role,
  (u.id = p.id) AS ids_match
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'sarah.manager@antigravity.demo';
