import { useState } from 'react';

const Tooltip = ({ children, content, position = 'top', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setTimeout(() => setIsVisible(true), delay)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>

      {isVisible && (
        <div
          className={`
            absolute ${positions[position]} z-50
            px-2 py-1.5 text-xs font-medium text-white
            bg-slate-900 rounded-md whitespace-nowrap pointer-events-none
            animate-fade-in
          `}
        >
          {content}
          {/* Arrow */}
          <div
            className="absolute w-1 h-1 bg-slate-900"
            style={{
              ...(position === 'top' && {
                bottom: '-2px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
              }),
              ...(position === 'bottom' && {
                top: '-2px',
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
              }),
              ...(position === 'left' && {
                right: '-2px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
              }),
              ...(position === 'right' && {
                left: '-2px',
                top: '50%',
                transform: 'translateY(-50%) rotate(45deg)',
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
