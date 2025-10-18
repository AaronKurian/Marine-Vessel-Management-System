import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const Auth = () => {
  const location = useLocation()
  const isSignUp = location.pathname === '/signup'

  return (
    <div className='flex flex-col items-center justify-center max-w-screen min-h-screen overflow-scroll pb-16 bg-[#07061B] text-white p-8'>
      <div className='my-4 text-center'>
        <div className='text-4xl font-extrabold tracking-widest'>[MVMS]</div>
        <div className='text-lg '>Marine Vessel</div>
        <div className='text-lg '>Management System</div>
      </div>

      <div className='w-full max-w-lg bg-zinc-900cdcd border border-white/20 rounded-lg p-1 shadow-xl/30 shadow-black/40 mb-3 md:mb-6'>
        <div className='relative grid grid-cols-2 text-lg'>
          
          <div
            className={`absolute top-0 left-0 h-full w-1/2 rounded-md border border-white/10 bg-black/40 transition-transform duration-300 ease-out ${
              isSignUp ? 'translate-x-full' : 'translate-x-0'
            }`}
          />

          {/* Fixed route from /signin to /signin */}
          <Link to="/signin" className='relative z-10 text-center py-1 rounded-lg'>
            <span className={`${!isSignUp ? 'text-white' : 'text-gray-300'} transition-colors`}>Sign In</span>
          </Link>
          <Link to="/signup" className='relative z-10 text-center py-1 rounded-lg'>
            <span className={`${isSignUp ? 'text-white' : 'text-gray-300'} transition-colors`}>Sign Up</span>
          </Link>
        </div>
      </div>

      <div className='w-full max-w-2xl bg-black/30 border border-white/20 rounded-lg p-1 shadow-xl/30 shadow-black/40'>
        <div className='rounded-lg'>
          {isSignUp ? <SignUp /> : <SignIn />}
        </div>
      </div>
    </div>
  )
}

export default Auth

