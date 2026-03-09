"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;
if (!url || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY env vars');
}
const supabase = (0, supabase_js_1.createClient)(url, key);
async function testConnection() {
    const { data, error } = await supabase.from('your_table_name').select('*');
    if (error) {
        console.error('Database connection error:', error);
    }
    else {
        console.log('Database data:', data);
    }
}
testConnection();
