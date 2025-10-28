-- Temporarily disable RLS for notes table to allow all operations
ALTER TABLE notes DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS but allow all operations:
-- DROP POLICY IF EXISTS "Allow authenticated users to read notes" ON notes;
-- DROP POLICY IF EXISTS "Allow authenticated users to insert notes" ON notes;
-- DROP POLICY IF EXISTS "Allow authenticated users to update notes" ON notes;
-- DROP POLICY IF EXISTS "Allow authenticated users to delete notes" ON notes;

-- Create more permissive policies that allow all operations without authentication
-- CREATE POLICY "Allow all to read notes" ON notes FOR SELECT USING (true);
-- CREATE POLICY "Allow all to insert notes" ON notes FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Allow all to update notes" ON notes FOR UPDATE USING (true);
-- CREATE POLICY "Allow all to delete notes" ON notes FOR DELETE USING (true);

