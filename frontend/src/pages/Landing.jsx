import React from 'react'
import Navbar from '../components/Navbar'
import Intro from '../components/Intro'
import About from '../components/About'
import Features from '../components/Features'
import Footer from '../components/Footer'

const Landing = () => {
  return (
    <div className='flex flex-col items-center bg-[#07061B] text-white justify-center min-h-screen'>
      <Navbar />
      <Intro />
      <About />
      <Features />
      <Footer />
    </div>
  )
}

export default Landing