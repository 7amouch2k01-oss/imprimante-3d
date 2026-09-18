import React from 'react';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function Logo({ className = '', size = 'md', showSubtitle = true }: LogoProps) {
  const dimensions = {
    sm: { width: 32, height: 32, text: 'text-base', sub: 'text-[9px]' },
    md: { width: 44, height: 44, text: 'text-xl', sub: 'text-[10px]' },
    lg: { width: 56, height: 56, text: 'text-2xl', sub: 'text-[11px]' },
  };

  const current = dimensions[size];

  return (
    <div className={`inline-flex items-center gap-3 font-bold tracking-tight select-none group ${className}`}>
      {/* Official Brand Logo Icon */}
      <div className="relative flex items-center justify-center rounded-xl bg-white border border-surface-border shadow-xs p-1 transition-transform duration-200 group-hover:scale-105">
        <img
          src="/images/logo.png"
          alt="CBV-3D PRINTING Logo"
          width={current.width}
          height={current.height}
          className="object-contain"
        />
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`flex items-center gap-1.5 font-black tracking-tight text-charcoal-black ${current.text}`}>
          <span>CBV-3D</span>
          <span className="text-eco-500">PRINTING</span>
        </div>
        {showSubtitle && (
          <span className={`font-semibold uppercase tracking-widest text-charcoal-subtle ${current.sub}`}>
            Eco Additive Hub
          </span>
        )}
      </div>
    </div>
  );
}
