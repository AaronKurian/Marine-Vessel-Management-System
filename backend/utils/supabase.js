const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

let supabase = null;

if (!supabaseUrl || !anonKey) {
  console.warn("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set. Supabase client will be unavailable.");
} else {
  try {
    supabase = createClient(supabaseUrl, anonKey);
    console.log("Supabase client initialized successfully.");
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    supabase = null;
  }
}

module.exports = supabase;