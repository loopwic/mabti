import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function BrutalButton({ 
  children, 
  onClick, 
  disabled, 
  className = '',
  bgColor = 'bg-[var(--accent-4)]',
  textColor = 'text-black',
  showArrow = false
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  disabled?: boolean, 
  className?: string,
  bgColor?: string,
  textColor?: string,
  showArrow?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative inline-flex items-center justify-center px-6 py-4 border-[4px] border-black font-black uppercase text-xl tracking-wide transition-all duration-300 brutal-shadow brutal-shadow-hover brutal-shadow-active disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none ${bgColor} ${textColor} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight strokeWidth={4} className="transition-transform duration-300 group-hover:translate-x-2" size={24} />
        )}
      </span>
    </button>
  )
}

export function BrutalLink({ 
  children, 
  to, 
  search,
  className = '',
  bgColor = 'bg-[var(--accent-4)]',
  textColor = 'text-black',
  showArrow = false
}: { 
  children: React.ReactNode, 
  to: string, 
  search?: any,
  className?: string,
  bgColor?: string,
  textColor?: string,
  showArrow?: boolean
}) {
  return (
    <Link
      to={to}
      search={search}
      className={`group relative inline-flex items-center justify-center px-6 py-4 border-[4px] border-black font-black uppercase text-xl tracking-wide transition-all duration-300 brutal-shadow brutal-shadow-hover brutal-shadow-active ${bgColor} ${textColor} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight strokeWidth={4} className="transition-transform duration-300 group-hover:translate-x-2" size={24} />
        )}
      </span>
    </Link>
  )
}
