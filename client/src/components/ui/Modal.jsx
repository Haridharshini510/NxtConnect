import { useState } from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
  size = 'md',
  isDangerous = false,
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div
          className={`
            relative w-full ${sizes[size]} bg-white rounded-xl shadow-2xl
            border border-slate-200 overflow-hidden
            animate-slide-in
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-slate-200 bg-slate-50">
            <div className="flex-1">
              {title && <h2 className="text-xl font-bold text-slate-900">{title}</h2>}
              {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">{children}</div>

          {/* Footer */}
          {actions && (
            <div className="flex gap-3 justify-end px-6 py-4 border-t border-slate-200 bg-slate-50">
              {actions.map((action, idx) => (
                <Button
                  key={idx}
                  variant={action.variant || (isDangerous && idx === actions.length - 1 ? 'danger' : 'secondary')}
                  size="sm"
                  onClick={() => {
                    action.onClick?.();
                    if (!action.keepOpen) onClose();
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
