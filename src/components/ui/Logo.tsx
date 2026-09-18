import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* Eco Leaf + 3D Precision Geometric Monogram */}
      <div className={`relative flex items-center justify-center rounded-xl bg-surface-subtle border-2 border-eco-500 shadow-sm p-1.5 transition-transform duration-200 hover:scale-105 ${iconSizes[size]}`}>
        {/* Dual Leaf Accents with 3D Layer Geometry */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-eco-500"
        >
          {/* Base 3D layer plate */}
          <path
            d="M3 17L12 21L21 17L12 13L3 17Z"
            stroke="#116B36"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Middle layer */}
          <path
            d="M3 12L12 16L21 12"
            stroke="#116B36"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity="0.75"
          />
          {/* Top Eco Leaf organic curve */}
          <path
            d="M12 3C12 3 7 5 7 10C7 12 8.5 13.5 10.5 13.8L12 11.5L13.5 13.8C15.5 13.5 17 12 17 10C17 5 12 3 12 3Z"
            fill="#116B36"
            fillOpacity="0.2"
            stroke="#116B36"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center Leaf Rib / Nozzle vector */}
          <path
            d="M12 5V13"
            stroke="#116B36"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>

        {/* Pulsing micro-leaf indicator */}
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-eco-500"></span>
        </span>
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`flex items-center gap-1.5 font-black tracking-tight text-charcoal-black ${textSizes[size]}`}>
          <span>CBV-3D</span>
          <span className="text-eco-500">PRINTING</span>
        </div>
        {showSubtitle && (
          <span className="text-[10px] font-semibold uppercase tracking-widest text-charcoal-subtle">
            Eco Additive Hub
          </span>
        )}
      </div>
    </div>
  );
}
