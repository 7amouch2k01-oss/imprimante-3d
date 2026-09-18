import React from 'react';
import {
  KeyRound,
  Smartphone,
  Gamepad2,
  Home,
  Gift,
  Coins,
  Wrench,
  Shapes,
} from 'lucide-react';

export type CategoryId =
  | 'all'
  | 'KEYCHAINS'
  | 'PHONE_STANDS'
  | 'GAMING_ACCESSORIES'
  | 'DECORATION'
  | 'GIFTS'
  | 'PIGGY_BANKS'
  | 'UTILITY';

interface CategoryIconProps {
  id: CategoryId | string;
  className?: string;
  size?: number;
}

export function CategoryIcon({ id, className = 'w-5 h-5', size }: CategoryIconProps) {
  const commonClasses = `text-charcoal-muted group-hover:text-eco-500 transition-colors duration-200 stroke-[1.8] ${className}`;

  switch (id) {
    case 'KEYCHAINS':
      return <KeyRound className={commonClasses} size={size} />;
    case 'PHONE_STANDS':
      return <Smartphone className={commonClasses} size={size} />;
    case 'GAMING_ACCESSORIES':
      return <Gamepad2 className={commonClasses} size={size} />;
    case 'DECORATION':
      return <Home className={commonClasses} size={size} />;
    case 'GIFTS':
      return <Gift className={commonClasses} size={size} />;
    case 'PIGGY_BANKS':
      return <Coins className={commonClasses} size={size} />;
    case 'UTILITY':
      return <Wrench className={commonClasses} size={size} />;
    case 'all':
    default:
      return <Shapes className={commonClasses} size={size} />;
  }
}
