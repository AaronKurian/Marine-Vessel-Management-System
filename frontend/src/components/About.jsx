import React from 'react'
import ship from '../assets/ship.svg'

const About = () => {

  return (
    <section id='about' className='w-full px-6 md:px-8 lg:px-10 py-16 md:py-24'>
      <div className='max-w-6xl mx-auto'>
        <h2 className='text-5xl md:text-6xl font-extrabold tracking-widest mb-6'>About</h2>
        <div className='h-0.5 w-28 bg-white/70 mb-8'></div>

        <div className='grid md:grid-cols-2 gap-8 md:gap-10 items-center'>
          <div className='relative rounded-2xl overflow-hidden p-2'>
            <img src={ship} alt='Ship sketch' className='w-full h-72 sm:h-96 md:h-[440px] object-cover opacity-80 mix-blend-screen' />
          </div>

          <div className='bg-[#2D3049]/70 border border-white/10 text-white rounded-3xl p-6 md:p-8'>
            <p className='text-lg md:text-xl leading-9 md:leading-10 text-center'>
              The Marine Vessel Management System is a centralized platform designed to simplify and modernize maritime operations. It connects fleet owners, captains, traders, port authorities, and customs officers in one place, replacing slow manual processes with efficient digital workflows.
            </p>
            <p className='text-lg md:text-xl leading-9 md:leading-10 text-center mt-8'>
              With real-time tracking, seamless communication, and automated reporting, the system improves coordination, reduces delays, and ensures compliance with international regulations — making maritime logistics smoother, smarter, and more reliable.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About