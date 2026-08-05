import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', loading, children, ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium'
  const sizes: Record<string,string> = { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4 text-base', lg: 'h-12 px-5 text-lg' }
  const variants: Record<string,string> = {
    primary: 'bg-[#2563EB] text-white hover:brightness-105',
    secondary: 'bg-transparent border border-[#27272A] text-[#FAFAFA]',
    ghost: 'bg-transparent text-[#FAFAFA]',
    danger: 'bg-[#EF4444] text-white'
  }

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]}`} disabled={rest.disabled || loading} {...rest}>
      {loading ? 'Loading...' : children}
    </button>
  )
}

export default Button
