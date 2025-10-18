const express = require("express");
const router = express.Router();
const supabase = require("../../utils/supabase");

router.post("/", async (req, res) => {
  if (!supabase) {
    return res.status(500).json({ error: "Supabase client not configured" });
  }

  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({
      error: "Missing required fields: name, email, password, role",
    });
  }

  try {
    // Check if an account with this email already exists
    const { data: existing, error: selectError } = await supabase
      .from('users')
      .select(' email')
      .eq('email', email)
      .limit(1);

    if (selectError) {
      console.error('Supabase select error (pre-insert):', selectError);
      return res.status(500).json({ success: false, error: 'Failed to validate email', details: selectError });
    }

    if (existing && existing.length > 0) {
      // Email already registered
      console.log('Signup attempted with existing email:', email);
      return res.status(409).json({ success: false, error: 'Account already exists' });
    }

    // Proceed to insert
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password, role }])
      .select();

    console.log('Supabase insert response:', { data, error });

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to create user', details: error });
    }

    if (!data || data.length === 0) {
      console.warn('Supabase returned no data after insert');
      return res.status(500).json({ success: false, error: 'No data returned from Supabase' });
    }

    console.log('User inserted:', data[0]);
    return res.status(201).json({ success: true, message: 'User created successfully', user: data[0] });
  } catch (err) {
    console.error('Signup catch error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
