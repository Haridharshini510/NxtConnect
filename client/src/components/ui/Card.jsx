import { forwardRef } from 'react';

const Card = forwardRef(
  ({ children, className, elevated = false, ...props }, ref) => (
    <div
      ref={ref}
      className={`
        bg-white rounded-lg border border-slate-200 overflow-hidden
        ${elevated ? 'shadow-lg' : 'shadow-sm'}
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </div>
  )
);

Card.displayName = 'Card';

// Card.Header
const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-4 py-3.5 border-b border-slate-200 bg-slate-50 ${className || ''}`}
    {...props}
  >
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

// Card.Body
const CardBody = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-4 py-4 ${className || ''}`}
    {...props}
  >
    {children}
  </div>
));

CardBody.displayName = 'CardBody';

// Card.Footer
const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`px-4 py-3.5 border-t border-slate-200 bg-slate-50 flex gap-2 justify-end ${className || ''}`}
    {...props}
  >
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
