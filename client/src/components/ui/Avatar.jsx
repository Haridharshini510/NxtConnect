const Avatar = ({ src, initials, size = 'md', status, alt = 'Avatar' }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl',
  };

  const statusClasses = {
    online: 'bg-success-500',
    away: 'bg-warning-500',
    offline: 'bg-slate-400',
  };

  return (
    <div className="relative inline-block">
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`
            ${sizes[size]} rounded-full object-cover
            ring-2 ring-white border border-slate-200
          `}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} rounded-full
            bg-primary-100 text-primary-700 font-semibold
            flex items-center justify-center ring-2 ring-white border border-slate-200
          `}
        >
          {initials || '?'}
        </div>
      )}
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white
            ${statusClasses[status] || statusClasses.offline}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;
