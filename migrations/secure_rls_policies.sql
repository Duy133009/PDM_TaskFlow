-- Migration: Secure RLS Policies for Tasks
-- Description: Drops insecure 'viewable by everyone' policies and enforces strict owner/assignee access.

BEGIN;

-- 1. Drop insecure/old policies
DROP POLICY IF EXISTS "Tasks are viewable by everyone" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can update tasks" ON tasks;
DROP POLICY IF EXISTS "Authenticated users can create tasks" ON tasks;
DROP POLICY IF EXISTS "Users can read accessible tasks" ON tasks;

-- 2. Create strict Read policy
-- Users can see tasks if they are the owner OR assignee OR subscribed (legacy)
CREATE POLICY "Users can read accessible tasks" ON tasks
FOR SELECT
USING (
  user_id = auth.uid() OR
  assignee_id = auth.uid() OR
  id IN (
    SELECT task_id FROM task_subscriptions WHERE user_id = auth.uid()
  )
);

-- 3. Create strict Update policy for Assignees
-- Assignees can update the task (e.g. to mark as done)
CREATE POLICY "Assignees can update tasks" ON tasks
FOR UPDATE
USING (assignee_id = auth.uid());

-- Note: "Users can insert own tasks" and "Users can update own tasks" policies are assumed to exist.

COMMIT;
