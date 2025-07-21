'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useUI } from '@/hooks/redux';
import { setCreatorFilter } from '@/store/slices/uiSlice';
import { followCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { cn } from '@/lib/utils';
import { QuickCreatorAddModal } from '@/components/dashboard/quick-creator-add-modal';
import { Creator } from '@/types';
import { mockGetFollowedCreators } from '@/data/creators';

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
  const router = useRouter();
  const { sidebarOpen, filters } = useUI();
  const { followedCreators, isFollowing } = useAppSelector(state => state.creator);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);

  // 구독 중인 크리에이터 로드
  useEffect(() => {
    const loadFollowedCreators = () => {
      const followed = mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed));
    };
    loadFollowedCreators();

    // 구독 상태 변경 이벤트 리스너
    const handleFollowChange = () => {
      loadFollowedCreators();
    };

    window.addEventListener('followersChanged', handleFollowChange);
    return () => window.removeEventListener('followersChanged', handleFollowChange);
  }, [dispatch]);

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

  const handleQuickAddCreator = async (creator: Creator) => {
    try {
      await dispatch(followCreator(creator.id)).unwrap();
      
      // 다른 컴포넌트들에게 알림
      window.dispatchEvent(new CustomEvent('followersChanged'));
      
      setShowQuickAddModal(false);
    } catch (error) {
      console.error('빠른 크리에이터 추가 오류:', error);
    }
  };

  return (
    <aside 
      className="fixed left-0 top-16 w-64 bg-background h-[calc(100vh-4rem)] border-r overflow-y-auto z-40"
    >
      <div className="p-4">
        {/* 사이드바 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">내 크리에이터</h2>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowQuickAddModal(true)}
            className="hover:bg-primary/10"
          >
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
          {followedCreators.map((creator) => (
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
          {followedCreators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">구독한 크리에이터가 없습니다</p>
              <p className="text-xs mt-1">위의 + 버튼을 눌러서 추가해보세요</p>
            </div>
          ) : (
            followedCreators.map((creator) => (
              <div
                key={creator.id}
                className="flex items-center p-3 rounded-lg hover:bg-muted cursor-pointer"
                onClick={() => handleCreatorFilter(creator.id)}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                  creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                  creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                  creator.id === 'kuzuha' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                  'bg-gradient-to-r from-gray-400 to-gray-600'
                )}>
                  {creator.displayName.charAt(0)}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium text-sm">{creator.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {creator.platforms.map(platform => 
                      platform.type === 'youtube' ? 'YouTube' : 'Twitter'
                    ).join(' • ')}
                  </p>
                </div>
                {/* 새 콘텐츠 카운트는 실제 데이터가 있을 때 표시 */}
                {Math.random() > 0.5 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {Math.floor(Math.random() * 5) + 1} 새 콘텐츠
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        {/* 크리에이터 추가 버튼 */}
        <Button
          variant="outline"
          className="w-full mt-4 border-dashed"
          onClick={() => router.push('/creators')}
        >
          <Plus className="h-4 w-4 mr-2" />
          크리에이터 추가
        </Button>

        {/* 빠른 크리에이터 추가 모달 */}
        <QuickCreatorAddModal
          isOpen={showQuickAddModal}
          onClose={() => setShowQuickAddModal(false)}
          onAddCreator={handleQuickAddCreator}
        />
      </div>
    </aside>
  );
}
