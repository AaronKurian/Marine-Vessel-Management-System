const express = require('express')
const router = express.Router()
const supabase = require('../utils/supabase')

// GET /users/captains?excludeId=123
router.get('/captains', async (req, res) => {
  if (!supabase) return res.status(500).json({ success: false, error: 'Supabase client not configured' })
  const { excludeId } = req.query

  try {
    // case-insensitive match for role containing 'captain'
    let query = supabase.from('users').select('user_id, id, name, role')
      .ilike('role', '%captain%')

    const { data, error } = await query

    if (error) {
      console.error('Supabase users select error:', error)
      return res.status(500).json({ success: false, error: 'Failed to fetch users', details: error })
    }

    let users = (data || []).map(u => ({ id: u.user_id ?? u.id, name: u.name }))

    if (excludeId) {
      users = users.filter(u => String(u.id) !== String(excludeId))
    }

    return res.json({ success: true, users })
  } catch (err) {
    console.error('Users route error:', err)
    return res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

module.exports = router
