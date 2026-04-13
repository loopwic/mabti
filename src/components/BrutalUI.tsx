import React, { type CSSProperties } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'

export function BrutalButton({ 
  children, 
  onClick, 
  disabled, 
  className = '',
  bgColor = 'bg-[var(--accent-4)]',
  textColor = 'text-black',
  showArrow = false,
  style
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  disabled?: boolean, 
  className?: string,
  bgColor?: string,
  textColor?: string,
  showArrow?: boolean,
  style?: CSSProperties
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`group relative inline-flex min-h-14 items-center justify-center px-4 py-3 text-base tracking-[0.14em] sm:min-h-16 sm:px-6 sm:py-4 sm:text-xl sm:tracking-wide border-[4px] border-black font-black uppercase transition-all duration-300 brutal-shadow brutal-shadow-hover brutal-shadow-active disabled:opacity-50 disabled:pointer-events-none disabled:transform-none disabled:shadow-none ${bgColor} ${textColor} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight strokeWidth={4} className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2 sm:h-6 sm:w-6" />
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
  showArrow = false,
  style
}: { 
  children: React.ReactNode, 
  to: string, 
  search?: any,
  className?: string,
  bgColor?: string,
  textColor?: string,
  showArrow?: boolean,
  style?: CSSProperties
}) {
  return (
    <Link
      to={to}
      search={search}
      style={style}
      className={`group relative inline-flex min-h-14 items-center justify-center px-4 py-3 text-base tracking-[0.14em] sm:min-h-16 sm:px-6 sm:py-4 sm:text-xl sm:tracking-wide border-[4px] border-black font-black uppercase transition-all duration-300 brutal-shadow brutal-shadow-hover brutal-shadow-active ${bgColor} ${textColor} ${className}`}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
        {showArrow && (
          <ArrowRight strokeWidth={4} className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-2 sm:h-6 sm:w-6" />
        )}
      </span>
    </Link>
  )
}
