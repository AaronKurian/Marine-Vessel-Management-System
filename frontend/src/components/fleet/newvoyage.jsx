import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Dropdown from '../Dropdown'

const NewVoyage = ({ asVesselForm = false, initialData = {}, onVesselSubmit }) => {
  // Voyage fields
  const [departurePort, setDeparturePort] = useState('')
  const [arrivalPort, setArrivalPort] = useState('')
  const [departureDate, setDepartureDate] = useState(null)
  const ports = ['COK', 'JED', 'NYC', 'LON', 'DXB']

  // Vessel form fields (when used as vessel modal)
  const [imoNumber, setImoNumber] = useState(initialData.imo || '')
  const [vesselName, setVesselName] = useState(initialData.vesselName || '')
  const [statusVal, setStatusVal] = useState(initialData.status || 'At Port')
  const [capacity, setCapacity] = useState(initialData.capacity || '')
  const [captainId, setCaptainId] = useState(initialData.captain_id || '')
  const [captainOptions, setCaptainOptions] = useState(initialData.captainOptions || [])

  const details = {
    vesselName: 'ROCO ODYSSEY',
    vesselId: '1',
    imo: 'IMO 1234567',
  }

  const handleSchedule = (e) => {
    e.preventDefault()
  }

  const handleVesselSubmit = (e) => {
    e.preventDefault()
    if (onVesselSubmit) {
      onVesselSubmit({
        imo_number: imoNumber,
        vessel_name: vesselName,
        status: statusVal,
        capacity: capacity ? Number(capacity) : null,
        captain_id: captainId ? Number(captainId) : null
      })
    }
  }

  if (!asVesselForm) {
    return (
      <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8 overflow-y-scroll'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS]</div>
          <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
        </div>

        {/* Card */}
        <div className='mt-10 md:mt-12 max-w-5xl mx-auto'>
          <div className='rounded-xl bg-[#2f344a]/70 border border-white/15 p-6 md:p-8'>
            <form onSubmit={handleSchedule}>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-8 items-start'>
                <div className='md:col-span-2 grid grid-cols-2 items-center gap-y-5'>
                  <div className='text-gray-300 w-40 shrink-0'>Date of Departure:</div>
                  <div className='w-full'>
                    <DatePicker
                      selected={departureDate}
                      onChange={(date) => setDepartureDate(date)}
                      placeholderText='Select date'
                      dateFormat='dd-MM-yyyy'
                      className='w-full bg-black/20 border border-white/10 text-white rounded-xl px-4 sm:pr-20 py-3 text-base md:text-lg outline-none'
                      calendarClassName='react-datepicker-dark'
                      popperClassName='react-datepicker-popper-dark'
                    />
                  </div>

                  <div className='text-gray-300 w-40 shrink-0'>Vessel Name:</div>
                  <div className='text-white w-full min-w-0'>{details.vesselName}</div>

                  <div className='text-gray-300 w-40 shrink-0'>Vessel ID:</div>
                  <div className='text-white w-full min-w-0'>{details.vesselId}</div>

                  <div className='text-gray-300 w-40 shrink-0'>IMO Number:</div>
                  <div className='text-white w-full min-w-0'>{details.imo}</div>

                  <div className='text-gray-300 w-40 shrink-0'>Port of Departure:</div>
                  <div className='w-full min-w-0 bg-black/20 rounded-lg border border-white/10'>
                    <Dropdown label='Select port' options={ports} value={departurePort} onChange={setDeparturePort} />
                  </div>

                  <div className='text-gray-300 w-40 shrink-0'>Port of Arrival:</div>
                  <div className='w-full min-w-0 bg-black/20 rounded-lg border border-white/10'>
                    <Dropdown label='Select port' options={ports} value={arrivalPort} onChange={setArrivalPort} />
                  </div>
                </div>
              </div>
              <div className='mt-6 w-full flex justify-end'>
                <button type='submit' className='bg-emerald-700/90 cursor-pointer hover:bg-emerald-600 text-white rounded-full px-5 py-2 border border-white/10'>
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Vessel form UI (used as modal)
  return (
    <form onSubmit={handleVesselSubmit} className='relative z-10 bg-[#0f1724] rounded-lg p-6 w-full max-w-lg border border-white/10'>
      <h3 className='text-xl font-semibold mb-4'>Add Vessel</h3>
      <div className='grid grid-cols-1 gap-3'>
        <label className='text-sm text-gray-300'>IMO Number</label>
        <input required value={imoNumber} onChange={(e) => setImoNumber(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10' />

        <label className='text-sm text-gray-300'>Vessel Name</label>
        <input required value={vesselName} onChange={(e) => setVesselName(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10' />

        <label className='text-sm text-gray-300'>Status</label>
        <input value={statusVal} onChange={(e) => setStatusVal(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10' />

        <label className='text-sm text-gray-300'>Capacity</label>
        <input value={capacity} onChange={(e) => setCapacity(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10' />

        <label className='text-sm text-gray-300'>Captain (optional)</label>
        {captainOptions && captainOptions.length > 0 ? (
          <select value={captainId} onChange={(e) => setCaptainId(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10'>
            <option value=''>-- None --</option>
            {captainOptions.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.id})</option>
            ))}
          </select>
        ) : (
          <input value={captainId} onChange={(e) => setCaptainId(e.target.value)} className='p-2 rounded bg-[#111827] border border-white/10' />
        )}
      </div>

      <div className='flex items-center justify-end gap-3 mt-4'>
        <button type='button' className='px-4 py-2 rounded bg-gray-700/40'>Cancel</button>
        <button type='submit' className='px-4 py-2 rounded bg-emerald-600'>Add Vessel</button>
      </div>
    </form>
  )
}

export default NewVoyage
