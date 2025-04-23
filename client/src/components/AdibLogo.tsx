import React from 'react';

export default function AdibLogo({ className = "h-9" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 90 45" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main ADIB text */}
      <path d="M10.5 17H17L19.5 29H20.5L23 17H29.5L24 35H16L10.5 17Z" fill="#003366" />
      <path d="M31 17H38V35H31V17Z" fill="#003366" />
      <path d="M40 17H47V20H47.5C48.5 18 50.5 16.5 53 16.5C55.5 16.5 57.5 17.5 58.5 20C59.5 17.5 62 16.5 64.5 16.5C70 16.5 72 20 72 25V35H65V25.5C65 23.5 64 22 62 22C60 22 59 23.5 59 25.5V35H52V25.5C52 23.5 51 22 49 22C47 22 46 23.5 46 25.5V35H40V17Z" fill="#003366" />
      
      {/* Circular elements based on ADIB logo */}
      <circle cx="35" cy="12" r="3" fill="#00a3a6" />
      <circle cx="70" cy="32" r="5" fill="#00a3a6" />
      
      {/* Arabic text representation */}
      <path d="M75 25C75 25 78 22 81 22C84 22 85 25 82 27.5L77 31.5L85 31.5" stroke="#003366" strokeWidth="1.5" />
      <path d="M75 15H85" stroke="#003366" strokeWidth="1.5" />
      <path d="M80 15V21" stroke="#003366" strokeWidth="1.5" />
    </svg>
  );
}