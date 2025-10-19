import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import VesselRow from '../../components/VesselRow'
import NewVoyage from '../../components/fleet/newvoyage'

const FleetDashboard = () => {
  const [vessels, setVessels] = useState([])
  const [ownerId, setOwnerId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [initialCaptains, setInitialCaptains] = useState([])
  const [imoNumber, setImoNumber] = useState('')
  const [vesselName, setVesselName] = useState('')
  const [statusVal, setStatusVal] = useState('At Port')
  const [capacity, setCapacity] = useState('')
  const [captainId, setCaptainId] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Try to read owner id from sessionStorage (set during login)
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || 'null')
      if (user && user.id)
      {
        console.log(ownerId);
         setOwnerId(user.id)
      }
    } catch (err) {
      // ignore
    }
  }, [])

  const fetchVessels = async (id) => {
    const owner = id ?? ownerId
    if (!owner) return
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:3000/vessels/owner/${owner}`)
      const data = await res.json()
      if (res.ok && data.success) setVessels(data.vessels || [])
      else setVessels([])
    } catch (err) {
      console.error('Failed to fetch vessels:', err)
      setVessels([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCaptains = async (excludeId) => {
    try {
      const url = new URL('http://localhost:3000/users/captains')
      if (excludeId) url.searchParams.set('excludeId', excludeId)
      const res = await fetch(url.toString())
      const data = await res.json()
      if (res.ok && data.success) return data.users
      return []
    } catch (err) {
      console.error('Failed to fetch captains:', err)
      return []
    }
  }

  useEffect(() => {
    if (!ownerId) return
    fetchVessels()
  }, [ownerId])

  const submitVessel = async (e) => {
    e.preventDefault()
    const owner = ownerId
    if (!owner) {
      alert('Owner ID missing')
      return
    }

    if (!imoNumber || !vesselName) {
      alert('Please enter IMO number and vessel name')
      return
    }

    try {
      const payload = {
        imo_number: imoNumber,
        vessel_name: vesselName,
        status: statusVal,
        capacity: capacity ? Number(capacity) : null,
        captain_id: captainId ? Number(captainId) : null,
        owner_id: owner
      }

      const res = await fetch('http://localhost:3000/vessels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        // refresh vessels list
        await fetchVessels()
        setModalOpen(false)
        // reset form
        setImoNumber('')
        setVesselName('')
        setStatusVal('At Port')
        setCapacity('')
        setCaptainId('')
      } 
      else 
      {
        alert(data.error || 'Failed to add vessel')
      }
    } catch (err) {
      console.error('Error adding vessel:', err)
      alert('Error adding vessel')
    }
  }

  // sample voyages data to display in left column (same style as main Dashboard)
  const voyages = [
    { id: 1, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
    { id: 2, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'In Transit', color: 'text-emerald-400' } },
    { id: 3, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Arrived', color: 'text-emerald-400' } },
    { id: 4, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  ]

  const VoyageCard = ({ idx, from, to, imo, status }) => {
    return (
      <div className='border-b-2 border-white/50 px-3 py-2 last:border-none'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3 w-full'>
            <div className='shrink-0 text-right text-gray-200 w-6'>{idx}</div>
            <div className="flex flex-col w-full px-0">
              <div className="flex flex-row items-center w-full px-0">
                <div className="flex flex-row items-center flex-1 justify-between gap-2 text-left px-4 py-0">
                  <div className="font-semibold text-gray-100">{from}</div>
                  <div className="mx-2 opacity-60 w-6 h-px bg-white" />
                  <div className="font-semibold text-gray-100">{to}</div>
                </div>
              </div>
              <div className="flex flex-row items-center w-full px-0 mt-1">
                <div className="flex flex-row items-center flex-1 justify-between gap-2 px-4">
                  <div className="text-sm text-gray-300">{imo}</div>
                  <div className={`text-xs font-semibold ${status.color}`}>{status.label}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8'>
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS] Fleet</div>
        <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
      </div>

      <div className='mt-6 flex gap-6'>
        {/* Left: Voyages column (smaller) */}
        <div className='w-full lg:w-80'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Voyages:</h2>
            <button className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-full px-3 py-1 border border-white/10'>
              Schedule
            </button>
          </div>

          <div className='rounded-md border border-white/15 bg-[#2f344a]/70 flex flex-col gap-2 max-h-[600px] overflow-y-auto'>
            {voyages.map((v, i) => (
              <VoyageCard key={`${v.id}-${i}`} idx={i + 1} {...v} />
            ))}
          </div>
        </div>

        {/* Right: Vessels (larger) */}
        <div className='flex-1'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Vessels:</h2>
            <button onClick={async () => {
              const captains = await fetchCaptains(ownerId)
              setModalOpen(true)
              // pass captains into initialData via state hack: set a temporary variable
              setInitialCaptains(captains)
            }} className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-full px-5 py-1 border border-white/10'>
              Add Vessel <FaPlus className='inline-block ml-1' />
            </button>
          </div>

          {!ownerId && (
            <div className='mb-4'>
              <p className='mb-2'>Owner ID not found in session. Enter owner id to load vessels:</p>
              <input className='p-2 rounded' onChange={(e) => setOwnerId(e.target.value)} />
            </div>
          )}

          {loading ? (
            <div>Loading vessels...</div>
          ) : (
            <div className='rounded-md overflow-hidden border border-white/15 bg-[#2f344a]/70 max-h-[600px] overflow-y-auto'>
              {vessels.length === 0 ? (
                <div className='p-4'>No vessels found for owner.</div>
              ) : (
                vessels.map((v, i) => (
                  <VesselRow key={`${v.vessel_id || v.id}-${i}`} idx={i + 1} imo={v.imo_number || v.imo} name={v.vessel_name || v.name} captain={v.captain_name || v.captain} status={v.status} />
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Vessel Modal */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/60' onClick={() => setModalOpen(false)} />
          <div className='relative z-10 w-full max-w-lg'>
            <NewVoyage asVesselForm={true} initialData={{ captainOptions: initialCaptains }} onVesselSubmit={async (payload) => {
              // attach owner id
              payload.owner_id = ownerId
              try {
                const res = await fetch('http://localhost:3000/vessels', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payload)
                })
                const data = await res.json()
                if (res.ok && data.success) {
                  await fetchVessels()
                  setModalOpen(false)
                } else {
                  alert(data.error || 'Failed to add vessel')
                }
              } catch (err) {
                console.error('Error adding vessel:', err)
                alert('Error adding vessel')
              }
            }} />
          </div>
        </div>
      )}
    </div>
  )
}

export default FleetDashboard

