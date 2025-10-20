import React, { useState } from 'react'
import { toast } from 'react-toastify'
import FloatingInput from './FloatingInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import Dropdown from './Dropdown'
import { useNavigate } from 'react-router-dom'
import API_BASE_URL from '../config/api'

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const roles = ['Fleet Owner', 'Captain', 'Trader'];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const data = await res.json();

      console.log('Signup response status:', res.status, 'body:', data);

      const succeeded = res.ok || data?.user || res.status === 201;

      if (succeeded) {
        toast.success(data?.message || 'Signup successful! Redirecting to sign in...', {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate('/signin'), 1000);
      } else {
        toast.error(data?.error || data?.message || 'Signup failed', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server', {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
      <FloatingInput 
        type='text' 
        label='Name' 
        required 
        autoComplete='name' 
        value={name} 
        onChange={e => setName(e.target.value)} 
      />
      <FloatingInput 
        type='email' 
        label='Enter your email' 
        required 
        autoComplete='email' 
        value={email} 
        onChange={e => setEmail(e.target.value)} 
      />
      <div className='relative'>
        <FloatingInput 
          type={showPassword ? 'text' : 'password'} 
          label='Create password' 
          required 
          autoComplete='new-password' 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button 
          type='button' 
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white' 
          onClick={togglePasswordVisibility}
        >
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className='flex justify-between'>
        <Dropdown 
          label='Role' 
          options={roles} 
          value={role} 
          onChange={setRole} 
          className='flex-1 mr-3' 
        />
        <button 
          type='submit' 
          disabled={isLoading}
          className='bg-[#D9D9D9] text-black font-semibold rounded-xl px-8 py-3 cursor-pointer hover:scale-105 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </div>
    </form>
  );
};

export default SignUp;
