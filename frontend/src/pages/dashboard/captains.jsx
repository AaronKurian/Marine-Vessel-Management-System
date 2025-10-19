import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Helper to get status color, consistent with TraderDashboard
const getStatusColor = (status) => {
  if (!status) return 'text-gray-400';
  switch (status.toLowerCase()) {
    case 'arrived':
    case 'delivered':
      return 'text-emerald-400';
    case 'in transit':
    case 'departed':
    case 'picked up':
    case 'at sea':
      return 'text-blue-400';
    case 'not departed':
    case 'delayed':
    case 'pending':
      return 'text-yellow-400';
    case 'at port':
      return 'text-amber-500';
    case 'rejected':
      return 'text-red-500';
    default:
      return 'text-gray-400';
  }
}

const CaptainDashboard = () => {
  const [vessels, setVessels] = useState([]);
  const [voyages, setVoyages] = useState([]);
  const [cargoRequests, setCargoRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCargo, setLoadingCargo] = useState(false);
  
  // Modal states
  const [showVesselModal, setShowVesselModal] = useState(false);
  const [showVoyageStatusModal, setShowVoyageStatusModal] = useState(false);
  const [showCargoStatusModal, setShowCargoStatusModal] = useState(false);
  
  // Selected item states
  const [selectedVessel, setSelectedVessel] = useState(null);
  const [selectedVoyage, setSelectedVoyage] = useState(null);
  const [selectedCargo, setSelectedCargo] = useState(null);

  // Status options
  const voyageStatusOptions = ['Departed', 'In Transit', 'Delayed', 'Arrived'];
  const cargoStatusOptions = ['Picked Up', 'Delivered', 'Delayed'];
  const vesselStatusOptions = ['At Sea', 'At Port'];
  
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('user')
    navigate('/')
  }

  useEffect(() => {
    fetchCaptainData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if event target is outside the modal content and its trigger buttons
      if (
        !event.target.closest('.modal-content') &&
        !event.target.closest('button[data-modal-trigger]')
      ) {
        setShowVoyageStatusModal(false);
        setShowCargoStatusModal(false);
        setShowVesselModal(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowVoyageStatusModal(false);
        setShowCargoStatusModal(false);
        setShowVesselModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const fetchCargoRequests = async (vesselId) => {
    setLoadingCargo(true);
    try {
      const res = await fetch(`http://localhost:3000/cargorequests/vessel/${vesselId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        // Filter out non-approved cargo (since a captain only manages approved/assigned cargo)
        const approvedCargo = (data.cargoRequests || []).filter(c => c.status !== 'Pending' && c.status !== 'Rejected');
        setCargoRequests(approvedCargo);
      }
    } catch (error) {
      console.error('Error fetching cargo requests:', error);
      alert('Failed to fetch cargo requests');
    } finally {
      setLoadingCargo(false);
    }
  };

  const fetchCaptainData = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/signin');
        return;
      }
      const user = JSON.parse(userString);

      const vesselsRes = await fetch(`http://localhost:3000/vessels/captain/${user.id}`);
      if (!vesselsRes.ok) throw new Error('Failed to fetch vessels data');
      const vesselsData = await vesselsRes.json();
      
      if (vesselsData && vesselsData.vessels) {
        setVessels(vesselsData.vessels);
        if (vesselsData.vessels.length > 0) {
          const firstVessel = vesselsData.vessels[0];
          setSelectedVessel(firstVessel);

          const voyagesRes = await fetch(`http://localhost:3000/voyages/vessel/${firstVessel.vessel_id}`);
          if (!voyagesRes.ok) throw new Error('Failed to fetch voyages data');
          const voyagesData = await voyagesRes.json();
          
          if (voyagesData && voyagesData.voyages) {
            setVoyages(voyagesData.voyages);
          }

          await fetchCargoRequests(firstVessel.vessel_id);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching captain data:', error);
      setLoading(false);
    }
  };

  const handleVesselSelect = async (vesselId) => {
    const vessel = vessels.find(v => v.vessel_id === vesselId);
    setSelectedVessel(vessel);
    
    try {
      const voyagesRes = await fetch(`http://localhost:3000/voyages/vessel/${vesselId}`);
      if (!voyagesRes.ok) throw new Error('Failed to fetch voyages data');
      const voyagesData = await voyagesRes.json();
      
      if (voyagesData && voyagesData.voyages) {
        setVoyages(voyagesData.voyages);
      }

      await fetchCargoRequests(vesselId);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch vessel data');
    }
  };

  const updateVesselStatus = async (newStatus) => {
    if (!selectedVessel) return;
    try {
      const response = await fetch(`http://localhost:3000/vessels/${selectedVessel.vessel_id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update vessel status');
      
      const updatedVessel = { ...selectedVessel, status: newStatus };
      setSelectedVessel(updatedVessel);
      setVessels(vessels.map(v => 
        v.vessel_id === selectedVessel.vessel_id ? updatedVessel : v
      ));
      alert(`Vessel status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating vessel status:', error);
      alert('Failed to update vessel status');
    }
  };

  const updateVoyageStatus = async (voyageId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/voyages/${voyageId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update voyage status');
      
      // Only update the state if the update was successful
      if (data.success) {
        setVoyages(voyages.map(v => 
          v.voyage_id === voyageId ? { ...v, status: newStatus } : v
        ));
        alert(`Voyage status updated to ${newStatus}`);
      } else {
        throw new Error(data.message || 'Failed to update voyage status');
      }
    } catch (error) {
      console.error('Error updating voyage status:', error);
      alert('Failed to update voyage status');
    }
  };

  const updateCargoStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/cargorequests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update cargo status');
      
      // Only update the state if the update was successful
      if (data.success) {
        setCargoRequests(cargoRequests.map(cargo => 
          cargo.request_id === requestId ? { ...cargo, status: newStatus } : cargo
        ));
        alert(`Cargo status updated to ${newStatus}`);
      } else {
        throw new Error(data.message || 'Failed to update cargo status');
      }
    } catch (error) {
      console.error('Error updating cargo status:', error);
      alert('Failed to update cargo status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS] Captain Dashboard</div>
        <button 
          onClick={handleLogout} 
          className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'
        >
          Logout
        </button>
      </div>

      {/* My Vessels Section */}
      <section className="mb-8 mt-6 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">My Vessels</h2>
        {vessels.length > 0 ? (
          <div className="space-y-4">
            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Select Vessel</label>
              <select 
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                value={selectedVessel?.vessel_id || ''}
                onChange={(e) => handleVesselSelect(Number(e.target.value))}
              >
                {vessels.map(v => (
                  <option key={v.vessel_id} value={v.vessel_id}>
                    {v.vessel_name} ({v.imo_number})
                  </option>
                ))}
              </select>
            </div>
            
            {selectedVessel && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-700/50">
                  <div>
                    <p className="text-gray-400 text-sm">Vessel Name</p>
                    <p className="font-semibold text-white">{selectedVessel.vessel_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">IMO Number</p>
                    <p className="font-semibold text-white">{selectedVessel.imo_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Capacity</p>
                    <p className="font-semibold text-white">{selectedVessel.capacity} TEU</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Current Status</p>
                    <p className={`font-semibold ${getStatusColor(selectedVessel.status)}`}>{selectedVessel.status}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowVesselModal(true)}
                    data-modal-trigger="vessel"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Update Vessel Status
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-gray-400">No vessels assigned</p>
        )}
      </section>

      {/* My Voyages Section */}
      <section className="mb-8 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">My Voyages</h2>
        {voyages.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Departure Port</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Arrival Port</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Departure Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Arrival Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-700/30'>
                {voyages.map((voyage) => (
                  <tr key={voyage.voyage_id}>
                    <td className="px-6 py-4 text-gray-300">{voyage.departure_port}</td>
                    <td className="px-6 py-4 text-gray-300">{voyage.arrival_port}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(voyage.departure_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-300">{voyage.arrival_date ? new Date(voyage.arrival_date).toLocaleDateString() : 'N/A'}</td>
                    <td className={`px-6 py-4 font-semibold ${getStatusColor(voyage.status)}`}>{voyage.status}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedVoyage(voyage);
                          setShowVoyageStatusModal(true);
                        }}
                        data-modal-trigger="voyage"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No voyages scheduled for this vessel.</p>
        )}
      </section>

      {/* Cargo Assigned Section */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Assigned Cargo (Approved)</h2>
        {loadingCargo ? (
          <p className="text-gray-400">Loading assigned cargo requests...</p>
        ) : cargoRequests.length > 0 ? (
          <div className="overflow-x-auto rounded-lg border border-gray-700/50">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Request ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Cargo Manifest</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Crates</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-700/30'>
                {cargoRequests.map((cargo) => (
                  <tr key={cargo.request_id}>
                    <td className="px-6 py-4 text-gray-300">{cargo.request_id}</td>
                    <td className="px-6 py-4 text-gray-300">{cargo.cargo_manifest}</td>
                    <td className="px-6 py-4 text-gray-300">{cargo.crates_requested}</td>
                    <td className={`px-6 py-4 font-semibold ${getStatusColor(cargo.status)}`}>{cargo.status}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedCargo(cargo);
                          setShowCargoStatusModal(true);
                        }}
                        data-modal-trigger="cargo"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400">No approved cargo requests assigned to this vessel's voyages.</p>
        )}
      </section>

      {/* Vessel Status Modal */}
      {showVesselModal && selectedVessel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">Update Vessel Status: {selectedVessel.vessel_name}</h3>
            <div className="space-y-4">
              {vesselStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateVesselStatus(status);
                    setShowVesselModal(false);
                  }}
                  className={`w-full px-4 py-2 rounded transition-colors font-medium ${
                    status === selectedVessel.status
                      ? 'bg-gray-600 text-white cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={status === selectedVessel.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowVesselModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voyage Status Modal */}
      {showVoyageStatusModal && selectedVoyage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">Update Voyage Status: {selectedVoyage.departure_port} to {selectedVoyage.arrival_port}</h3>
            <div className="space-y-4">
              {voyageStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={async () => {
                    try {
                      await updateVoyageStatus(selectedVoyage.voyage_id, status);
                      setShowVoyageStatusModal(false);
                    } catch (error) {
                      console.error('Failed to update status:', error);
                    }
                  }}
                  className={`w-full px-4 py-2 rounded transition-colors font-medium ${
                    status === selectedVoyage.status
                      ? 'bg-gray-600 text-white cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={status === selectedVoyage.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowVoyageStatusModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cargo Status Modal */}
      {showCargoStatusModal && selectedCargo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">Update Cargo Status: Request {selectedCargo.request_id}</h3>
            <div className="space-y-4">
              {cargoStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateCargoStatus(selectedCargo.request_id, status);
                    setShowCargoStatusModal(false);
                  }}
                  className={`w-full px-4 py-2 rounded transition-colors font-medium ${
                    status === selectedCargo.status
                      ? 'bg-gray-600 text-white cursor-default'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={status === selectedCargo.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowCargoStatusModal(false)}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaptainDashboard;