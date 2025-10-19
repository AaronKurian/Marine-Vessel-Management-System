import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const voyageStatusOptions = ['Scheduled', 'Departed', 'In Transit', 'Delayed', 'Arrived'];
  const cargoStatusOptions = ['Picked Up', 'Delivered', 'Delayed'];
  const vesselStatusOptions = ['At Sea', 'At Port'];
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCaptainData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.modal-content')) {
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
        setCargoRequests(data.cargoRequests || []);
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
      
      {/* My Vessels Section */}
      <section className="mb-8 bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Vessel Name</p>
                    <p className="font-semibold text-white">{selectedVessel.vessel_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">IMO Number</p>
                    <p className="font-semibold text-white">{selectedVessel.imo_number}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Capacity</p>
                    <p className="font-semibold text-white">{selectedVessel.capacity} TEU</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current Status</p>
                    <p className="font-semibold text-white">{selectedVessel.status}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setShowVesselModal(true)}
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
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Departure Port</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Arrival Port</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Departure Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Arrival Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {voyages.map((voyage) => (
                  <tr key={voyage.voyage_id} className="border-t border-gray-700">
                    <td className="px-6 py-4 text-gray-300">{voyage.departure_port}</td>
                    <td className="px-6 py-4 text-gray-300">{voyage.arrival_port}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(voyage.departure_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-300">{new Date(voyage.arrival_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-300">{voyage.status}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          console.log('Setting voyage:', voyage);
                          setSelectedVoyage(voyage);
                          setShowVoyageStatusModal(true);
                        }}
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
          <p className="text-gray-400">No voyages scheduled</p>
        )}
      </section>

      {/* Cargo Assigned Section */}
      <section className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Cargo Assigned</h2>
        {loadingCargo ? (
          <p className="text-gray-400">Loading cargo requests...</p>
        ) : cargoRequests.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Cargo Manifest</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Crates Requested</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cargoRequests.map((cargo) => (
                  <tr key={cargo.request_id} className="border-t border-gray-700">
                    <td className="px-6 py-4 text-gray-300">{cargo.cargo_manifest}</td>
                    <td className="px-6 py-4 text-gray-300">{cargo.crates_requested}</td>
                    <td className="px-6 py-4 text-gray-300">{cargo.status}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedCargo(cargo);
                          setShowCargoStatusModal(true);
                        }}
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
          <p className="text-gray-400">No cargo requests assigned</p>
        )}
      </section>

      {/* Vessel Status Modal */}
      {showVesselModal && selectedVessel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full modal-content">
            <h3 className="text-xl font-semibold text-white mb-4">Update Vessel Status</h3>
            <div className="space-y-4">
              {vesselStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateVesselStatus(status);
                    setShowVesselModal(false);
                  }}
                  className={`w-full px-4 py-2 rounded transition-colors ${
                    status === selectedVessel.status
                      ? 'bg-gray-600 text-white'
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
            <h3 className="text-xl font-semibold text-white mb-4">Update Voyage Status</h3>
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
                  className={`w-full px-4 py-2 rounded transition-colors ${
                    status === selectedVoyage.status
                      ? 'bg-gray-600 text-white'
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
            <h3 className="text-xl font-semibold text-white mb-4">Update Cargo Status</h3>
            <div className="space-y-4">
              {cargoStatusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    updateCargoStatus(selectedCargo.request_id, status);
                    setShowCargoStatusModal(false);
                  }}
                  className={`w-full px-4 py-2 rounded transition-colors ${
                    status === selectedCargo.status
                      ? 'bg-gray-600 text-white'
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