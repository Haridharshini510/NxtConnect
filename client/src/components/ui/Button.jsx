import { forwardRef } from 'react';

const getVariantClass = (variant) => {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600 shadow-sm hover:shadow-md',
    secondary: 'bg-white/90 border border-blue-100 text-slate-900 hover:bg-blue-50/60 shadow-sm hover:shadow-md',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-error-600 text-white hover:bg-error-700 shadow-sm hover:shadow-md',
    success: 'bg-success-600 text-white hover:bg-success-700 shadow-sm hover:shadow-md',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
  };
  return variants[variant] || variants.primary;
};

const getSizeClass = (size) => {
  const sizes = {
    xs: 'px-3 py-1.5 text-xs',
    sm: 'px-3.5 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-5 py-3 text-lg',
  };
  return sizes[size] || sizes.md;
};

const Button = forwardRef(
  ({ variant = 'primary', size = 'md', isLoading, children, className, ...props }, ref) => (
    <button
      ref={ref}
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-fast focus:outline-none focus:ring-2 focus:ring-offset-2 
        focus:ring-primary-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95
        ${getVariantClass(variant)} ${getSizeClass(size)}
        ${isLoading ? 'relative text-transparent' : ''}
        ${className || ''}
      `}
      {...props}
      disabled={props.disabled || isLoading}
    >
      {isLoading && (
        <div className="absolute w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
);

Button.displayName = 'Button';
export default Button;
