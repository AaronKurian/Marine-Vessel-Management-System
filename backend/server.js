const express = require("express");
const cors = require("cors"); // <-- import cors
const supabase = require("./utils/supabase");


const app = express();

// Enable CORS for your frontend origin
app.use(cors());

// Parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

// Signup endpoint
app.post('/signup', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not configured' });

  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Missing required fields: name, email, password, role' });
  }

try {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email, password, role }]);

    console.log('Supabase insert response:', { data, error });
    
  if (error) {
    console.error('Supabase insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to create user', details: error });
  }

  if (!data || data.length === 0) {
      console.warn('Supabase returned no data after insert, response:', { data, error });
      return res.status(500).json({ success: false, error: 'No data returned from Supabase' });
  }

    console.log('User inserted:', data[0]);
    return res.status(201).json({ success: true, message: 'User created', user: data[0], redirect: '/login' });
} catch (err) {
  console.error('Signup catch error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error', details: err.message });
}
});

// Login endpoint
app.post('/login', async (req, res) => {
  if (!supabase) return res.status(500).json({ error: 'Supabase client not configured' });

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing required field: email' });

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('Supabase select error:', error);
      return res.status(500).json({ success: false, error: 'Failed to query user' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, error: 'Account not registered. Please sign up.' });
    }
    return res.json({ success: true, message: 'User found', user: data[0] });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
