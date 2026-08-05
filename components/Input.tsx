import React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = ({ className = '', ...rest }) => {
  return (
    <input
      className={`w-full rounded-md bg-[#18181B] border border-[#27272A] text-[#FAFAFA] px-3 py-2 placeholder:text-[#A1A1AA] ${className}`}
      {...rest}
    />
  )
}

export default Input
