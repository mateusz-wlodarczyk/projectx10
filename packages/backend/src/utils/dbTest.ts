import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_KEY env vars');
}
const supabase = createClient(url, key);

async function testConnection() {
  const { data, error } = await supabase.from('your_table_name').select('*');
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Database data:', data);
  }
}

testConnection();
