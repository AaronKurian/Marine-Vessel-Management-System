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
    <div className="mt-4">
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.request_id}
            className="bg-black/20 rounded-lg p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-white/10"
          >
            <div className="flex-1 grid grid-cols-[auto_auto_1fr_auto_auto_auto] gap-4">
              <div className="text-gray-300">{request.request_id}</div>
              <div className="text-gray-300">
                {request.vessels?.imo_number || '-'}
              </div>
              <div className="text-gray-300">
                {request.vessels?.vessel_name || '-'}
              </div>
              {/* <div className="text-gray-300">
                {request.departure?.port_name || '-'}
              </div>
              <div className="text-gray-300">
                {request.arrival?.port_name || '-'}
              </div> */}
              <div className={getStatusColor(request.status)}>
                {request.status}
              </div>
            </div>

            <div className="flex flex-col space-y-2 md:ml-4 w-full md:w-auto">
              <button
                onClick={() => onStatusUpdate(request.request_id, 'Approved')}
                className="px-4 py-1.5 text-sm bg-emerald-600/70 text-white rounded-full hover:bg-emerald-700/70 transition-colors border border-white/10"
              >
                Approve
              </button>
              <button
                onClick={() => onStatusUpdate(request.request_id, 'Rejected')}
                className="px-4 py-1.5 text-sm bg-red-600/60 text-white rounded-full hover:bg-red-700/60 transition-colors border border-white/10"
              >
                Reject
              </button>
            </div>
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