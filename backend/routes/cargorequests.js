const express = require('express')
const router = express.Router()
const  supabase  = require('../utils/supabase')

// Get cargo requests for a specific vessel
router.get('/vessel/:vesselId', async (req, res) => {
  try {
    const { vesselId } = req.params;

    const { data: voyages, error: voyagesError } = await supabase
      .from('voyages')
      .select(`
        voyage_id,
        cargorequests (
          request_id,
          cargo_manifest,
          crates_requested,
          status,
          created_at
        )
      `)
      .eq('vessel_id', vesselId);

    if (voyagesError) {
      console.error('Voyages fetch error:', voyagesError);
      throw voyagesError;
    }

    // Transform the nested data into a flat cargo requests array
    const cargoRequests = voyages.flatMap(voyage => 
      voyage.cargorequests?.map(request => ({
        ...request,
        voyage_id: voyage.voyage_id
      })) || []
    );

    // Sort by created_at descending (most recent first)
    cargoRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    res.json({
      success: true,
      cargoRequests
    });
  } catch (err) {
    console.error('Error fetching cargo requests:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cargo requests'
    });
  }
});

// Get cargo requests for fleet owner's vessels
router.get('/owner/:ownerId', async (req, res) => {
  try {
    const { ownerId } = req.params

    // Fetch vessels with nested voyages and cargo requests, including port details
    const { data: vessels, error: vesselError } = await supabase
      .from('vessels')
      .select(`
        vessel_id,
        vessel_name,
        imo_number,
        voyages (
          voyage_id,
          departure_date,
          arrival_date,
          status,
          departure:departure_port (
            port_id,
            port_name,
            country
          ),
          arrival:arrival_port (
            port_id,
            port_name,
            country
          ),
          cargorequests (
            request_id,
            trader_id,
            cargo_manifest,
            crates_requested,
            status,
            created_at
          )
        )
      `)
      .eq('owner_id', ownerId)

    if (vesselError) {
      console.error('Vessel fetch error:', vesselError)
      throw vesselError
    }

    if (!vessels || vessels.length === 0) {
      return res.json({ success: true, cargoRequests: [] })
    }

    // Transform the nested data into a flat cargo requests array
    const cargoRequests = vessels.flatMap(vessel => 
      vessel.voyages?.flatMap(voyage => 
        voyage.cargorequests?.map(request => ({
          request_id: request.request_id,
          trader_id: request.trader_id,
          vessel_id: vessel.vessel_id,
          vessels: {
            vessel_name: vessel.vessel_name,
            imo_number: vessel.imo_number
          },
          voyage_id: voyage.voyage_id,
          voyages: {
            departure_port: voyage.departure?.port_name || 'Unknown',
            arrival_port: voyage.arrival?.port_name || 'Unknown',
            departure_date: voyage.departure_date,
            arrival_date: voyage.arrival_date,
            status: voyage.status
          },
          cargo_manifest: request.cargo_manifest,
          crates_requested: request.crates_requested,
          status: request.status,
          created_at: request.created_at
        })) || []
      ) || []
    )

    // Sort by created_at descending (most recent first)
    cargoRequests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    res.json({
      success: true,
      cargoRequests: cargoRequests
    })
  } catch (err) {
    console.error('Error fetching cargo requests:', err)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cargo requests',
      details: err.message
    })
  }
})

// Update cargo request status
router.patch('/:requestId/status', async (req, res) => {
  try {
    const { requestId } = req.params
    const { status } = req.body

    if (!['Pending', 'Approved', 'Rejected', 'Picked Up', 'In Transit', 'Delivered'].includes(status)) {
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