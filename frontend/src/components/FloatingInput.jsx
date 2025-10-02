import React from 'react'

const FloatingInput = ({ id, label, type = 'text', required = false, autoComplete, ...rest }) => {
  const inputId = id || `input-${String(label).replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className='relative'>
      <input
        id={inputId}
        type={type}
        placeholder=' '
        required={required}
        autoComplete={autoComplete}
        className='peer w-full bg-black/50 border border-white/10 text-white rounded-lg px-4 pt-6 pb-2 outline-none placeholder-transparent'
        {...rest}
      />
      <label
        htmlFor={inputId}
        className='pointer-events-none absolute left-3 text-gray-300 text-base transition-all duration-150 leading-none
          top-1/2 -translate-y-1/2 bg-transparent
          peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-white peer-focus:text-sm peer-focus:bg-black/50 peer-focus:p-2
          peer-[&:not(:placeholder-shown)]:top-0 peer-[&:not(:placeholder-shown)]:-translate-y-1/2 peer-[&:not(:placeholder-shown)]:text-sm peer-[&:not(:placeholder-shown)]:bg-black/50 peer-[&:not(:placeholder-shown)]:p-2'
      >
        {label}
      </label>
    </div>
  )
}

export default FloatingInput

