'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Menu, Bell, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, useUI, useAppDispatch } from '@/hooks/redux';
import { 
  toggleDropdown,
  closeAllDropdowns,
} from '@/store/slices/uiSlice';
import { logoutUser } from '@/store/slices/authSlice';

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

export function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user } = useAuth();
  const { dropdowns } = useUI();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // 드롭다운이나 드롭다운 트리거 버튼을 클릭한 경우 닫지 않음
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
    <header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 w-full items-center px-4">
        {/* 햄버거 메뉴 + 로고 */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex cursor-pointer items-center">
            <div className="mr-2 h-8 w-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600" />
            <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
              MyPick
            </h1>
          </Link>
          <span className="ml-2 hidden text-sm text-muted-foreground sm:inline">
            관리자 페이지
          </span>
        </div>

        {/* 우측 메뉴 */}
        <div className="ml-auto mr-3 flex items-center space-x-3">
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
                data-dropdown
                className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg"
              >
                <div className="border-b p-4">
                  <h3 className="font-semibold">관리자 대시보드</h3>
                </div>
                <div className="space-y-4 p-4">
                  <div>
                    <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                      오늘의 통계
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-indigo-50 p-3 text-center">
                        <p className="text-xl font-bold text-indigo-600">24</p>
                        <p className="text-xs text-muted-foreground">
                          새 사용자
                        </p>
                      </div>
                      <div className="rounded-lg bg-green-50 p-3 text-center">
                        <p className="text-xl font-bold text-green-600">156</p>
                        <p className="text-xs text-muted-foreground">
                          총 콘텐츠
                        </p>
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
              <span className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-red-500" />
            </Button>

            {dropdowns.notification && (
              <div
                data-dropdown
                className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg"
              >
                <div className="flex items-center justify-between border-b p-4">
                  <h3 className="font-semibold">관리자 알림</h3>
                  <Button variant="ghost" size="sm">
                    모두 읽음
                  </Button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="cursor-pointer border-b p-4 hover:bg-muted">
                    <div className="flex items-start">
                      <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-400 to-orange-500 font-bold text-white">
                        !
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          신규 사용자 승인 요청
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          3명의 사용자가 승인을 기다리고 있습니다
                        </p>
                        <p className="mt-1 text-xs text-indigo-600">5분 전</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-indigo-600" />
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-sm font-bold text-white">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden text-sm font-medium sm:inline">
                {user?.name || '관리자'}
              </span>
            </Button>

            {dropdowns.profile && (
              <div
                data-dropdown
                className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-background shadow-lg"
              >
                <div className="p-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    관리자 설정
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      dispatch(closeAllDropdowns());
                    }}
                  >
                    시스템 설정
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      // 메인 사이트로 이동
                      window.location.href = '/';
                    }}
                  >
                    사용자 페이지로
                  </Button>
                  <div className="my-1 border-t" />
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