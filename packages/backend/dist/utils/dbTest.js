"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const supabase_js_1 = require("@supabase/supabase-js");
const supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
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
