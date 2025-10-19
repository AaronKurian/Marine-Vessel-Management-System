import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'
import VesselRow from '../../components/VesselRow'
import AddVessel from '../../components/fleet/AddVessel'
import NewVoyage from '../../components/fleet/newvoyage'

const FleetDashboard = () => {
  const [vessels, setVessels] = useState([])
  const [ownerId, setOwnerId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [voyageModalOpen, setVoyageModalOpen] = useState(false)
  const [initialCaptains, setInitialCaptains] = useState([])
  const [imoNumber, setImoNumber] = useState('')
  const [vesselName, setVesselName] = useState('')
  const [statusVal, setStatusVal] = useState('At Port')
  const [capacity, setCapacity] = useState('')
  const [captainId, setCaptainId] = useState('')
  const [voyages, setVoyages] = useState([])
  const [loadingVoyages, setLoadingVoyages] = useState(false)
  const [cargoRequests, setCargoRequests] = useState([])
  const [loadingRequests, setLoadingRequests] = useState(false)
  const navigate = useNavigate()

  const fetchCargoRequests = async (id) => {
    const owner = id ?? ownerId
    if (!owner) return
    setLoadingRequests(true)
    try {
      const res = await fetch(`http://localhost:3000/cargorequests/owner/${owner}`)
      const data = await res.json()
      if (res.ok && data.success) {
        setCargoRequests(data.cargoRequests || [])
      } else {
        setCargoRequests([])
      }
    } catch (err) {
      console.error('Failed to fetch cargo requests:', err)
      setCargoRequests([])
    } finally {
      setLoadingRequests(false)
    }
  }

  useEffect(() => {
    // Try to read owner id from sessionStorage (set during login)
    try {
      const user = JSON.parse(sessionStorage.getItem('user') || 'null')
      if (user && user.id) {
        setOwnerId(user.id)
        fetchVoyages(user.id) // Fetch voyages when owner ID is set
        fetchVessels(user.id) // Fetch vessels
        fetchCargoRequests(user.id) // Fetch cargo requests
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
    fetchVoyages(ownerId)
    fetchCargoRequests(ownerId)
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
        await fetchVessels()
        setModalOpen(false)
        setImoNumber('')
        setVesselName('')
        setStatusVal('At Port')
        setCapacity('')
        setCaptainId('')
      } else {
        alert(data.error || 'Failed to add vessel')
      }
    } catch (err) {
      console.error('Error adding vessel:', err)
      alert('Error adding vessel')
    }
  }

  // Fetch voyages for the owner
  const fetchVoyages = async (ownerId) => {
    if (!ownerId) return
    setLoadingVoyages(true)
    try {
      const res = await fetch(`http://localhost:3000/voyages/owner/${ownerId}`)
      const data = await res.json()
      if (res.ok && data.success) {
        setVoyages(data.voyages || [])
      } else {
        setVoyages([])
      }
    } catch (err) {
      console.error('Failed to fetch voyages:', err)
      setVoyages([])
    } finally {
      setLoadingVoyages(false)
    }
  }

  // Refresh voyages after scheduling a new one
  const handleVoyageScheduled = () => {
    fetchVoyages(ownerId)
    setVoyageModalOpen(false)
  }

  const VoyageCard = ({ idx, from, to, imo, status, vessel_name }) => {
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
                  <div className="flex flex-col">
                    <div className="text-sm text-gray-300">{imo}</div>
                    <div className="text-xs text-gray-400">{vessel_name}</div>
                  </div>
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
        <button
          onClick={() => {
            sessionStorage.removeItem('user')
            navigate('/auth')
          }}
          className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'
        >
          Logout
        </button>
      </div>

      <div className='mt-6 flex flex-col lg:flex-row gap-6'>
        {/* Left: Voyages column (smaller) */}
        <div className='w-full lg:w-80'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Voyages:</h2>
            <button 
              onClick={() => setVoyageModalOpen(true)}
              className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-full px-3 py-1 border border-white/10'
            >
              Schedule
            </button>
          </div>

          <div className='rounded-md border border-white/15 bg-[#2f344a]/70 flex flex-col gap-2 max-h-[600px] overflow-y-auto'>
            {loadingVoyages ? (
              <div className="p-4 text-center text-gray-400">Loading voyages...</div>
            ) : voyages.length === 0 ? (
              <div className="p-4 text-center text-gray-400">No voyages scheduled yet.</div>
            ) : (
              voyages.map((v, i) => (
                <VoyageCard 
                  key={v.id} 
                  idx={i + 1} 
                  vessel_name={v.vessel_name}
                  from={v.from}
                  to={v.to}
                  imo={v.imo}
                  status={v.status}
                />
              ))
            )}
          </div>
        </div>

        {/* Right: Main content */}
        <div className='flex-1 space-y-6'>
          {/* Vessels section */}
          <div>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Vessels:</h2>
              <button onClick={async () => {
                const captains = await fetchCaptains(ownerId)
                setModalOpen(true)
                setInitialCaptains(captains)
              }} className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-full px-5 py-1 border border-white/10'>
                Add Vessel <FaPlus className='inline-block ml-1' />
              </button>
            </div>

            {loading ? (
              <div className='p-4 text-center text-gray-400'>Loading vessels...</div>
            ) : (
              <div className='rounded-md overflow-hidden border border-white/15 bg-[#2f344a]/70 max-h-[300px] overflow-y-auto'>
                {vessels.length === 0 ? (
                  <div className='p-4 text-center text-gray-400'>No vessels found.</div>
                ) : (
                  vessels.map((v, i) => (
                    <VesselRow 
                      key={`${v.vessel_id || v.id}-${i}`} 
                      idx={i + 1} 
                      imo={v.imo_number || v.imo} 
                      name={v.vessel_name || v.name} 
                      captain={v.captain_name || v.captain} 
                      status={v.status} 
                    />
                  ))
                )}
              </div>
            )}
          </div>

          {/* Cargo Requests section */}
          <div>
            <h2 className='text-xl md:text-2xl font-semibold tracking-wide mb-4'>Cargo Requests:</h2>
            <div className='rounded-md border border-white/15 bg-[#2f344a]/70'>
              {loadingRequests ? (
                <div className='p-4 text-center text-gray-400'>Loading cargo requests...</div>
              ) : cargoRequests.length === 0 ? (
                <div className='p-4 text-center text-gray-400'>No cargo requests found.</div>
              ) : (
                <div className='max-h-[300px] overflow-y-auto'>
                  {cargoRequests.map((request) => (
                    <div
                      key={request.request_id}
                      className="flex items-center justify-between border-b border-gray-600/30 last:border-none p-4"
                    >
                      <div className="grid grid-cols-6 gap-4 w-full">
                        <div className="text-gray-300">
                          {request.vessels?.imo_number || 'N/A'}
                        </div>
                        <div className="text-gray-300">
                          {request.vessels?.vessel_name || 'N/A'}
                        </div>
                        <div className="text-gray-300">
                          {request.voyages?.departure_port || 'N/A'}
                        </div>
                        <div className="text-gray-300">
                          {request.voyages?.arrival_port || 'N/A'}
                        </div>
                        <div className="text-gray-300">
                          {request.crates_requested} crates
                        </div>
                        <div className={
                          request.status === 'Approved' 
                            ? 'text-emerald-400' 
                            : request.status === 'Pending'
                              ? 'text-red-400'
                              : 'text-gray-400'
                        }>
                          {request.status}
                        </div>
                      </div>

                      {request.status === 'Pending' && (
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `http://localhost:3000/cargorequests/${request.request_id}/status`,
                                  {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Approved' })
                                  }
                                )
                                if (res.ok) {
                                  fetchCargoRequests(ownerId)
                                }
                              } catch (err) {
                                console.error('Error updating request:', err)
                                alert('Failed to update request status')
                              }
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const res = await fetch(
                                  `http://localhost:3000/cargorequests/${request.request_id}/status`,
                                  {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: 'Rejected' })
                                  }
                                )
                                if (res.ok) {
                                  fetchCargoRequests(ownerId)
                                }
                              } catch (err) {
                                console.error('Error updating request:', err)
                                alert('Failed to update request status')
                              }
                            }}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Voyage Modal */}
      {voyageModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/60' onClick={() => setVoyageModalOpen(false)} />
          <div className='relative z-10 w-full max-w-4xl'>
            <NewVoyage 
              onClose={() => setVoyageModalOpen(false)}
              onVoyageScheduled={handleVoyageScheduled}
            />
          </div>
        </div>
      )}

      {/* Add Vessel Modal */}
      {modalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/60' onClick={() => setModalOpen(false)} />
          <div className='relative z-10 w-full max-w-lg'>
            <AddVessel 
              onClose={() => setModalOpen(false)}
              onSubmit={async (vesselData) => {
                try {
                  const payload = {
                    ...vesselData,
                    owner_id: ownerId
                  }
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
              }}
              initialData={{ captains: initialCaptains }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default FleetDashboard