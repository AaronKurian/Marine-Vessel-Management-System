import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import SignIn from '../components/SignIn'
import SignUp from '../components/SignUp'

const Auth = () => {
  const location = useLocation()
  const isSignUp = location.pathname === '/signup'

  return (
    <div className='flex flex-col items-center justify-center max-w-screen min-h-screen overflow-scroll pb-16 bg-gradient-to-br from-zinc-950 via-[#0a0a11] to-zinc-950 text-white p-8'>
      <div className='my-4 text-center'>
        <div className='text-4xl font-extrabold tracking-widest'>[MVMS]</div>
        <div className='text-lg '>Marine Vessel</div>
        <div className='text-lg '>Management System</div>
      </div>

      <div className='w-full max-w-lg bg-black/50 border border-white/10 rounded-lg p-1 shadow-xl/30 shadow-black/40 mb-3 md:mb-6'>
        <div className='flex items-center text-lg'>
          <Link
            to="/signin"
            className={`flex-1 text-center py-1 rounded-lg transition-colors ${!isSignUp ? 'bg-zinc-900/70 text-gray-300' : 'bg-transparent text-white'}`}
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className={`flex-1 text-center py-1 rounded-lg transition-colors ${isSignUp ? 'bg-zinc-900/70 text-gray-300' : 'bg-transparent text-white'}`}
          >
            Sign Up
          </Link>
        </div>
      </div>


      <div className='w-full max-w-2xl bg-black/50 border border-white/10 rounded-lg p-1 shadow-xl/30 shadow-black/40'>
        <div className='rounded-lg'>
          {isSignUp ? <SignUp /> : <SignIn />}
        </div>
      </div>
    </div>
  )
}

export default Auth