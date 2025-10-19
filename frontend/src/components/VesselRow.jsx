import React from 'react'

const normalizeStatus = (status) => {
  if (!status) return { label: '', color: '' }
  if (typeof status === 'string') {
    const label = status
    const color = status.toLowerCase().includes('sea') ? 'text-blue-400' : status.toLowerCase().includes('port') ? 'text-amber-500' : 'text-gray-300'
    return { label, color }
  }
  return status
}

const VesselRow = ({ idx, imo, name, captain, status }) => {
  const s = normalizeStatus(status)

  return (
    <div className='flex items-center gap-3 px-4 py-3 border-b-2 border-white/50 last:border-b-0'>
      <div className='w-6 shrink-0 text-center text-gray-300'>{idx}</div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center gap-8'>
            <div className='text-gray-100 font-semibold w-24 shrink-0'>{imo}</div>
            <div className='text-gray-100 flex-1 text-center'>{name}</div>
            <div className={`font-semibold w-32 shrink-0 text-right ${s.color}`}>{s.label}</div>
          </div>
        </div>
        <div className='text-gray-300 text-sm'>CAPTAIN : {captain || 'No captain assigned yet'}</div>
      </div>
    </div>
  )
}

export default VesselRow