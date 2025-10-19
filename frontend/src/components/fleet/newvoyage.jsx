import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const NewVoyage = ({ onClose, onVoyageScheduled }) => {
  const [departurePort, setDeparturePort] = useState('')
  const [arrivalPort, setArrivalPort] = useState('')
  const [departureDate, setDepartureDate] = useState(null)
  const [arrivalDate, setArrivalDate] = useState(null)
  const [status, setStatus] = useState('Not Departed')
  const [ports, setPorts] = useState([])
  const [loading, setLoading] = useState(true)
  const [vessels, setVessels] = useState([])
  const [selectedVessel, setSelectedVessel] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get owner ID from session
        const user = JSON.parse(sessionStorage.getItem('user'))
        if (!user || !user.id) {
          console.error('No user found in session')
          return
        }

        // Fetch ports and vessels in parallel
        const [portRes, vesselRes] = await Promise.all([
          fetch('http://localhost:3000/ports'),
          fetch(`http://localhost:3000/vessels/owner/${user.id}`)
        ])

        const [portData, vesselData] = await Promise.all([
          portRes.json(),
          vesselRes.json()
        ])

        if (portData.success) {
          setPorts(portData.ports || [])
        }
        if (vesselData.success) {
          setVessels(vesselData.vessels || [])
        }
      } catch (err) {
        console.error('Failed to fetch data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedVessel || !departurePort || !arrivalPort || !departureDate) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const payload = {
        vessel_id: selectedVessel,
        departure_port: departurePort,
        arrival_port: arrivalPort,
        departure_date: departureDate.toISOString().split('T')[0],
        arrival_date: arrivalDate ? arrivalDate.toISOString().split('T')[0] : null,
        status
      }

      const res = await fetch('http://localhost:3000/voyages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        alert('Voyage scheduled successfully!')
        if (onVoyageScheduled) onVoyageScheduled()
        onClose()
      } else {
        alert(data.error || 'Failed to schedule voyage')
      }
    } catch (err) {
      console.error('Error scheduling voyage:', err)
      alert('Error scheduling voyage')
    }
  }

  if (loading) {
    return (
      <div className="bg-[#1f2437] rounded-lg p-6 w-full">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-[#1f2437] rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Schedule New Voyage</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Vessel
          </label>
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a vessel</option>
            {vessels.map((vessel) => (
              <option key={vessel.vessel_id} value={vessel.vessel_id}>
                {vessel.vessel_name} ({vessel.imo_number})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Departure Port
          </label>
          <select
            value={departurePort}
            onChange={(e) => setDeparturePort(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select departure port</option>
            {ports.map((port) => (
              <option key={port.port_id} value={port.port_id}>
                {port.port_name} ({port.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Arrival Port
          </label>
          <select
            value={arrivalPort}
            onChange={(e) => setArrivalPort(e.target.value)}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select arrival port</option>
            {ports.map((port) => (
              <option key={port.port_id} value={port.port_id}>
                {port.port_name} ({port.country})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Departure Date
          </label>
          <DatePicker
            selected={departureDate}
            onChange={(date) => setDepartureDate(date)}
            dateFormat="dd-MM-yyyy"
            minDate={new Date()}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholderText="Select departure date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Arrival Date (Optional)
          </label>
          <DatePicker
            selected={arrivalDate}
            onChange={(date) => setArrivalDate(date)}
            dateFormat="dd-MM-yyyy"
            minDate={departureDate || new Date()}
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholderText="Select arrival date"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Not Departed">Not Departed</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Schedule Voyage
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewVoyage
