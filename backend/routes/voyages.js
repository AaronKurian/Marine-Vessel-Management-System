const express = require('express');
const router = express.Router();
const supabase = require('../utils/supabase');

// GET /voyages/owner/:ownerId - Get all voyages for vessels owned by an owner
router.get('/owner/:ownerId', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  const { ownerId } = req.params;
  if (!ownerId) return res.status(400).json({ success: false, error: 'Missing ownerId' });

  try {
    // Get all voyages where vessel belongs to this owner using a join
    const { data: voyages, error } = await supabase
      .from('voyages')
      .select(`
        voyage_id,
        vessel_id,
        departure_port(port_id, port_name),
        arrival_port(port_id, port_name),
        departure_date,
        arrival_date,
        status,
        vessels!inner(vessel_name, imo_number, owner_id)
      `)
      .eq('vessels.owner_id', ownerId)
      .order('departure_date', { ascending: false });

    if (error) {
      console.error('Supabase voyages select error:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch voyages', details: error });
    }

    // Transform the response to match the frontend needs
    const enrichedVoyages = voyages.map(v => ({
      id: v.voyage_id,
      vessel_name: v.vessels.vessel_name,
      imo: v.vessels.imo_number,
      from: v.departure_port.port_name,
      to: v.arrival_port.port_name,
      departure_date: v.departure_date,
      arrival_date: v.arrival_date,
      status: {
        label: v.status,
        color: v.status === 'Not Departed' ? 'text-red-400' : 
               v.status === 'In Transit' ? 'text-emerald-400' : 
               'text-emerald-400'
      }
    }));

    return res.json({ success: true, voyages: enrichedVoyages });
  } catch (err) {
    console.error('Voyages route error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// POST /voyages - Create a new voyage
router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' });

  const { vessel_id, departure_port, arrival_port, departure_date, arrival_date, status } = req.body;

  if (!vessel_id || !departure_port || !arrival_port || !departure_date) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: vessel_id, departure_port, arrival_port, departure_date' 
    });
  }

  try {
    // First verify that this vessel exists and belongs to the owner
    const { data: vessel, error: vesselError } = await supabase
      .from('vessels')
      .select('vessel_id')
      .eq('vessel_id', vessel_id)
      .single();

    if (vesselError || !vessel) {
      return res.status(400).json({ success: false, error: 'Invalid vessel_id or vessel not found' });
    }

    const { data, error } = await supabase
      .from('voyages')
      .insert([{
        vessel_id,
        departure_port,
        arrival_port,
        departure_date,
        arrival_date,
        status: status || 'Not Departed'
      }])
      .select();

    if (error) {
      console.error('Supabase voyage insert error:', error);
      return res.status(500).json({ success: false, error: 'Failed to create voyage', details: error });
    }

    return res.status(201).json({ success: true, voyage: data[0] });
  } catch (err) {
    console.error('Insert voyage catch error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

module.exports = router;
