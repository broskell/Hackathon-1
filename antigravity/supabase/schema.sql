-- ============================================
-- ANTIGRAVITY DATABASE SCHEMA
-- Run in Supabase SQL Editor
-- ============================================

-- PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('manager', 'employee')),
  avatar_url TEXT,
  accountability_score NUMERIC DEFAULT 0 CHECK (accountability_score >= 0 AND accountability_score <= 100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own profile" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Managers read all profiles" ON profiles;
CREATE POLICY "Managers read all profiles" ON profiles FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "Users update own profile" ON profiles;
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users insert own profile" ON profiles;
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- TASKS
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','review','done','overdue')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  assigned_to UUID REFERENCES profiles(id),
  created_by UUID REFERENCES profiles(id) NOT NULL,
  due_date TIMESTAMPTZ,
  deliverables TEXT[] DEFAULT '{}',
  suggested_plan TEXT,
  ai_generated BOOLEAN DEFAULT FALSE,
  estimated_hours NUMERIC,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers CRUD tasks" ON tasks;
CREATE POLICY "Managers CRUD tasks" ON tasks FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "Employees read assigned tasks" ON tasks;
CREATE POLICY "Employees read assigned tasks" ON tasks FOR SELECT TO authenticated
  USING (auth.uid() = assigned_to);

DROP POLICY IF EXISTS "Employees update assigned tasks" ON tasks;
CREATE POLICY "Employees update assigned tasks" ON tasks FOR UPDATE TO authenticated
  USING (auth.uid() = assigned_to)
  WITH CHECK (auth.uid() = assigned_to);

-- WORK LOGS
CREATE TABLE IF NOT EXISTS work_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  hours_worked NUMERIC,
  trust_score NUMERIC CHECK (trust_score >= 0 AND trust_score <= 100),
  confidence TEXT CHECK (confidence IN ('High','Medium','Low')),
  ai_explanation TEXT,
  ai_flags TEXT[] DEFAULT '{}',
  ai_verdict TEXT CHECK (ai_verdict IN ('genuine','vague','suspicious')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE work_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Employees manage own logs" ON work_logs;
CREATE POLICY "Employees manage own logs" ON work_logs FOR ALL TO authenticated USING (auth.uid() = employee_id);

DROP POLICY IF EXISTS "Managers read all logs" ON work_logs;
CREATE POLICY "Managers read all logs" ON work_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  previous_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers read all audit logs" ON audit_logs;
CREATE POLICY "Managers read all audit logs" ON audit_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

DROP POLICY IF EXISTS "All users insert audit logs" ON audit_logs;
CREATE POLICY "All users insert audit logs" ON audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- TEAM SUMMARIES
CREATE TABLE IF NOT EXISTS team_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generated_by UUID REFERENCES profiles(id),
  risks JSONB DEFAULT '[]',
  blockers JSONB DEFAULT '[]',
  high_performers JSONB DEFAULT '[]',
  overdue_summary JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_summaries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Managers manage summaries" ON team_summaries;
CREATE POLICY "Managers manage summaries" ON team_summaries FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'manager')
);

-- Enable realtime for audit_logs
ALTER PUBLICATION supabase_realtime ADD TABLE audit_logs;

-- Grant access to authenticated role
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON tasks TO authenticated;
GRANT ALL ON work_logs TO authenticated;
GRANT ALL ON audit_logs TO authenticated;
GRANT ALL ON team_summaries TO authenticated;
