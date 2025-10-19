const express = require('express')
const router = express.Router()
const { supabase } = require('../utils/supabase')

// Get cargo requests for fleet owner's vessels
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params

    // First get all vessels owned by this owner
    const { data: vessels, error: vesselError } = await supabase
      .from('vessels')
      .select(`
        vessel_id,
        vessel_name,
        imo_number,
        voyages (
          voyage_id,
          departure_port,
          arrival_port,
          departure_date,
          arrival_date,
          status,
          cargorequests (
            request_id,
            cargo_manifest,
            crates_requested,
            status,
            created_at
          )
        )
      `)
      .eq('owner_id', ownerId)

    if (vesselError) throw vesselError

    if (!vessels || vessels.length === 0) {
      return res.json({ success: true, cargoRequests: [] })
    }

    // Transform the nested data into a flat cargo requests array
    const cargoRequests = vessels.flatMap(vessel => 
      vessel.voyages?.flatMap(voyage => 
        voyage.cargorequests?.map(request => ({
          request_id: request.request_id,
          vessel_id: vessel.vessel_id,
          vessels: {
            vessel_name: vessel.vessel_name,
            imo_number: vessel.imo_number
          },
          voyage_id: voyage.voyage_id,
          voyages: {
            departure_port: voyage.departure_port,
            arrival_port: voyage.arrival_port,
            departure_date: voyage.departure_date,
            arrival_date: voyage.arrival_date,
            status: voyage.status
          },
          cargo_manifest: request.cargo_manifest,
          crates_requested: request.crates_requested,
          status: request.status,
          created_at: request.created_at
        }))
      ) || []
    ) || []
      .order('created_at', { ascending: false })

    if (requestError) throw requestError

    res.json({
      success: true,
      cargoRequests: cargoRequests || []
    })
  } catch (err) {
    console.error('Error fetching cargo requests:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cargo requests'
    })
  }
})

// Update cargo request status
router.patch('/:requestId/status', async (req, res) => {
  try {
    const { requestId } = req.params
    const { status } = req.body

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      })
    }

    const { data, error } = await supabase
      .from('cargorequests')
      .update({ status })
      .eq('request_id', requestId)
      .select()
      .single()

    if (error) throw error

    res.json({
      success: true,
      cargoRequest: data
    })
  } catch (err) {
    console.error('Error updating cargo request:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to update cargo request'
    })
  }
})

module.exports = router