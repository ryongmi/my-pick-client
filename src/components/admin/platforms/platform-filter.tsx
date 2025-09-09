'use client';

import { useAppSelector } from '@/hooks/redux';
import { cn } from '@/lib/utils';
import { PlatformTab } from '@/components/ui/platform-tab';
import { PlatformFilterProps } from '@/types/platform';
import { selectEnabledPlatforms } from '@/store/slices/platformSlice';

export function PlatformFilter({ 
  selectedPlatform, 
  onPlatformChange, 
  className 
}: PlatformFilterProps): JSX.Element {
  // Redux에서 활성화된 플랫폼 목록 가져오기
  const enabledPlatforms = useAppSelector(selectEnabledPlatforms);

  return (
    <div className={cn('bg-background rounded-lg shadow-sm border', className)}>
      <div 
        className="flex items-center border-b overflow-x-auto"
        role="tablist"
        aria-label="플랫폼 필터"
      >
        {/* 전체 탭 */}
        <button
          onClick={() => onPlatformChange('all')}
          className={cn(
            'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2',
            selectedPlatform === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          role="tab"
          aria-selected={selectedPlatform === 'all'}
          aria-label="전체 플랫폼 보기"
        >
          전체
        </button>

        {/* 동적 플랫폼 탭들 */}
        {enabledPlatforms.map((platform) => (
          <PlatformTab
            key={platform.id}
            platform={platform}
            isSelected={selectedPlatform === platform.id}
            onClick={onPlatformChange}
          />
        ))}

        {/* 정렬 드롭다운 (기존 유지) */}
        <div className="ml-auto px-4">
          <select 
            className="text-sm border border-input rounded px-3 py-1 bg-background"
            aria-label="정렬 옵션"
          >
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
            <option value="trending">조회수순</option>
          </select>
        </div>
      </div>
    </div>
  );
}

// 플랫폼 필터의 확장된 버전 (설정 포함)
export function PlatformFilterWithSettings({ 
  selectedPlatform, 
  onPlatformChange, 
  className,
  showSettings = false,
  onSettingsClick 
}: PlatformFilterProps & {
  showSettings?: boolean;
  onSettingsClick?: () => void;
}): JSX.Element {
  const enabledPlatforms = useAppSelector(selectEnabledPlatforms);

  return (
    <div className={cn('bg-background rounded-lg shadow-sm border', className)}>
      <div className="flex items-center justify-between p-2 border-b">
        <h3 className="text-sm font-semibold text-muted-foreground">플랫폼 필터</h3>
        {showSettings ? <button
            onClick={onSettingsClick}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            설정
          </button> : null}
      </div>
      
      <div 
        className="flex items-center border-b overflow-x-auto"
        role="tablist"
        aria-label="플랫폼 필터"
      >
        {/* 전체 탭 */}
        <button
          onClick={() => onPlatformChange('all')}
          className={cn(
            'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2',
            selectedPlatform === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          )}
          role="tab"
          aria-selected={selectedPlatform === 'all'}
        >
          전체
        </button>

        {/* 동적 플랫폼 탭들 */}
        {enabledPlatforms.map((platform) => (
          <PlatformTab
            key={platform.id}
            platform={platform}
            isSelected={selectedPlatform === platform.id}
            onClick={onPlatformChange}
          />
        ))}

        {/* 정렬 드롭다운 */}
        <div className="ml-auto px-4">
          <select className="text-sm border border-input rounded px-3 py-1 bg-background">
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
            <option value="trending">조회수순</option>
          </select>
        </div>
      </div>
    </div>
  );
}