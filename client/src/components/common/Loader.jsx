import React from 'react';

const Loader = ({ variant = 'inline' }) => {
  if (variant === 'page') {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mb-4"></div>
        <p className="text-gray-500 font-black tracking-widest uppercase text-sm">Loading...</p>
      </div>
    );
  }

  if (variant === 'skeleton') {
    return (
      <div className="animate-pulse bg-gray-200 rounded-xl h-full w-full min-h-[100px]"></div>
    );
  }

  return (
    <svg className="animate-spin h-5 w-5 text-current inline" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export default Loader;
