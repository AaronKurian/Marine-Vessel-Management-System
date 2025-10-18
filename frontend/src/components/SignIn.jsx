import React, { useState } from 'react'
import FloatingInput from './FloatingInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const SignIn = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
      <FloatingInput type='email' label='Enter your email' required autoComplete='email' />
      <div className='relative'>
        <FloatingInput type={showPassword ? 'text' : 'password'} label='Password' required autoComplete='current-password' />
        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white' onClick={togglePasswordVisibility}>
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className='flex justify-end pt-2'>
        <button type='submit' className='bg-[#D9D9D9] text-black font-semibold rounded-xl px-8 py-3 cursor-pointer hover:scale-105 border border-white/10 transition-colors'>
          Sign In
        </button>
      </div>
    </form>
  )
}

export default SignIn