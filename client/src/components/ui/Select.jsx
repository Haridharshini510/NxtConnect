import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({ label, error, helper, options = [], ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-lg border transition-fast appearance-none
          bg-white text-slate-900
          border-slate-300 hover:border-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-error-300 ring-1 ring-error-100' : ''}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-3 text-slate-400 pointer-events-none" size={18} />
    </div>
    {error && <p className="text-xs text-error-600 mt-1.5 font-medium">{error}</p>}
    {helper && !error && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
  </div>
));

Select.displayName = 'Select';
export default Select;
