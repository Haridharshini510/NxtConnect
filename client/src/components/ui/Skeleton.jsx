const Skeleton = ({ variant = 'text', width = '100%', height = '20px', count = 1, className = '' }) => {
  const variants = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg',
  };

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`
            bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200
            animate-pulse ${variants[variant]} ${className}
          `}
          style={{
            width: width,
            height: height,
          }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
