import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button