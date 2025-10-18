import React from 'react'

const IconAnchor = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 2v5m0 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 5v6m0 0c-4.418 0-8-3.582-8-8m8 8c4.418 0 8-3.582 8-8"/>
  </svg>
)

const IconMap = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M8 3 3.5 5v16L8 19l8 3 4.5-2V4L16 5 8 3Zm0 0v16m8-14v16"/>
  </svg>
)

const IconBox = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 3 3 8l9 5 9-5-9-5Zm-9 5v8l9 5m9-13v8l-9 5"/>
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-6.5 7-11.5A7 7 0 1 0 5 9.5C5 14.5 12 21 12 21Zm0-9a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
  </svg>
)

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-white">
    <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M4 4h7v7H4V4Zm9 0h7v7h-7V4ZM4 13h7v7H4v-7Zm9 0h7v7h-7v-7Z"/>
  </svg>
)

const cards = [
  {
    title: 'Vessel Management',
    body: 'Register and monitor vessels with real-time status.',
    Icon: IconAnchor,
  },
  {
    title: 'Voyage Scheduling',
    body: 'Plan routes, set departures, and track arrivals',
    Icon: IconMap,
  },
  {
    title: 'Cargo Tracking',
    body: 'Assign, monitor, and update cargo details instantly',
    Icon: IconBox,
  },
  {
    title: 'Port Operations',
    body: 'Manage arrivals, departures, and dock activity smoothly',
    Icon: IconPin,
  },
  {
    title: 'Role-Based Dashboards',
    body: 'Tailored views for owners, captains and traders',
    Icon: IconGrid,
  },
]

const Features = () => {
  return (
    <section id='features' className='w-full px-6 md:px-8 lg:px-10 py-16 md:py-24 bg-transparent'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-10 md:mb-14'>
          <h2 className='text-4xl md:text-5xl font-extrabold tracking-widest'>Features</h2>
          <div className='mt-2 h-0.5 w-28 bg-white/70'></div>
        </div>

        <div className='flex flex-wrap items-start justify-center -mx-3 md:-mx-4'>
          {cards.map(({ title, body, Icon }) => (
            <div
              key={title}
              className='w-full sm:w-1/2 lg:w-1/3 px-3 md:px-4 mb-6 md:mb-8 flex'
            >
              <div className='bg-[#2D3049]/70 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center text-center w-full gap-3 md:gap-4'>
                <div className='w-12 h-12 md:w-14 md:h-14 rounded-xl bg-black/40 border border-white/10 grid place-items-center'>
                  <Icon />
                </div>
                <h3 className='text-xl md:text-2xl font-semibold tracking-wide'>{title}</h3>
                <p className='text-gray-300 text-sm md:text-base leading-relaxed max-w-xs'>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features