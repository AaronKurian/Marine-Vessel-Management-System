const express = require('express')
const router = express.Router()
const supabase = require('../../utils/supabase')

// GET /voyages - list voyages
router.get('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' })
  try {
    const { data, error } = await supabase.from('voyages').select('*')
    if (error) {
      console.error('Supabase voyages select error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch voyages', details: error })
    }
    return res.json({ success: true, voyages: data || [] })
  } catch (err) {
    console.error('Voyages route error:', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// POST /voyages - add a voyage
router.post('/', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' })
  const { vessel_id, from_port, to_port, departure_date, imo, status } = req.body
  if (!vessel_id || !from_port || !to_port) {
    return res.status(400).json({ success: false, error: 'Missing required fields: vessel_id, from_port, to_port' })
  }
  try {
    const { data, error } = await supabase.from('voyages').insert([{ vessel_id, from_port, to_port, departure_date, imo, status }]).select()
    if (error) {
      console.error('Supabase insert voyage error:', error)
      return res.status(500).json({ success: false, error: 'Failed to create voyage', details: error })
    }
    return res.status(201).json({ success: true, voyage: data[0] })
  } catch (err) {
    console.error('Insert voyage catch error:', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

module.exports = router
