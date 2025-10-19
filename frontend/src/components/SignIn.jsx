import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingInput from './FloatingInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      console.log('Login response status:', res.status, 'body:', data);

      if (res.ok && data.success) {
        // Verify password matches (basic check - in production use hashed passwords)
        if (data.user.password === password) {
          alert(`Welcome back, ${data.user.name}!`);


          // Store user data in sessionStorage for use across the app
          // normalize id field if backend returned user_id
          const userObj = {
            id: data.user.user_id ,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role
          };
          sessionStorage.setItem('user', JSON.stringify(userObj));

          // Redirect based on role
          const roleKey = String(data.user.role || '').toLowerCase();
          if (roleKey.includes('fleet')) {
            navigate('/dashboard/fleetowner');
          } else if (roleKey.includes('captain')) {
            navigate('/dashboard/captain');
          } else if (roleKey.includes('trader')) {
            navigate('/dashboard/trader');
          } else {
            // Fallback
            navigate('/dashboard');
          }
        } else {
          alert('Incorrect password. Please try again.');
        }
      } else {
        alert(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Error connecting to server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='p-6 md:p-8 space-y-6'>
      <FloatingInput 
        type='email' 
        label='Enter your email' 
        required 
        autoComplete='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className='relative'>
        <FloatingInput 
          type={showPassword ? 'text' : 'password'} 
          label='Password' 
          required 
          autoComplete='current-password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button 
          type='button' 
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-white' 
          onClick={togglePasswordVisibility}
        >
          {!showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>

      <div className='flex justify-end pt-2'>
        <button 
          type='submit' 
          disabled={isLoading}
          className='bg-[#D9D9D9] text-black font-semibold rounded-xl px-8 py-3 cursor-pointer hover:scale-105 border border-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </div>
    </form>
  );
};

export default SignIn;

