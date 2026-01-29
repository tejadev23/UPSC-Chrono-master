'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'interactive' | 'selected' | 'good' | 'warning' | 'danger'
  padding?: 'sm' | 'md' | 'lg'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', padding = 'md', children, ...props }, ref) => {
    const baseStyles = 'rounded-xl border transition-all duration-150'
    
    const variants = {
      default: 'bg-white border-gray-200 shadow-sm',
      interactive: 'bg-white border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 cursor-pointer',
      selected: 'bg-white border-accent ring-1 ring-accent shadow-sm',
      good: 'bg-pastel-mint border-green-200 text-gray-900',
      warning: 'bg-pastel-amber border-amber-200 text-gray-900',
      danger: 'bg-pastel-rose border-red-200 text-gray-900',
    }
    
    const paddings = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }
    
    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export { Card }
