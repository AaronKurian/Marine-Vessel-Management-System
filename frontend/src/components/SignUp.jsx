import React, { useState } from 'react'
import FloatingInput from './FloatingInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Dropdown from './Dropdown'


const SignUp = () => {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const roles = ['Admin', 'Manager', 'Crew']
  const [role, setRole] = useState('')

  return (
    <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
      <FloatingInput type='text' label='Full name' required autoComplete='name' />
      <FloatingInput type='email' label='Enter your email' required autoComplete='email' />
      <div className='relative'>
        <FloatingInput type={showPassword ? 'text' : 'password'} label='Create password' required autoComplete='new-password' />
        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white' onClick={togglePasswordVisibility}>
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <Dropdown label='Role' options={roles} value={role} onChange={setRole} />

      <div className='flex justify-end pt-2'>
        <button type='submit' className='bg-black text-white/70 font-semibold rounded-xl px-8 py-3 hover:text-white/90 border border-white/10 transition-colors'>
          Sign Up
        </button>
      </div>
    </form>
  )
}

export default SignUp