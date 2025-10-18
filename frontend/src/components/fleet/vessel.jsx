import React from 'react'

const VesselDetails = () => {
  const details = {
    vesselId: '1',
    imo: 'IMO 1234567',
    name: 'ROCO ODYSSEY',
    captain: 'Diya Jojo',
    status: { label: 'At Sea', color: 'text-[#0077FF]' },
    voyageId: { label: '1 - Scheduled', color: 'text-[#2FFF00]' },
    cargo: { label: 'Loaded', color: 'text-[#00FF9D]' },
    portId: '1',
    portName: 'TVM',
  }

  return (
    <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS]</div>
        <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
      </div>

      {/* Details Card */}
      <div className='mt-10 md:mt-12 max-w-5xl mx-auto'>
        <div className='rounded-xl bg-[#2f344a]/70 border border-white/15 shadow-black/40 p-6 md:p-8 relative'>
          <div className='grid grid-cols-2 gap-6 items-start justify-start'>
            <div className="font-semibold text-gray-300">Vessel ID</div>
            <div className="text-white">{details.vesselId}</div>

            <div className="font-semibold text-gray-300">IMO</div>
            <div className="text-white">{details.imo}</div>

            <div className="font-semibold text-gray-300">Vessel Name</div>
            <div className="text-white">{details.name}</div>

            <div className="font-semibold text-gray-300">Captain</div>
            <div className="text-white">{details.captain}</div>

            <div className="font-semibold text-gray-300">Status</div>
            <div className={`font-semibold ${details.status.color}`}>{details.status.label}</div>

            <div className="font-semibold text-gray-300">Voyage</div>
            <div className={`font-semibold ${details.voyageId.color}`}>{details.voyageId.label}</div>

            <div className="font-semibold text-gray-300">Cargo</div>
            <div className={`font-semibold ${details.cargo.color}`}>{details.cargo.label}</div>

            <div className="font-semibold text-gray-300">Port ID</div>
            <div className="text-white">{details.portId}</div>

            <div className="font-semibold text-gray-300">Port Name</div>
            <div className="text-white">{details.portName}</div>
          </div>
          <div className='mt-8 flex justify-end'>
            <button className='bg-black/50 border border-white/15 text-white/90 hover:text-white rounded-xl px-5 py-2'>Edit Details</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VesselDetails


