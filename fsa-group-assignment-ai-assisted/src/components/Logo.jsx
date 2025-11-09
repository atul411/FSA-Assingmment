import React from 'react';

export const Logo = ({ variant = 'default', className = '' }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Loop-style lending logo - two interlocked shapes forming L and return arrow */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Left loop (L shape) in Royal Blue */}
        <path
          d="M8 8 L8 28 L18 28"
          stroke="#2F5DFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="28" r="4" fill="#2F5DFF" />
        
        {/* Right loop (return arrow) in Emerald */}
        <path
          d="M32 32 L32 12 L22 12"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 8 L22 12 L26 16"
          stroke="#10B981"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="12" r="4" fill="#10B981" />
        
        {/* Connecting flow */}
        <path
          d="M18 24 Q20 20 22 16"
          stroke="#2F5DFF"
          strokeWidth="2"
          strokeOpacity="0.3"
          strokeDasharray="2 2"
        />
      </svg>
      
      {variant === 'default' && (
        <div className="flex flex-col">
          <span className="text-[#2F5DFF] tracking-tight" style={{ fontSize: '20px', fontWeight: '700', lineHeight: '1.2' }}>
            EduLend
          </span>
          <span className="text-gray-500" style={{ fontSize: '11px', fontWeight: '500', lineHeight: '1' }}>
            School Equipment Lending
          </span>
        </div>
      )}
    </div>
  );
};
