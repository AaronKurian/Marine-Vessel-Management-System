import React from 'react'

const CargoRequests = ({ requests, onStatusUpdate }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'text-emerald-400'
      case 'pending':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-white mb-4">Cargo Requests:</h2>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={request.request_id}
            className="bg-[#1f2437] rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex-1 grid grid-cols-6 gap-4">
              <div className="text-gray-300">{request.request_id}</div>
              <div className="text-gray-300">
                {request.vessels?.imo_number || 'N/A'}
              </div>
              <div className="text-gray-300">
                {request.vessels?.vessel_name || 'N/A'}
              </div>
              <div className="text-gray-300">
                {request.departure?.port_name || 'N/A'}
              </div>
              <div className="text-gray-300">
                {request.arrival?.port_name || 'N/A'}
              </div>
              <div className={getStatusColor(request.status)}>
                {request.status}
              </div>
            </div>

            {request.status === 'Pending' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onStatusUpdate(request.request_id, 'Approved')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onStatusUpdate(request.request_id, 'Rejected')}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center text-gray-400 py-4">
            No cargo requests found
          </div>
        )}
      </div>
    </div>
  )
}

export default CargoRequests