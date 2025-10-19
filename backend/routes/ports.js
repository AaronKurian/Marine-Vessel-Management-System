const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /ports - Get all ports
router.get('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  try {
    const { data: ports, error } = await supabase
      .from('ports')
      .select('port_id, port_name, country');

    if (error) {
      console.error('Supabase ports select error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch ports', details: error });
    }

    return res.json({ success: true, ports: ports || [] });
  } catch (err) {
    console.error('Ports route error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;