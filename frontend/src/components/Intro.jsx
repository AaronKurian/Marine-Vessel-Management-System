import React from 'react'
import video from '../assets/video.mp4'

const Intro = () => {

  return (
    <section id='intro' className='relative w-full min-h-screen overflow-hidden'>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className='absolute inset-0 w-full h-full object-cover z-0'
      >
        <source src={video} type='video/mp4' />
        Your browser does not support the video tag.
      </video>
      
      {/* Overlay for better text readability */}
      <div className='absolute inset-0 bg-black/30 z-10'></div>
      
      {/* Content */}
      <div className='relative z-20 h-full flex flex-col mt-30 items-center justify-center px-6'>
        <div className='px-8 py-12 text-center text-white w-full'>
          <div className='text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] font-extrabold tracking-widest'>Marine Vessel</div>
          <div className='text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] font-extrabold tracking-widest opacity-[0.8] blur-[1.4px] scale-y-[-1] transform-gpu -mt-1 mb-2 bg-gradient-to-b from-[#F6F6F7] to-[#7E808F] bg-clip-text text-transparent'>Marine Vessel</div>
          <div className='text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] font-extrabold tracking-widest'> Management System</div>
          <div className='text-2xl sm:text-3xl md:text-4xl lg:text-[4.5rem] font-extrabold tracking-widest opacity-[0.8] blur-[1.4px] scale-y-[-1] transform-gpu -mt-1 mb-8 bg-gradient-to-b from-[#F6F6F7] to-[#7E808F] bg-clip-text text-transparent'> Management System</div>
        </div>
      </div>
    </section>
  )
}

export default Intro