import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
  const [vesselsData, setVesselsData] = useState([]); // Array of { vessel, voyages, cargo }
  const [loading, setLoading] = useState(true);
  
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

  const fetchCaptainData = async () => {
    try {
      const userString = sessionStorage.getItem('user');
      if (!userString) {
        navigate('/signin');
        return;
      }
      const user = JSON.parse(userString);

      // Fetch all vessels for this captain
      const vesselsRes = await fetch(`http://localhost:3000/vessels/captain/${user.id}`);
      if (!vesselsRes.ok) throw new Error('Failed to fetch vessels data');
      const vesselsResponse = await vesselsRes.json();
      
      if (vesselsResponse && vesselsResponse.vessels) {
        // For each vessel, fetch its voyages and cargo
        const vesselDataPromises = vesselsResponse.vessels.map(async (vessel) => {
          try {
            // Fetch voyages for this vessel
            const voyagesRes = await fetch(`http://localhost:3000/voyages/vessel/${vessel.vessel_id}`);
            const voyagesData = await voyagesRes.json();
            const voyages = voyagesData.success ? voyagesData.voyages || [] : [];

            // Fetch cargo for this vessel
            const cargoRes = await fetch(`http://localhost:3000/cargorequests/vessel/${vessel.vessel_id}`);
            const cargoData = await cargoRes.json();
            const cargo = cargoData.success 
              ? (cargoData.cargoRequests || []).filter(c => c.status !== 'Pending' && c.status !== 'Rejected')
              : [];

            return {
              vessel,
              voyages,
              cargo
            };
          } catch (error) {
            console.error(`Error fetching data for vessel ${vessel.vessel_id}:`, error);
            return {
              vessel,
              voyages: [],
              cargo: []
            };
          }
        });

        const allVesselsData = await Promise.all(vesselDataPromises);
        setVesselsData(allVesselsData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching captain data:', error);
      setLoading(false);
    }
  };

  const updateVesselStatus = async (newStatus, vesselId) => {
    try {
      const response = await fetch(`http://localhost:3000/vessels/${vesselId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update vessel status');
      
      // Update the vessel status in vesselsData
      setVesselsData(vesselsData.map(vd => 
        vd.vessel.vessel_id === vesselId 
          ? { ...vd, vessel: { ...vd.vessel, status: newStatus } }
          : vd
      ));
      toast.success(`Vessel status updated to ${newStatus}`, {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error('Error updating vessel status:', error);
      toast.error('Failed to update vessel status', {
        position: "top-right",
        autoClose: 3000,
      });
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
        // Update voyage status across all vessels
        setVesselsData(vesselsData.map(vd => ({
          ...vd,
          voyages: vd.voyages.map(v => 
            v.voyage_id === voyageId ? { ...v, status: newStatus } : v
          )
        })));
        toast.success(`Voyage status updated to ${newStatus}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.message || 'Failed to update voyage status');
      }
    } catch (error) {
      console.error('Error updating voyage status:', error);
      toast.error('Failed to update voyage status', {
        position: "top-right",
        autoClose: 3000,
      });
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
        // Update cargo status across all vessels
        setVesselsData(vesselsData.map(vd => ({
          ...vd,
          cargo: vd.cargo.map(c => 
            c.request_id === requestId ? { ...c, status: newStatus } : c
          )
        })));
        toast.success(`Cargo status updated to ${newStatus}`, {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        throw new Error(data.message || 'Failed to update cargo status');
      }
    } catch (error) {
      console.error('Error updating cargo status:', error);
      toast.error('Failed to update cargo status', {
        position: "top-right",
        autoClose: 3000,
      });
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
    <div className="min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8">
      
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest bg-gradient-to-b from-white to-gray-500 text-transparent bg-clip-text'>Captain</div>
        <button 
          onClick={handleLogout} 
          className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'
        >
          Logout
        </button>
      </div>

      {/* Vessels with Voyages and Cargo */}
      {vesselsData.length > 0 ? (
        <div className="space-y-6 mt-6">
          {vesselsData
            .sort((a, b) => {
              // Calculate priority: vessels with voyages or cargo come first
              const aPriority = (a.voyages.length > 0 ? 1 : 0) + (a.cargo.length > 0 ? 1 : 0);
              const bPriority = (b.voyages.length > 0 ? 1 : 0) + (b.cargo.length > 0 ? 1 : 0);
              return bPriority - aPriority; // Higher priority first
            })
            .map((vesselData) => (
            <div key={vesselData.vessel.vessel_id} className="rounded-md border border-white/15 bg-[#2f344a]/70 p-6">
              {/* Vessel Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold tracking-wide">{vesselData.vessel.vessel_name}</h2>
                  <p className="text-gray-400 text-sm">IMO: {vesselData.vessel.imo_number}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Status</p>
                    <p className={`font-semibold ${getStatusColor(vesselData.vessel.status)}`}>{vesselData.vessel.status}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedVessel(vesselData.vessel);
                      setShowVesselModal(true);
                    }}
                    data-modal-trigger="vessel"
                    className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-4 py-2 text-sm rounded-full border border-white/10 transition-colors"
                  >
                    Update Status
                  </button>
                </div>
              </div>

              {/* Voyages for this vessel */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Voyages</h3>
                {vesselData.voyages.length > 0 ? (
                  <div className="overflow-x-auto rounded-md border border-white/10 bg-black/20">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr className="bg-black/30">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Departure Port</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Arrival Port</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Departure Date</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Status</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-white/10'>
                        {vesselData.voyages.map((voyage) => (
                          <tr key={voyage.voyage_id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300">{voyage.departure_port}</td>
                            <td className="px-4 py-3 text-gray-300">{voyage.arrival_port}</td>
                            <td className="px-4 py-3 text-gray-300">{new Date(voyage.departure_date).toLocaleDateString()}</td>
                            <td className={`px-4 py-3 font-semibold ${getStatusColor(voyage.status)}`}>{voyage.status}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedVoyage(voyage);
                                  setShowVoyageStatusModal(true);
                                }}
                                data-modal-trigger="voyage"
                                className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-3 py-1 text-sm rounded-full border border-white/10 transition-colors"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No voyages scheduled.</p>
                )}
              </div>

              {/* Cargo for this vessel */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Assigned Cargo</h3>
                {vesselData.cargo.length > 0 ? (
                  <div className="overflow-x-auto rounded-md border border-white/10 bg-black/20">
                    <table className="min-w-full divide-y divide-white/10">
                      <thead>
                        <tr className="bg-black/30">
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Request ID</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Cargo Manifest</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Crates</th>
                          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Status</th>
                          <th className="px-4 py-2 text-right text-sm font-semibold text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-white/10'>
                        {vesselData.cargo.map((cargo) => (
                          <tr key={cargo.request_id} className="hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 text-gray-300">{cargo.request_id}</td>
                            <td className="px-4 py-3 text-gray-300">{cargo.cargo_manifest}</td>
                            <td className="px-4 py-3 text-gray-300">{cargo.crates_requested}</td>
                            <td className={`px-4 py-3 font-semibold ${getStatusColor(cargo.status)}`}>{cargo.status}</td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedCargo(cargo);
                                  setShowCargoStatusModal(true);
                                }}
                                data-modal-trigger="cargo"
                                className="bg-emerald-700/80 hover:bg-emerald-600 text-white px-3 py-1 text-sm rounded-full border border-white/10 transition-colors"
                              >
                                Update
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">No cargo assigned.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 p-6 rounded-md border border-white/15 bg-[#2f344a]/70">
          <p className="text-gray-400 text-center">No vessels assigned</p>
        </div>
      )}

      {/* Vessel Status Modal */}
      {showVesselModal && selectedVessel && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0c1a] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Update Vessel Status</h3>
              <button
                onClick={() => setShowVesselModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-gray-300 mb-6">{selectedVessel.vessel_name}</p>
            <div className="space-y-3">
              {vesselStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateVesselStatus(status, selectedVessel.vessel_id);
                    setShowVesselModal(false);
                  }}
                  className={`w-full px-5 py-2.5 rounded-full transition-colors font-medium ${
                    status === selectedVessel.status
                      ? 'bg-white/10 text-gray-400 cursor-default border border-white/10'
                      : 'bg-emerald-700/80 text-white hover:bg-emerald-600 border border-white/10'
                  }`}
                  disabled={status === selectedVessel.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowVesselModal(false)}
                className="w-full bg-red-600/60 text-white px-5 py-2.5 rounded-full hover:bg-red-700/60 transition-colors border border-white/10 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Voyage Status Modal */}
      {showVoyageStatusModal && selectedVoyage && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0c1a] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Update Voyage Status</h3>
              <button
                onClick={() => setShowVoyageStatusModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-gray-300 mb-6">{selectedVoyage.departure_port} to {selectedVoyage.arrival_port}</p>
            <div className="space-y-3">
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
                  className={`w-full px-5 py-2.5 rounded-full transition-colors font-medium ${
                    status === selectedVoyage.status
                      ? 'bg-white/10 text-gray-400 cursor-default border border-white/10'
                      : 'bg-emerald-700/80 text-white hover:bg-emerald-600 border border-white/10'
                  }`}
                  disabled={status === selectedVoyage.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowVoyageStatusModal(false)}
                className="w-full bg-red-600/60 text-white px-5 py-2.5 rounded-full hover:bg-red-700/60 transition-colors border border-white/10 mt-4"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cargo Status Modal */}
      {showCargoStatusModal && selectedCargo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b0c1a] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full modal-content">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Update Cargo Status</h3>
              <button
                onClick={() => setShowCargoStatusModal(false)}
                className="text-gray-400 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-gray-300 mb-6">Request {selectedCargo.request_id}</p>
            <div className="space-y-3">
              {cargoStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateCargoStatus(selectedCargo.request_id, status);
                    setShowCargoStatusModal(false);
                  }}
                  className={`w-full px-5 py-2.5 rounded-full transition-colors font-medium ${
                    status === selectedCargo.status
                      ? 'bg-white/10 text-gray-400 cursor-default border border-white/10'
                      : 'bg-emerald-700/80 text-white hover:bg-emerald-600 border border-white/10'
                  }`}
                  disabled={status === selectedCargo.status}
                >
                  {status}
                </button>
              ))}
              <button
                onClick={() => setShowCargoStatusModal(false)}
                className="w-full bg-red-600/60 text-white px-5 py-2.5 rounded-full hover:bg-red-700/60 transition-colors border border-white/10 mt-4"
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