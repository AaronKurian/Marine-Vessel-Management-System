import React from 'react'

const ApproveVoyage = () => {
  const details = {
    voyage: { label: '1 - Scheduled', color: 'text-emerald-400' },
    portDeparture: 'TVM',
    portArrival: 'COK',
    dateOfDeparture: '17-10-2025',
    vesselName: 'ROCO ODYSSEY',
    vesselId: '1',
    numCrates: '1',
    cargoManifest: new Array(20).fill('List item'),
  }

  return (
    <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS]</div>
        <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
      </div>

      {/* Card */}
      <div className='mt-10 md:mt-12 max-w-5xl mx-auto'>
        <div className='rounded-xl bg-[#2f344a]/70 border border-white/15 p-6 md:p-8'>
          <div className='grid grid-cols-[160px_1fr] sm:grid-cols-[180px_1fr] gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-5 items-start w-full'>
            <div className='text-gray-300'>Voyage ID</div>
            <div className={`font-semibold ${details.voyage.color}`}>{details.voyage.label}</div>

            <div className='text-gray-300'>Port of Departure:</div>
            <div className='text-white'>{details.portDeparture}</div>

            <div className='text-gray-300'>Port of Arrival:</div>
            <div className='text-white'>{details.portArrival}</div>

            <div className='text-gray-300'>Date of Departure:</div>
            <div className='text-white'>{details.dateOfDeparture}</div>

            <div className='text-gray-300'>Vessel Name:</div>
            <div className='text-white'>{details.vesselName}</div>

            <div className='text-gray-300'>Vessel ID:</div>
            <div className='text-white'>{details.vesselId}</div>

            <div className='text-gray-300'>Number of Crates:</div>
            <div className='text-white'>{details.numCrates}</div>

            <div className='text-gray-300 self-start'>Cargo Manifest:</div>
            <div className='text-gray-300'>
              <div className='space-y-1'>
                {details.cargoManifest.map((txt, i) => (
                  <div key={i}>{txt}</div>
                ))}
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-end'>
            <button className='bg-emerald-700/90 hover:bg-emerald-600 cursor-pointer text-white rounded-xl px-5 py-2 border border-white/10'>
              Approve
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApproveVoyage


