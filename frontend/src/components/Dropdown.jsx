import React, { useEffect, useRef, useState } from 'react'

const Dropdown = ({ id, label, options = [], value, onChange, placeholder = 'Select an option' }) => {
  const containerRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)

  const hasValue = value !== undefined && value !== null && String(value).length > 0
  const inputId = id || `dropdown-${String(label).replace(/\s+/g, '-').toLowerCase()}`

  useEffect(() => {
    const onDocClick = (e) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target)) setIsOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  return (
    <div ref={containerRef} className='relative'>
      <button
        id={inputId}
        type='button'
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className='peer relative w-full bg-black/50 border border-white/10 text-white rounded-lg px-4 pt-6 pb-2 text-left outline-none'
      >
        {hasValue ? (
          <span>{value}</span>
        ) : (
          <span className='opacity-0'>{placeholder}</span>
        )}
        <svg
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'
        >
          <path fillRule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z' clipRule='evenodd' />
        </svg>
      </button>

      <label
        htmlFor={inputId}
        className={`pointer-events-none absolute left-3 text-gray-300 text-base transition-all duration-150 leading-none ${
          hasValue || isOpen
            ? 'top-0 -translate-y-1/2 text-sm bg-black/50 px-1 rounded-lg'
            : 'top-1/2 -translate-y-1/2'
        }`}
      >
        {label}
      </label>

      {isOpen && (
        <div
          role='listbox'
          className='absolute z-10 mt-2 max-h-56 top-full left-0 w-full px-1 bg-black/60 border border-white/10 backdrop-blur-sm text-white rounded-lg outline-none'
        >
          {options.map((option) => (
            <button
              type='button'
              role='option'
              aria-selected={option === value}
              key={String(option)}
              onClick={() => {
                onChange && onChange(option)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 hover:bg-white/5 my-1 rounded-lg gap-2 ${
                option === value ? 'bg-white/5 border border-white/5' : ''
              }`}
            >
              {String(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Dropdown