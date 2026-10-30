import React from 'react';

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary', // 'primary', 'secondary', 'danger', 'success', 'yellow', 'dark'
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseClasses =
    'relative inline-flex items-center justify-center font-bold tracking-wide transition-all select-none rounded-brutal border-2 border-vyapar-navy active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs shadow-brutal-sm active:shadow-none',
    md: 'px-4 py-2.5 text-sm shadow-brutal active:shadow-none',
    lg: 'px-6 py-3.5 text-base shadow-brutal-lg active:shadow-none',
  };

  const variantClasses = {
    primary: 'bg-vyapar-blue text-vyapar-navy hover:bg-vyapar-skyblue',
    secondary: 'bg-white text-vyapar-navy hover:bg-vyapar-softgrey',
    yellow: 'bg-vyapar-yellow text-vyapar-navy hover:bg-amber-300',
    success: 'bg-vyapar-green text-vyapar-navy hover:bg-emerald-300',
    danger: 'bg-vyapar-red text-vyapar-navy hover:bg-rose-300',
    dark: 'bg-vyapar-navy text-white hover:bg-slate-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}
