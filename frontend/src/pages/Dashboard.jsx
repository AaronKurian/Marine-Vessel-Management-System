import React from 'react'
import { FaPlus } from 'react-icons/fa'
const vessels = [
  { id: 1, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 2, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Port', color: 'text-amber-500' } },
  { id: 3, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 4, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 5, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 1, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 2, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Port', color: 'text-amber-500' } },
  { id: 3, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 4, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 1, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 2, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Port', color: 'text-amber-500' } },
  { id: 3, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  { id: 4, imo: 'IMO 6942096', name: 'ECO LEVANT', captain: 'Aaron Kurian', status: { label: 'At Sea', color: 'text-blue-400' } },
  
]

const voyages = [
  { id: 1, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  { id: 2, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'In Transit', color: 'text-emerald-400' } },
  { id: 3, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Arrived', color: 'text-emerald-400' } },
  { id: 4, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  { id: 5, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  { id: 6, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'In Transit', color: 'text-emerald-400' } },
  { id: 7, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Arrived', color: 'text-emerald-400' } },
  { id: 8, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  { id: 1, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
  { id: 2, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'In Transit', color: 'text-emerald-400' } },
  { id: 3, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Arrived', color: 'text-emerald-400' } },
  { id: 4, from: 'COK', to: 'JED', imo: 'IMO 6942096', status: { label: 'Not Departed', color: 'text-red-400' } },
]

const cargoRequests = [
  { id: 1, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Pending' },
  { id: 2, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 3, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 4, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 5, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 1, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Pending' },
  { id: 2, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 3, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 4, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
  { id: 5, imo: 'IMO 6942096', vessel: 'ECO LEVANT', from: 'COK', to: 'JED', status: 'Approved' },
]

const VesselRow = ({ idx, imo, name, captain, status }) => {
  return (
    <div className='flex items-center gap-3 px-4 py-3 border-b-2 border-white/50 last:border-b-0'>
      <div className='w-6 shrink-0 text-center text-gray-300'>{idx}</div>
      <div className='flex-1'>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between gap-8'>
            <div className='text-gray-100 font-semibold'>{imo}</div>
            <div className='text-gray-100 flex-1 text-center'>{name}</div>
            <div className={`font-semibold ${status.color}`}>{status.label}</div>
          </div>
        </div>
        <div className='text-gray-300 text-sm'>Capt.: {captain}</div>
      </div>
    </div>
  )
}

const VoyageCard = ({ idx, from, to, imo, status }) => {
  return (
    <div className='border-b-2 border-white/50 px-3 py-2 last:border-none'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3 w-full'>
          <div className='shrink-0 text-right text-gray-200'>{idx}</div>
          <div className="flex flex-col w-full px-0">
            <div className="flex flex-row items-center w-full px-0">
              <div className="flex flex-row items-center flex-1 justify-between gap-2 text-left px-4 py-0">
                <div className="font-semibold text-gray-100">{from}</div>
                <div className="mx-2 opacity-60 w-6 h-px bg-white" />
                <div className="font-semibold text-gray-100">{to}</div>
              </div>
            </div>
            <div className="flex flex-row items-center w-full px-0 mt-1">
              <div className="flex flex-row items-center flex-1 justify-between gap-2 px-4">
                <div className="text-sm text-gray-300">{imo}</div>
                <div className={`text-xs font-semibold ${status.color}`}>{status.label}</div>
              </div>
            </div>
          </div>
    </div>
  </div>
  </div>
  )
}

const CargoRow = ({ id, imo, vessel, from, to, status }) => {
  const statusColor = status === 'Approved' ? 'text-[#2FFF00]' : 'text-red-500'
  return (
    <div className='flex items-center gap-4 px-4 py-4 border-b border-white/10 last:border-b-0'>
      <div className='w-8 shrink-0 text-center text-gray-200'>{id}</div>
      <div className='w-44 md:w-56 font-semibold tracking-wide'>{imo}</div>
      <div className='w-56 md:w-72 font-semibold'>{vessel}</div>
      <div className='w-16 text-center'>{from}</div>
      <div className='mx-2 opacity-60 w-6 h-px bg-white'/>
      <div className='w-16 text-center'>{to}</div>
      <div className='flex-1' />
      <div className={`font-semibold text-center ${statusColor}`}>{status}</div>
    </div>
  )
}

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-[#0b0c1a] text-white px-5 md:px-8 py-5 md:py-8'>
      <div className='flex items-center justify-between'>
        <div className='text-2xl md:text-3xl font-extrabold tracking-widest'>[MVMS]</div>
        <button className='bg-[#1E1E1E] border border-white/10 text-red-500/80 hover:text-red-600 cursor-pointer rounded-full px-6 py-1'>Logout</button>
      </div>

      <div className='mt-6 flex flex-col gap-6 pt-5'>
        <div className='flex flex-col lg:flex-row gap-6 items-start mb-8'>
          {/* Vessels */}
          <div className='flex-[2] w-full'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Vessels:</h2>
              <button className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold rounded-full px-5 py-1 border border-white/10'>
                Add Vessel <FaPlus className='inline-block ml-1' />
              </button>
            </div>
            <div className='rounded-md overflow-hidden border border-white/15 bg-[#2f344a]/70 max-h-[500px] overflow-y-auto'>
              {vessels.map((v, i) => (
                <VesselRow key={`${v.id}-${i}`} idx={i + 1} {...v} />
              ))}
            </div>
          </div>

          {/* Voyages */}
          <div className='flex-[1] w-full lg:max-w-sm'>
            <div className='flex items-center justify-between mb-4'>
              <h2 className='text-xl md:text-2xl font-semibold tracking-wide'>Voyages:</h2>
              <button className='cursor-pointer text-sm bg-emerald-700/80 hover:bg-emerald-600 text-white rounded-full px-3 py-1 border border-white/10'>
                Schedule
              </button>
            </div>
            <div className='rounded-md border border-white/15 bg-[#2f344a]/70 flex flex-col gap-2 max-h-[500px] overflow-y-auto'>
              {voyages.map((v, i) => (
                <VoyageCard key={`${v.id}-${i}`} idx={i + 1} {...v} />
              ))}
            </div>
          </div>
        </div>

        {/* Cargo */}
        <div className='w-full'>
          <h2 className='text-xl md:text-2xl font-semibold tracking-wide mb-4'>Cargo Requests:</h2>
          <div className='rounded-md border border-white/15 bg-[#2f344a]/70 max-h-[500px] overflow-y-auto'>
            {cargoRequests.map((r) => (
              <CargoRow key={r.id} {...r} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard