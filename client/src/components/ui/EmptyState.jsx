import { FileText, Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'Start by creating your first item',
  action,
  illustration,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      {illustration ? (
        <div className="mb-6 w-24 h-24">{illustration}</div>
      ) : (
        <div className="mb-6 w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center">
          <Icon size={48} className="text-slate-400" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <Button variant="primary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
