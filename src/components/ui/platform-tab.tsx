'use client';

import { forwardRef } from 'react';
import { Youtube, Instagram, Music, Tv } from 'lucide-react';
import { XLogo } from '@/components/icons/XLogo';
import { cn } from '@/lib/utils';
import { PlatformTabProps } from '@/types/platform';

// 아이콘 매핑
const ICON_MAP = {
  Youtube,
  Twitter: XLogo, // X (구 Twitter)
  Instagram,
  Music,
  Tv,
} as const;

export const PlatformTab = forwardRef<HTMLButtonElement, PlatformTabProps>(
  ({ platform, isSelected, onClick, className }, ref) => {
    // 동적 아이콘 렌더링
    const IconComponent = ICON_MAP[platform.icon as keyof typeof ICON_MAP];
    
    return (
      <button
        ref={ref}
        onClick={() => onClick(platform.id)}
        className={cn(
          'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 flex items-center',
          isSelected
            ? 'border-primary text-primary'
            : 'border-transparent text-muted-foreground hover:text-foreground',
          className
        )}
        aria-label={`${platform.displayName} 필터`}
        role="tab"
        aria-selected={isSelected}
      >
        {IconComponent ? (
          platform.icon === 'Twitter' ? (
            <IconComponent
              className="mr-2 text-black"
              size={16}
            />
          ) : (
            <IconComponent
              className={cn('h-4 w-4 mr-2', platform.color)}
            />
          )
        ) : null}
        <span>{platform.displayName}</span>
      </button>
    );
  }
);

PlatformTab.displayName = 'PlatformTab';