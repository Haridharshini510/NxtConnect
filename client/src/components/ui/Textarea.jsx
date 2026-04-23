import { forwardRef } from 'react';

const Textarea = forwardRef(({ label, error, helper, rows = 4, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-900 mb-2">{label}</label>}
    <textarea
      ref={ref}
      rows={rows}
      className={`
        w-full px-3.5 py-2.5 text-sm rounded-lg border transition-fast
        bg-white text-slate-900 placeholder-slate-400 resize-none
        border-slate-300 hover:border-slate-400
        focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2
        disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
        ${error ? 'border-error-300 ring-1 ring-error-100' : ''}
      `}
      {...props}
    />
    {error && <p className="text-xs text-error-600 mt-1.5 font-medium">{error}</p>}
    {helper && !error && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
  </div>
));

Textarea.displayName = 'Textarea';
export default Textarea;
