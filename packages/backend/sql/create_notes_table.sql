-- Create notes table for admin panel
CREATE TABLE IF NOT EXISTS notes (
  id BIGSERIAL PRIMARY KEY,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);

-- Enable Row Level Security (RLS)
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
-- Allow authenticated users to read all notes (admin functionality)
CREATE POLICY "Allow authenticated users to read notes" ON notes
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert notes
CREATE POLICY "Allow authenticated users to insert notes" ON notes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update notes
CREATE POLICY "Allow authenticated users to update notes" ON notes
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete notes
CREATE POLICY "Allow authenticated users to delete notes" ON notes
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO notes (notes, created_by) VALUES 
  ('Welcome to the admin panel notes system!', NULL),
  ('This is a sample note for testing purposes.', NULL),
  ('Notes can be used to store important information and reminders.', NULL)
ON CONFLICT DO NOTHING;
