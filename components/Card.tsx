import React from 'react'

export const Card: React.FC<{ className?: string }> = ({ children, className = '' }) => {
  return (
    <div className={`rounded-lg bg-[#18181B] border border-[#27272A] p-4 ${className}`}>
      {children}
    </div>
  )
}

export default Card
