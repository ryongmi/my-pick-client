'use client';

import { useEffect } from 'react';
import { Search, Bell, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import { useAuth, useUI } from '@/hooks/redux';
import { 
  toggleSidebar, 
  toggleDropdown, 
  closeAllDropdowns,
  setCurrentView 
} from '@/store/slices/uiSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';

export function Header() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAuth();
  const { dropdowns, currentView } = useUI();

  // 디버깅: 사용자 상태 로그
  console.log('Header render - User:', user);
  console.log('Header render - IsAuthenticated:', isAuthenticated);
  console.log('Header render - Dropdowns:', dropdowns);
  console.log('Header render - CurrentView:', currentView);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // 드롭다운 내부나 드롭다운 트리거 버튼을 클릭한 경우는 제외
      if (
        target.closest('[data-dropdown]') || 
        target.closest('[data-dropdown-trigger]')
      ) {
        return;
      }
      dispatch(closeAllDropdowns());
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* 햄버거 메뉴 + 로고 */}
        <div className="flex items-center flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => dispatch(setCurrentView('user'))}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MyPick
            </h1>
          </div>
          <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">
            크리에이터 통합 허브
          </span>
        </div>

        {/* 검색바 */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="크리에이터 또는 콘텐츠 검색..."
              className="pl-10"
            />
          </div>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          {/* 대시보드 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              data-dropdown-trigger
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleDropdown('dashboard'));
              }}
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
            
            {dropdowns.dashboard && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg border z-50"
                data-dropdown
              >
                <div className="p-4 border-b">
                  <h3 className="font-semibold">대시보드</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">오늘의 통계</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-indigo-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-indigo-600">15</p>
                        <p className="text-xs text-muted-foreground">새 콘텐츠</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3 text-center">
                        <p className="text-xl font-bold text-green-600">2.3M</p>
                        <p className="text-xs text-muted-foreground">총 조회수</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 알림 */}
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              data-dropdown-trigger
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleDropdown('notification'));
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </Button>
            
            {dropdowns.notification && (
              <div 
                className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg border z-50"
                data-dropdown
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h3 className="font-semibold">알림</h3>
                  <Button variant="ghost" size="sm">모두 읽음</Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-muted cursor-pointer border-b">
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold mr-3 flex-shrink-0">
                        A
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Ado가 새 영상을 업로드했습니다</p>
                        <p className="text-xs text-muted-foreground mt-1">【歌ってみた】새로운 커버곡</p>
                        <p className="text-xs text-indigo-600 mt-1">10분 전</p>
                      </div>
                      <div className="w-2 h-2 bg-indigo-600 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 프로필 */}
          <div className="relative">
            <Button
              variant="ghost"
              data-dropdown-trigger
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleDropdown('profile'));
              }}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || '사'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {user?.name || '사용자님'}
              </span>
            </Button>
            
            {dropdowns.profile && (
              <div 
                className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border z-50"
                data-dropdown
              >
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      dispatch(setCurrentView('profile'));
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    <span className="mr-2">👤</span>
                    내 프로필
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    <span className="mr-2">⚙️</span>
                    설정
                  </Button>
                  {/* 디버깅: 관리자 버튼 렌더링 확인 */}
                  {console.log('Admin button render check - User role:', user?.role, 'Condition result:', user?.role === 'admin')}
                  {user?.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        console.log('=== Admin Button Click Debug ===');
                        console.log('Event:', e);
                        console.log('User:', user);
                        console.log('User role:', user?.role);
                        console.log('Current view:', currentView);
                        e.preventDefault();
                        e.stopPropagation();
                        
                        try {
                          dispatch(setCurrentView('admin'));
                          console.log('Dispatched setCurrentView(admin)');
                          
                          dispatch(closeAllDropdowns());
                          console.log('Dispatched closeAllDropdowns()');
                        } catch (error) {
                          console.error('Error in admin button click:', error);
                        }
                        
                        console.log('=== End Debug ===');
                      }}
                    >
                      <span className="mr-2">🛠️</span>
                      관리자 페이지
                    </Button>
                  )}
                  <div className="border-t my-1" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      dispatch(logoutUser());
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    <span className="mr-2">🚪</span>
                    로그아웃
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
