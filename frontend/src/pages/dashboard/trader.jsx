import React, { useState, useEffect } from 'react'
import { FaPlus } from 'react-icons/fa'
import FloatingInput from '../../components/FloatingInput'
import { useNavigate } from 'react-router-dom'

// Helper to get status color
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'text-emerald-400'
    case 'pending':
      return 'text-yellow-400'
    case 'rejected':
      return 'text-red-500'
    case 'in transit':
    case 'departed':
    case 'picked up':
      return 'text-blue-400'
    case 'delivered':
      return 'text-emerald-500'
    default:
      return 'text-gray-400'
  }
}

// Inline component for the new cargo request form (Modal Content)
const NewCargoRequestModal = ({ voyage, traderId, onClose, onSuccess }) => {
  const [cargoManifest, setCargoManifest] = useState('')
  const [cratesRequested, setCratesRequested] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!cargoManifest || !cratesRequested) {
      alert('Please fill in both cargo manifest and crates requested.')
      setIsLoading(false)
      return
    }

    try {
      const payload = {
        voyage_id: voyage.id,
        trader_id: traderId,
        cargo_manifest: cargoManifest,
        crates_requested: Number(cratesRequested),
      }

      const res = await fetch('http://localhost:3000/cargorequests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      if (res.ok && data.success) {
        alert('Cargo request submitted successfully! Status: Pending.')
        onSuccess()
        onClose()
      } else {
        alert(data.error || 'Failed to submit cargo request')
      }
    } catch (err) {
      console.error('Error submitting cargo request:', err)
      alert('Error connecting to server')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='bg-[#1f2437] rounded-lg p-6 w-full max-w-md mx-auto'>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Create Cargo Request</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className='mb-4 space-y-2 text-sm'>
        <p><strong>Vessel:</strong> {voyage.vessel_name} ({voyage.imo_number})</p>
        <p><strong>Route:</strong> {voyage.departure_port} → {voyage.arrival_port}</p>
        <p><strong>Departure:</strong> {new Date(voyage.departure_date).toLocaleDateString()}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          type='text'
          label='Cargo Manifest (e.g., product type)'
          required
          value={cargoManifest}
          onChange={e => setCargoManifest(e.target.value)}
        />
        <FloatingInput
          type='number'
          label='Crates Requested'
          required
          value={cratesRequested}
          onChange={e => setCratesRequested(e.target.value)}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
      </form>
    </div>
  )
}

const TraderDashboard = () => {
  const [traderId, setTraderId] = useState(null)
  const [availableVoyages, setAvailableVoyages] = useState([])
  const [myCargoRequests, setMyCargoRequests] = useState([])
  const [loadingVoyages, setLoadingVoyages] = useState(true)
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [modalVoyage, setModalVoyage] = useState(null) // Holds voyage data for the modal
  const navigate = useNavigate()

  useEffect(() => {
    // 1. Get Trader ID
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/signin');
        return;
      }
      const user = JSON.parse(userString);
      setTraderId(user.id);
      
      // Fetch data immediately
      fetchAvailableVoyages();
      fetchMyCargoRequests(user.id);

    } catch (err) {
      console.error('Failed to load user session:', err);
      navigate('/signin');
    }
  }, [navigate]);

  const fetchAvailableVoyages = async () => {
    setLoadingVoyages(true);
    try {
      const res = await fetch('http://localhost:3000/voyages/available');
      const data = await res.json();
      if (res.ok && data.success) {
        // Filter: Keep only 'Not Departed' and 'In Transit'
        const filtered = (data.voyages || []).filter(v => 
          v.status === 'Not Departed' || v.status === 'In Transit'
        );
        setAvailableVoyages(filtered);
      } else {
        setAvailableVoyages([]);
      }
    } catch (err) {
      console.error('Failed to fetch available voyages:', err);
      setAvailableVoyages([]);
    } finally {
      setLoadingVoyages(false);
    }
  };

  const fetchMyCargoRequests = async (id) => {
    if (!id) return;
    setLoadingRequests(true);
    try {
      const res = await fetch(`http://localhost:3000/cargorequests/trader/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setMyCargoRequests(data.cargoRequests || []);
      } else {
        setMyCargoRequests([]);
      }
    } catch (err) {
      console.error('Failed to fetch my cargo requests:', err);
      setMyCargoRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleCargoRequestSuccess = () => {
    // Re-fetch my requests after a new one is successfully submitted
    fetchMyCargoRequests(traderId);
  };

  const openNewRequestModal = (voyage) => {
    setModalVoyage(voyage);
  };

  if (loadingVoyages && loadingRequests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-white">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8'>
      
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS] Trader Dashboard</div>
        <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
      </div>

      <div className='mt-6 space-y-8'>
        
        {/* Available Voyages Section */}
        <section>
          <h2 className='text-xl md:text-2xl font-semibold tracking-wide mb-4'>Available Voyages for Cargo:</h2>
          
          <div className='rounded-md border border-white/15 bg-[#2f344a]/70 max-h-[400px] overflow-y-auto'>
            {loadingVoyages ? (
              <div className='p-4 text-center text-gray-400'>Loading available voyages...</div>
            ) : availableVoyages.length === 0 ? (
              <div className='p-4 text-center text-gray-400'>No voyages currently accepting cargo.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead>
                  <tr className='bg-[#1f2437]'>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Vessel / IMO</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Route</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Departure</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-700/30'>
                  {availableVoyages.map((v) => (
                    <tr key={v.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white font-medium">{v.vessel_name}</div>
                          <div className="text-gray-400 text-sm">{v.imo_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {v.departure_port} &rarr; {v.arrival_port}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                          {new Date(v.departure_date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getStatusColor(v.status)}`}>
                        {v.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openNewRequestModal(v)}
                          className='bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 flex items-center justify-end ml-auto'
                        >
                          <FaPlus className='inline mr-1' /> Request Cargo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* My Cargo Requests Section */}
        <section>
          <h2 className='text-xl md:text-2xl font-semibold tracking-wide mb-4'>My Cargo Requests:</h2>
          
          <div className='rounded-md border border-white/15 bg-[#2f344a]/70 max-h-[400px] overflow-y-auto'>
            {loadingRequests ? (
              <div className='p-4 text-center text-gray-400'>Loading your requests...</div>
            ) : myCargoRequests.length === 0 ? (
              <div className='p-4 text-center text-gray-400'>You have no pending cargo requests.</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-700/50">
                <thead>
                  <tr className='bg-[#1f2437]'>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Request ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Manifest / Crates</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Vessel / Route</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date Submitted</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-700/30'>
                  {myCargoRequests.map((r) => (
                    <tr key={r.request_id}>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300">{r.request_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-white font-medium">{r.cargo_manifest}</div>
                          <div className="text-gray-400 text-sm">{r.crates_requested} crates</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-300">{r.voyage.vessel_name} ({r.voyage.imo_number})</div>
                        <div className="text-gray-400 text-sm">{r.voyage.departure_port} &rarr; {r.voyage.arrival_port}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                          {new Date(r.created_at).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap font-semibold ${getStatusColor(r.status)}`}>
                        {r.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* New Cargo Request Modal */}
      {modalVoyage && traderId && (
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
          <div className='absolute inset-0 bg-black/60' onClick={() => setModalVoyage(null)} />
          <div className='relative z-10 w-full max-w-lg'>
            <NewCargoRequestModal 
              voyage={modalVoyage}
              traderId={traderId}
              onClose={() => setModalVoyage(null)}
              onSuccess={handleCargoRequestSuccess}
            />
          </div>
        </div>
      )}

    </div>
  )
}

export default TraderDashboard