import React, { useState } from 'react'
import FloatingInput from './FloatingInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Dropdown from './Dropdown'
import { useNavigate } from 'react-router-dom' // for redirecting after signup

const SignUp = () => {
  const navigate = useNavigate(); // react-router hook
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const roles = ['Fleet Owner', 'Captain', 'Trader']

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Send data to backend
    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      // Helpful debug logging (will appear in browser console)
      console.log('Signup response status:', res.status, 'body:', data);

      // Consider the request successful if the status is 2xx or the backend returned a user object
      const succeeded = res.ok || data?.user || res.status === 201;

      if (succeeded) {
        alert(data?.message || 'Signup successful! Redirecting to login...');
        navigate('/login'); // redirect to login page
      } else {
        // Prefer explicit error fields from backend
        alert(data?.error || data?.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
      <FloatingInput type='text' label='Name' required autoComplete='name' value={name} onChange={e => setName(e.target.value)} />
      <FloatingInput type='email' label='Enter your email' required autoComplete='email' value={email} onChange={e => setEmail(e.target.value)} />
      <div className='relative'>
        <FloatingInput type={showPassword ? 'text' : 'password'} label='Create password' required autoComplete='new-password' value={password} onChange={e => setPassword(e.target.value)} />
        <button type='button' className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white' onClick={togglePasswordVisibility}>
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className='flex justify-between'>
        <Dropdown label='Role' options={roles} value={role} onChange={setRole} className='flex-1 mr-3' />
        <button type='submit' className='bg-[#D9D9D9] text-black font-semibold rounded-xl px-8 py-3 cursor-pointer hover:scale-105 border border-white/20 transition-colors'>
          Sign Up
        </button>
      </div>
    </form>
  )
}

export default SignUp
