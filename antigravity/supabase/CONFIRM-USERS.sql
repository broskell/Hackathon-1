-- Run this in Supabase SQL Editor if login says "invalid credentials"
-- but signup says "already registered" (email confirmation blocking login)

-- 1) Confirm all users so they can sign in immediately
UPDATE auth.users
SET
  email_confirmed_at = COALESCE(email_confirmed_at, NOW()),
  confirmed_at = COALESCE(confirmed_at, NOW())
WHERE email_confirmed_at IS NULL;

-- 2) Backfill profiles for every auth user
INSERT INTO profiles (id, full_name, email, role)
SELECT
  u.id,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  u.email,
  COALESCE(u.raw_user_meta_data->>'role', 'employee')
FROM auth.users u
WHERE NOT EXISTS (SELECT 1 FROM profiles p WHERE p.id = u.id);

-- 3) Show users and confirmation status
SELECT
  id,
  email,
  email_confirmed_at IS NOT NULL AS email_confirmed,
  created_at
FROM auth.users
ORDER BY created_at DESC;
