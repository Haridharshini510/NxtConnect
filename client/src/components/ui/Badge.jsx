const Badge = ({ variant = 'default', size = 'md', children, icon: Icon, ...props }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    primary: 'bg-primary-100 text-primary-700 border-primary-200',
    success: 'bg-success-100 text-success-700 border-success-200',
    warning: 'bg-warning-100 text-warning-700 border-warning-200',
    error: 'bg-error-100 text-error-700 border-error-200',
    info: 'bg-info-100 text-info-700 border-info-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs font-medium gap-1',
    md: 'px-2.5 py-1 text-sm font-medium gap-1.5',
    lg: 'px-3 py-1.5 text-base font-medium gap-2',
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border
        ${variants[variant]} ${sizes[size]}
      `}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 12 : 16} />}
      {children}
    </span>
  );
};

export default Badge;
