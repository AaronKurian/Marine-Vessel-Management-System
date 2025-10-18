import React from 'react'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer id='footer' className='w-full mt-16 border-t border-white/10 bg-black/30'>
      <div className='max-w-6xl mx-auto px-6 md:px-8 lg:px-10 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 items-start text-white'>
        <div>
          <div className='text-2xl font-extrabold tracking-widest'>[MVMS]</div>
          <p className='text-gray-300 mt-2'>Marine Vessel Management System</p>
        </div>

        <div className='grid grid-cols-2 gap-6 sm:col-span-2 sm:justify-items-end'>
          <nav className='space-y-2 flex flex-col items-start'>
            <div className='text-white/80 font-semibold mb-1'>Navigate</div>
            <a href='/' className='text-gray-300 hover:text-white transition-colors'>Home</a>
            <a href='/#about' className='text-gray-300 hover:text-white transition-colors'>About</a>
            <a href='/#features' className='text-gray-300 hover:text-white transition-colors'>Features</a>
          </nav>
          <div className='space-y-2'>
            <div className='text-white/80 font-semibold mb-1'>Get in touch</div>
            <a href='mailto:contact@mvms.app' className='text-gray-300 hover:text-white transition-colors'>contact@mvms.app</a>
            <span className='block text-gray-400'>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
      <div className='border-t border-white/10'>
        <div className='max-w-6xl mx-auto px-6 md:px-8 lg:px-10 py-4 text-gray-400 text-sm flex flex-col sm:flex-row gap-2 items-center sm:justify-between'>
          <span>© {year} MVMS. All rights reserved.</span>
          <div className='space-x-4'>
            <a href='#' className='hover:text-white'>Privacy</a>
            <a href='#' className='hover:text-white'>Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer