const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /vessels/captain/:id - Get vessel details for a captain
router.get('/captain/:id', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  try {
    const { data: vessels, error } = await supabase
      .from('vessels')
      .select('*')
      .eq('captain_id', req.params.id);

    if (error) {
      console.error('Supabase vessel select error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch vessel data' });
    }

    if (!vessels || vessels.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'No vessels found for this captain' 
      });
    }

    return res.json({ success: true, vessels });
  } catch (err) {
    console.error('Get vessel error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// PUT /vessels/:id/status - Update vessel status
router.put('/:id/status', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  const { status } = req.body;
  const vesselId = req.params.id;

  if (!status || !['At Port', 'At Sea'].includes(status)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid status. Must be either "At Port" or "At Sea"' 
    });
  }

  try {
    const { data: vessel, error } = await supabase
      .from('vessels')
      .update({ status })
      .eq('vessel_id', vesselId)
      .select()
      .single();

    if (error) {
      console.error('Supabase update vessel error:', error);
      return res.status(500).json({ success: false, error: 'Failed to update vessel status' });
    }

    if (!vessel) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vessel not found' 
      });
    }

    return res.json({ success: true, vessel });
  } catch (err) {
    console.error('Update vessel status error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// GET /vessels/owner/:ownerId
router.get('/owner/:ownerId', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  const { ownerId } = req.params;
  if (!ownerId) return res.status(400).json({ success: false, error: 'Missing ownerId' });

  try {
    const { data: vessels, error } = await supabase
      .from('vessels')
      .select('*')
      .eq('owner_id', ownerId);

    if (error) {
      console.error('Supabase vessels select error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch vessels', details: error });
    }

    const captainIds = Array.from(new Set((vessels || []).map((v) => v.captain_id).filter(Boolean)));

    console.log( "captain id is:",captainIds);

    let captainMap = {};
    if (captainIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('user_id, name')
        .in('user_id', captainIds);

      if (usersError) {
        console.error('Supabase users select error:', usersError);
      } else {
        users.forEach((u) => {
          const key = u.user_id ?? u.id;
          captainMap[key] = u.name;
        });
      }
    }

    const enriched = (vessels || []).map((v) => ({
      ...v,
      captain_name: captainMap[v.captain_id] || null,
    }));

    return res.json({ success: true, vessels: enriched });
  } catch (err) {
    console.error('Vessels route error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;

// POST /vessels
router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  const { imo_number, vessel_name, status, capacity, captain_id, owner_id } = req.body;
  if (!imo_number || !vessel_name || !owner_id) {
    return res.status(400).json({ success: false, error: 'Missing required fields: imo_number, vessel_name, owner_id' });
  }

  try {
    const { data, error } = await supabase
      .from('vessels')
      .insert([{ imo_number, vessel_name, status, capacity, captain_id, owner_id }])
      .select();

    if (error) {
      console.error('Supabase insert vessel error:', error);
      return res.status(500).json({ success: false, error: 'Failed to insert vessel', details: error });
    }

    return res.status(201).json({ success: true, vessel: data[0] });
  } catch (err) {
    console.error('Insert vessel catch error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

