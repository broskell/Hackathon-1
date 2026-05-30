-- ============================================
-- ANTIGRAVITY SEED DATA
-- Run AFTER creating demo users via signup or auth dashboard
--
-- Demo accounts to create (via /signup):
-- Manager: sarah.manager@antigravity.demo / demo1234
-- Manager: james.manager@antigravity.demo / demo1234
-- Employee: alice.chen@antigravity.demo / demo1234
-- Employee: bob.martinez@antigravity.demo / demo1234
-- Employee: carol.williams@antigravity.demo / demo1234
-- Employee: david.kim@antigravity.demo / demo1234
-- Employee: emma.johnson@antigravity.demo / demo1234
--
-- Then replace UUIDs below with actual auth.users IDs from:
-- SELECT id, email FROM auth.users;
-- ============================================

-- Example seed using subqueries by email (run after users exist):

DO $$
DECLARE
  mgr1 UUID;
  mgr2 UUID;
  emp1 UUID;
  emp2 UUID;
  emp3 UUID;
  emp4 UUID;
  emp5 UUID;
  t1 UUID; t2 UUID; t3 UUID; t4 UUID; t5 UUID;
  t6 UUID; t7 UUID; t8 UUID; t9 UUID; t10 UUID;
BEGIN
  SELECT id INTO mgr1 FROM auth.users WHERE email = 'sarah.manager@antigravity.demo';
  SELECT id INTO mgr2 FROM auth.users WHERE email = 'james.manager@antigravity.demo';
  SELECT id INTO emp1 FROM auth.users WHERE email = 'alice.chen@antigravity.demo';
  SELECT id INTO emp2 FROM auth.users WHERE email = 'bob.martinez@antigravity.demo';
  SELECT id INTO emp3 FROM auth.users WHERE email = 'carol.williams@antigravity.demo';
  SELECT id INTO emp4 FROM auth.users WHERE email = 'david.kim@antigravity.demo';
  SELECT id INTO emp5 FROM auth.users WHERE email = 'emma.johnson@antigravity.demo';

  IF mgr1 IS NULL THEN
    RAISE NOTICE 'Demo users not found. Create accounts via /signup first.';
    RETURN;
  END IF;

  -- Update accountability scores
  UPDATE profiles SET accountability_score = 92 WHERE id = emp1;
  UPDATE profiles SET accountability_score = 78 WHERE id = emp2;
  UPDATE profiles SET accountability_score = 65 WHERE id = emp3;
  UPDATE profiles SET accountability_score = 88 WHERE id = emp4;
  UPDATE profiles SET accountability_score = 45 WHERE id = emp5;

  -- Insert tasks
  INSERT INTO tasks (title, description, status, priority, assigned_to, created_by, due_date, deliverables, ai_generated, estimated_hours)
  VALUES
    ('Redesign checkout page', 'Modernize the checkout flow with improved UX and mobile responsiveness', 'in_progress', 'high', emp1, mgr1, NOW() + INTERVAL '5 days', ARRAY['Updated Figma mockups', 'Mobile-responsive layout', 'A/B test plan'], true, 24),
    ('Q1 sales report', 'Compile and analyze Q1 sales data with executive summary', 'review', 'medium', emp2, mgr1, NOW() + INTERVAL '2 days', ARRAY['Excel dashboard', 'Executive PDF summary'], false, 16),
    ('Customer onboarding flow', 'Build automated onboarding email sequence', 'todo', 'medium', emp3, mgr1, NOW() + INTERVAL '10 days', ARRAY['Email templates', 'Automation workflow'], true, 20),
    ('API rate limiting', 'Implement rate limiting for public API endpoints', 'in_progress', 'critical', emp4, mgr2, NOW() - INTERVAL '2 days', ARRAY['Rate limit middleware', 'Documentation update'], false, 12),
    ('Social media campaign', 'Launch March product awareness campaign', 'done', 'low', emp5, mgr1, NOW() - INTERVAL '5 days', ARRAY['Campaign assets', 'Analytics report'], false, 8),
    ('Database migration', 'Migrate user data to new schema version', 'overdue', 'critical', emp2, mgr2, NOW() - INTERVAL '3 days', ARRAY['Migration scripts', 'Rollback plan', 'Test report'], false, 32),
    ('Landing page copy', 'Write conversion-optimized copy for new landing page', 'in_progress', 'high', emp1, mgr1, NOW() + INTERVAL '7 days', ARRAY['Hero copy', 'Feature sections', 'CTA variants'], true, 10),
    ('Bug fix: login timeout', 'Fix session timeout issue on mobile browsers', 'todo', 'high', emp4, mgr2, NOW() + INTERVAL '3 days', ARRAY['Fix PR', 'Test cases'], false, 6),
    ('Team retrospective doc', 'Document sprint retrospective findings and action items', 'done', 'low', emp3, mgr1, NOW() - INTERVAL '1 day', ARRAY['Retro notes', 'Action items list'], false, 4),
    ('Inventory sync integration', 'Integrate warehouse inventory with Shopify', 'in_progress', 'medium', emp5, mgr2, NOW() + INTERVAL '14 days', ARRAY['Integration code', 'Sync monitoring'], false, 40)
  RETURNING id INTO t1;

  -- Work logs with AI verdicts
  INSERT INTO work_logs (task_id, employee_id, content, hours_worked, trust_score, confidence, ai_explanation, ai_flags, ai_verdict)
  SELECT t.id, emp1,
    'Redesigned the checkout form layout, updated CTA button colors and fixed mobile breakpoint on payment step. Exported updated Figma frames v3.2.',
    3.5, 87, 'High',
    'Detailed and specific work log with concrete deliverables mentioned. Clear progress on assigned checkout redesign task.',
    ARRAY[]::TEXT[], 'genuine'
  FROM tasks t WHERE t.title = 'Redesign checkout page' LIMIT 1;

  INSERT INTO work_logs (task_id, employee_id, content, hours_worked, trust_score, confidence, ai_explanation, ai_flags, ai_verdict)
  SELECT t.id, emp1,
    'Worked on the task and made some progress.',
    2, 28, 'Low',
    'Extremely vague with no specific actions, files, or outcomes mentioned.',
    ARRAY['No concrete deliverables', 'Generic language'], 'vague'
  FROM tasks t WHERE t.title = 'Landing page copy' LIMIT 1;

  INSERT INTO work_logs (task_id, employee_id, content, hours_worked, trust_score, confidence, ai_explanation, ai_flags, ai_verdict)
  SELECT t.id, emp2,
    'Completed Excel pivot tables for regional breakdown, added YoY comparison charts in Tab 3, sent draft to Sarah for review.',
    4, 91, 'High',
    'Excellent specificity with named deliverables and clear progress indicators.',
    ARRAY[]::TEXT[], 'genuine'
  FROM tasks t WHERE t.title = 'Q1 sales report' LIMIT 1;

  INSERT INTO work_logs (task_id, employee_id, content, hours_worked, trust_score, confidence, ai_explanation, ai_flags, ai_verdict)
  SELECT t.id, emp4,
    'Implemented token bucket rate limiter in middleware/rateLimit.ts, set 100 req/min for free tier, added Redis fallback.',
    5, 94, 'High',
    'Highly specific technical work with file paths and implementation details.',
    ARRAY[]::TEXT[], 'genuine'
  FROM tasks t WHERE t.title = 'API rate limiting' LIMIT 1;

  INSERT INTO work_logs (task_id, employee_id, content, hours_worked, trust_score, confidence, ai_explanation, ai_flags, ai_verdict)
  SELECT t.id, emp5,
    'Did some stuff on social media.',
    1, 22, 'Low',
    'No meaningful detail about actual work performed.',
    ARRAY['No specifics', 'Irrelevant phrasing'], 'suspicious'
  FROM tasks t WHERE t.title = 'Social media campaign' LIMIT 1;

  -- Audit log samples
  INSERT INTO audit_logs (user_id, action, entity_type, entity_id, new_value)
  SELECT mgr1, 'TASK_CREATED', 'task', t.id, jsonb_build_object('title', t.title)
  FROM tasks t LIMIT 5;

  RAISE NOTICE 'Seed data inserted successfully!';
END $$;
