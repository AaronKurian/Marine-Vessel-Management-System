import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import API_BASE_URL from '../../config/api'

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
          fetch(`${API_BASE_URL}/ports`),
          fetch(`${API_BASE_URL}/vessels/owner/${user.id}`)
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
      toast.warning('Please fill in all required fields', {
        position: "top-right",
        autoClose: 3000,
      })
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

      const res = await fetch(`${API_BASE_URL}/voyages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        toast.success('Voyage scheduled successfully!', {
          position: "top-right",
          autoClose: 3000,
        })
        if (onVoyageScheduled) onVoyageScheduled()
        onClose()
      } else {
        toast.error(data.error || 'Failed to schedule voyage', {
          position: "top-right",
          autoClose: 3000,
        })
      }
    } catch (err) {
      console.error('Error scheduling voyage:', err)
      toast.error('Error scheduling voyage', {
        position: "top-right",
        autoClose: 3000,
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-[#0b0c1a] rounded-xl p-6 md:p-8 w-full border border-white/10 shadow-2xl">
        <div className="text-center text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-[#0b0c1a] rounded-xl p-6 md:p-8 w-full border border-white/10 shadow-2xl scale-80">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Schedule New Voyage</h2>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white text-2xl transition-colors"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Select Vessel
          </label>
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value)}
            required
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <option value="Not Departed">Not Departed</option>
            <option value="In Transit">In Transit</option>
            <option value="Arrived">Arrived</option>
            <option value="Delayed">Delayed</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-white/10 rounded-full text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-full border border-white/10 transition-colors"
          >
            Schedule Voyage
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewVoyage
