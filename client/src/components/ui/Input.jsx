import { forwardRef } from 'react';

export const Input = forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full bg-surface-container-high border border-outline-variant/30 rounded-lg px-md py-sm focus:ring-2 focus:ring-primary focus:outline-none text-on-surface transition-all ${className}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';
