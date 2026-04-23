import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, helper, icon: Icon, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-2.5 text-slate-400" size={18} />}
      <input
        ref={ref}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-lg border transition-fast
          bg-white text-slate-900 placeholder-slate-400
          border-slate-300 hover:border-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${Icon ? 'pl-10' : ''}
          ${error ? 'border-error-300 ring-1 ring-error-100' : ''}
        `}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-error-600 mt-1.5 font-medium">{error}</p>}
    {helper && !error && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
  </div>
));

Input.displayName = 'Input';
export default Input;
