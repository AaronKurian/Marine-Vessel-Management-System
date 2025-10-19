import React, { useState, useEffect } from 'react';

const AddVessel = ({ onSubmit, onClose }) => {
  const [vesselData, setVesselData] = useState({
    imo_number: '',
    vessel_name: '',
    status: 'At Port',
    capacity: '',
    captain_id: ''
  });
  const [captains, setCaptains] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCaptains();
  }, []);

  const fetchCaptains = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/users/captains');
      const data = await res.json();
      if (res.ok && data.success) {
        setCaptains(data.users || []);
      }
    } catch (err) {
      console.error('Failed to fetch captains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVesselData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(vesselData);
  };

  return (
    <div className="bg-[#1f2437] rounded-lg p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Add New Vessel</h2>
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
            IMO Number
          </label>
          <input
            type="text"
            name="imo_number"
            value={vesselData.imo_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter IMO number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Vessel Name
          </label>
          <input
            type="text"
            name="vessel_name"
            value={vesselData.vessel_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter vessel name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Status
          </label>
          <select
            name="status"
            value={vesselData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="At Port">At Port</option>
            <option value="In Transit">At Sea</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Capacity (Optional)
          </label>
          <input
            type="number"
            name="capacity"
            value={vesselData.capacity}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
            placeholder="Enter vessel capacity"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Captain (Optional)
          </label>
          <select
            name="captain_id"
            value={vesselData.captain_id}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#2f344a] border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a Captain</option>
            {captains.map(captain => (
              <option key={captain.id} value={captain.id}>
                {captain.name}
              </option>
            ))}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Vessel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVessel;