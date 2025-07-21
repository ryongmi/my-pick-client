'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, BarChart3, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch } from '@/hooks/redux';
import { useAuth, useUI } from '@/hooks/redux';
import { 
  toggleSidebar, 
  toggleDropdown, 
  closeAllDropdowns 
} from '@/store/slices/uiSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { cn } from '@/lib/utils';

export function Header() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { dropdowns } = useUI();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      // 드롭다운이나 드롭다운 트리거 버튼을 클릭한 경우 닫지 않음
      if (target.closest('[data-dropdown]') || target.closest('[data-dropdown-trigger]')) {
        return;
      }
      dispatch(closeAllDropdowns());
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dispatch]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center px-4">
        {/* 햄버거 메뉴 + 로고 */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(toggleSidebar())}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/dashboard" className="flex items-center cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg mr-2" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MyPick
            </h1>
          </Link>
          <span className="ml-2 text-sm text-muted-foreground hidden sm:inline">
            크리에이터 통합 허브
          </span>
        </div>

        {/* 검색바 */}
        <div className="flex-1 flex justify-center">
          <div className="relative max-w-lg w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="크리에이터 또는 콘텐츠 검색..."
              className="pl-10"
            />
          </div>
        </div>

        {/* 우측 메뉴 */}
        <div className="flex items-center space-x-3 mr-3">
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
              <div data-dropdown className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg border z-50">
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
              <div data-dropdown className="absolute right-0 mt-2 w-80 bg-background rounded-lg shadow-lg border z-50">
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
              <div data-dropdown className="absolute right-0 mt-2 w-48 bg-background rounded-lg shadow-lg border z-50">
                <div className="p-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/profile');
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    내 프로필
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start"
                    onClick={() => {
                      router.push('/settings');
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    설정
                  </Button>
                  {user?.role === 'admin' && (
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start"
                      onClick={() => {
                        router.push('/admin');
                        dispatch(closeAllDropdowns());
                      }}
                    >
                      관리자 페이지
                    </Button>
                  )}
                  <div className="border-t my-1" />
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600"
                    onClick={() => {
                      dispatch(logoutUser());
                      dispatch(closeAllDropdowns());
                    }}
                  >
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
