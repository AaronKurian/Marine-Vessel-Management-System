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
    <div className="bg-[#0b0c1a] rounded-xl p-6 md:p-8 w-full border border-white/10 shadow-2xl scale-90">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-wide">Add New Vessel</h2>
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
            IMO Number
          </label>
          <input
            type="text"
            name="imo_number"
            value={vesselData.imo_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
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
            className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
          >
            <option value="">Select a Captain</option>
            {captains.map(captain => (
              <option key={captain.id} value={captain.id}>
                {captain.name}
              </option>
            ))}
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
            Add Vessel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVessel;