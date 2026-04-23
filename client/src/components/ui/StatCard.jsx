const StatCard = ({
  label,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  trend,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
          {description && <p className="text-xs text-slate-500 mt-2">{description}</p>}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
            <Icon size={24} className="text-primary-600" />
          </div>
        )}
      </div>
      {change && (
        <div className={`
          mt-4 pt-4 border-t border-slate-200
          text-sm font-medium
          ${changeType === 'positive' ? 'text-success-600' : 'text-error-600'}
        `}>
          {trend && <span className="mr-1">{trend}</span>}
          {change}
        </div>
      )}
    </div>
  );
};

export default StatCard;
