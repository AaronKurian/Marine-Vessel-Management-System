import React from 'react'

const Intro = () => {

  return (
    <section id='intro' className='relative w-full min-h-screen mt-12'>
      <div className='h-full flex flex-col mt-40 items-center justify-center px-6'>
        <div className='bg-[#2D3049]/70 border mt-8 border-white/10 rounded-2xl px-8 py-12 text-center text-white max-w-xl w-full'>
          <div className='text-5xl font-extrabold tracking-widest mb-3'>[MVMS]</div>
          <div className='text-xl md:text-2xl'>Landing page</div>
        </div>
      </div>
    </section>
  )
}

export default Intro