'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/redux';
import { useUI, useCreator } from '@/hooks/redux';
import { setCreatorFilter } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

const MOCK_CREATORS = [
  {
    id: 'ado',
    name: 'Ado',
    displayName: 'Ado',
    avatar: '',
    platforms: ['youtube', 'twitter'],
    newContentCount: 5,
  },
  {
    id: 'hikakin',
    name: '히카킨',
    displayName: '히카킨',
    avatar: '',
    platforms: ['youtube', 'twitter'],
    newContentCount: 2,
  },
];

export function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen, filters } = useUI();

  const handleCreatorFilter = (creatorId: string) => {
    if (creatorId === 'all') {
      dispatch(setCreatorFilter(['all']));
    } else {
      const currentFilters = filters.selectedCreators;
      if (currentFilters.includes('all')) {
        dispatch(setCreatorFilter([creatorId]));
      } else {
        if (currentFilters.includes(creatorId)) {
          const newFilters = currentFilters.filter(id => id !== creatorId);
          if (newFilters.length === 0) {
            dispatch(setCreatorFilter(['all']));
          } else {
            dispatch(setCreatorFilter(newFilters));
          }
        } else {
          dispatch(setCreatorFilter([...currentFilters, creatorId]));
        }
      }
    }
  };

  const isCreatorSelected = (creatorId: string) => {
    return filters.selectedCreators.includes(creatorId) || filters.selectedCreators.includes('all');
  };

  return (
    <aside 
      className={cn(
        'w-64 bg-background h-[calc(100vh-4rem)] sticky top-16 border-r overflow-y-auto transition-all duration-300 flex-shrink-0',
        !sidebarOpen && '-translate-x-full'
      )}
    >
      <div className="p-4">
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">내 크리에이터</h2>
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 크리에이터 필터 칩 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCreatorFilter('all')}
            className={cn(
              'px-3 py-1 rounded-full text-sm font-medium transition-all',
              filters.selectedCreators.includes('all')
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            전체
          </button>
          {MOCK_CREATORS.map((creator) => (
            <button
              key={creator.id}
              onClick={() => handleCreatorFilter(creator.id)}
              className={cn(
                'px-3 py-1 rounded-full text-sm font-medium transition-all',
                isCreatorSelected(creator.id) && !filters.selectedCreators.includes('all')
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {creator.displayName}
            </button>
          ))}
        </div>

        {/* 크리에이터 리스트 */}
        <div className="space-y-3">
          {MOCK_CREATORS.map((creator) => (
            <div
              key={creator.id}
              className="flex items-center p-3 rounded-lg hover:bg-muted cursor-pointer"
              onClick={() => handleCreatorFilter(creator.id)}
            >
              <div className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                creator.id === 'ado' 
                  ? 'bg-gradient-to-r from-pink-400 to-purple-500'
                  : 'bg-gradient-to-r from-blue-400 to-cyan-500'
              )}>
                {creator.displayName.charAt(0)}
              </div>
              <div className="ml-3 flex-1">
                <p className="font-medium text-sm">{creator.displayName}</p>
                <p className="text-xs text-muted-foreground">
                  {creator.platforms.map(platform => 
                    platform === 'youtube' ? 'YouTube' : 'Twitter'
                  ).join(' • ')}
                </p>
              </div>
              {creator.newContentCount > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {creator.newContentCount} 새 콘텐츠
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 크리에이터 추가 버튼 */}
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          크리에이터 추가
        </Button>
      </div>
    </aside>
  );
}
