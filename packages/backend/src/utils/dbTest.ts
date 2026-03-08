import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function testConnection() {
  const { data, error } = await supabase.from('your_table_name').select('*');
  if (error) {
    console.error('Database connection error:', error);
  } else {
    console.log('Database data:', data);
  }
}

testConnection();
