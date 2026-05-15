import React from 'react';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

const CopyButton = ({ text, label = 'Copy Link', successLabel = 'Copied!', className = '' }) => {
  const [copied, copy] = useCopyToClipboard();

  return (
    <button
      onClick={() => copy(text)}
      className={`inline-flex items-center justify-center font-bold transition-all active:scale-[0.98] ${copied ? 'bg-green-50 text-green-700 border-green-200' : ''} ${className}`}
    >
      {copied ? (
        <>
          <svg className="w-4 h-4 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          {successLabel}
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          {label}
        </>
      )}
    </button>
  );
};

export default CopyButton;
