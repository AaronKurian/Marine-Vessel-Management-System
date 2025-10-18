const { createClient } = require("@supabase/supabase-js");
require('dotenv').config();

const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseUrl = process.env.SUPABASE_URL;

let supabase = null;

if (!supabaseUrl || !anonKey) {
  // Don't throw here so the server can start in dev even when env vars are missing.
  // Routes that depend on Supabase will return a clear error.
  console.warn("Warning: SUPABASE_URL or SUPABASE_ANON_KEY is not set. Supabase client will be unavailable.");
} else {
  try {
    supabase = createClient(supabaseUrl, anonKey);
    console.log("Supabase client initialized successfully.");
  } catch (error) {
    console.error("Error creating Supabase client:", error);
    // Keep supabase as null so callers can handle the error instead of crashing the whole app.
    supabase = null;
  }
}

module.exports = supabase;