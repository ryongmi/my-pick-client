'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useUI } from '@/hooks/redux';
import { setCreatorFilter, setSidebarOpen } from '@/store/slices/uiSlice';
import { followCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { cn } from '@/lib/utils';
import { QuickCreatorAddModal } from '@/components/admin/creators/quick-creator-add-modal';
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
  const { sidebarOpen, filters, isMobile } = useUI();
  const { followedCreators, isFollowing } = useAppSelector(state => state.creator);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // 구독 중인 크리에이터 로드
  useEffect(() => {
    const loadFollowedCreators = async () => {
      const followed = await mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed.data || []));
    };
    loadFollowedCreators();

    // 구독 상태 변경 이벤트 리스너
    const handleFollowChange = () => {
      loadFollowedCreators();
    };

    window.addEventListener('followersChanged', handleFollowChange);
    return () => window.removeEventListener('followersChanged', handleFollowChange);
  }, [dispatch]);

  // 외부 클릭 감지 및 사이드바 닫기
  useEffect(() => {
    if (!sidebarOpen) {return;}

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 햄버거 버튼 클릭은 무시
      if (target.closest('[data-sidebar-toggle]')) {
        return;
      }
      
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        dispatch(setSidebarOpen(false));
      }
    };

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setSidebarOpen(false));
      }
    };

    // 약간의 지연을 두어 클릭 이벤트와 충돌 방지
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [sidebarOpen, dispatch]);

  // 사이드바 열릴 때 body 스크롤 방지 (모바일)
  useEffect(() => {
    if (sidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen, isMobile]);

  const handleCreatorFilter = (creatorId: string) => {
    const currentFilters = filters.selectedCreators;
    
    if (currentFilters.includes('all')) {
      // "전체"가 선택된 상태에서 특정 크리에이터 클릭
      dispatch(setCreatorFilter([creatorId]));
    } else {
      if (currentFilters.includes(creatorId)) {
        // 이미 선택된 크리에이터 → 제거
        const newFilters = currentFilters.filter(id => id !== creatorId);
        if (newFilters.length === 0) {
          dispatch(setCreatorFilter(['all'])); // 아무도 선택 안됨 → 전체 선택
        } else {
          dispatch(setCreatorFilter(newFilters));
        }
      } else {
        // 새 크리에이터 → 추가
        dispatch(setCreatorFilter([...currentFilters, creatorId]));
      }
    }
  };

  const isCreatorSelected = (creatorId: string) => {
    return filters.selectedCreators.includes(creatorId) && !filters.selectedCreators.includes('all');
  };

  const handleQuickAddCreator = async (creator: Creator) => {
    try {
      await dispatch(followCreator(creator)).unwrap();
      
      // 다른 컴포넌트들에게 알림
      window.dispatchEvent(new CustomEvent('followersChanged'));
      
      setShowQuickAddModal(false);
    } catch (error) {
      console.error('빠른 크리에이터 추가 오류:', error);
    }
  };

  return (
    <>
      {/* 배경 오버레이 (모바일에서만 표시) */}
      {sidebarOpen && isMobile ? <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => dispatch(setSidebarOpen(false))}
        /> : null}
      
      {/* 사이드바 */}
      <aside 
        ref={sidebarRef}
        className={cn(
          "fixed top-16 bg-background h-[calc(100vh-4rem)] border-r overflow-y-auto z-50 transition-transform duration-300 ease-in-out",
          // 데스크톱: 왼쪽에서 슬라이드, 부분 오버레이
          "md:left-0 md:w-64",
          // 모바일: 전체 너비로 왼쪽에서 슬라이드
          "left-0 w-80 max-w-[85vw]",
          // 배경 효과
          "backdrop-blur-sm bg-background/95 shadow-xl",
          // 애니메이션
          sidebarOpen 
            ? "translate-x-0" 
            : "-translate-x-full"
        )}
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
                className={cn(
                  "flex items-center p-3 rounded-lg cursor-pointer transition-colors",
                  isCreatorSelected(creator.id)
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted"
                )}
                onClick={() => handleCreatorFilter(creator.id)}
              >
                {creator.avatar ? (
                  <img 
                    src={creator.avatar} 
                    alt={creator.displayName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                    creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                    creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                    creator.id === 'kuzuha' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                    creator.id === 'mrbeast' ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                    creator.id === 'pewdiepie' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                    creator.id === 'marques' ? 'bg-gradient-to-r from-blue-500 to-purple-600' :
                    creator.id === 'emma' ? 'bg-gradient-to-r from-purple-400 to-pink-400' :
                    creator.id === 'dude_perfect' ? 'bg-gradient-to-r from-green-500 to-blue-500' :
                    creator.id === 'ninja' ? 'bg-gradient-to-r from-blue-600 to-cyan-400' :
                    creator.id === 'veritasium' ? 'bg-gradient-to-r from-indigo-500 to-purple-500' :
                    creator.id === 'gordon_ramsay' ? 'bg-gradient-to-r from-red-500 to-orange-500' :
                    creator.id === 'kurzgesagt' ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                    'bg-gradient-to-r from-gray-400 to-gray-600'
                  )}>
                    {creator.displayName.charAt(0)}
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="font-medium text-sm">{creator.displayName}</p>
                  <p className="text-xs text-muted-foreground">
                    {creator.platforms?.map(platform => 
                      platform.type === 'youtube' ? 'YouTube' : 'Twitter'
                    ).join(' • ')}
                  </p>
                </div>
                {/* 새 콘텐츠 카운트 - 크리에이터별 고정값 */}
                {(() => {
                  // 크리에이터별 고정된 새 콘텐츠 수 (실제로는 서버에서 가져올 데이터)
                  const newContentCounts: Record<string, number> = {
                    'ado': 3,
                    'hikakin': 1,
                    'kuzuha': 5
                  };
                  const count = newContentCounts[creator.id];
                  return count ? (
                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {count} 새 콘텐츠
                    </span>
                  ) : null;
                })()}
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
    </>
  );
}
