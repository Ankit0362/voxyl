import React from 'react';

const Badge = ({ variant = 'gray', children, dot = false }) => {
  const styles = {
    success: 'bg-green-100 text-green-800 border-green-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const dotStyles = {
    success: 'bg-green-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    gray: 'bg-gray-500'
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-black border shadow-sm ${styles[variant]}`}>
      {dot && (
        <span className="flex h-2 w-2 relative mr-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotStyles[variant]}`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotStyles[variant]}`}></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
