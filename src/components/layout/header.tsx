'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, BarChart3, Menu, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useUI } from '@/hooks/redux';
import { useAuth } from '@/context/AuthContext';
import {
  toggleSidebar,
  toggleDropdown,
  closeAllDropdowns,
} from '@/store/slices/uiSlice';
import { logoutUser } from '@/store/slices/authSlice';
import { 
  openApplicationModal,
  closeApplicationModal,
  openStatusModal,
  closeStatusModal,
  fetchApplicationStatus 
} from '@/store/slices/creatorApplicationSlice';
import { CreatorApplicationModal } from '@/components/main/creator-application-modal';
import { CreatorStatusModal } from '@/components/main/creator-status-modal';

export function Header(): JSX.Element {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { dropdowns } = useUI();
  const { applicationStatus, isApplicationModalOpen, isStatusModalOpen } = useAppSelector(state => state.creatorApplication);

  // 크리에이터 신청 상태 초기화
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchApplicationStatus());
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
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
    return (): void => document.removeEventListener('click', handleClickOutside);
  }, [dispatch]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 w-full items-center px-4">
          {/* 햄버거 메뉴 + 로고 */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              data-sidebar-toggle
              onClick={(e) => {
                e.stopPropagation();
                dispatch(toggleSidebar());
              }}
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
              크리에이터 통합 허브
            </span>
          </div>

          {/* 검색바 */}
          <div className="flex flex-1 justify-center">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
              <Input
                placeholder="크리에이터 또는 콘텐츠 검색..."
                className="pl-10"
              />
            </div>
          </div>

          {/* 우측 메뉴 */}
          <div className="mr-3 flex items-center space-x-3">
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

              {dropdowns.dashboard ? <div
                  data-dropdown
                  className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg"
                >
                  <div className="border-b p-4">
                    <h3 className="font-semibold">대시보드</h3>
                  </div>
                  <div className="space-y-4 p-4">
                    <div>
                      <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                        오늘의 통계
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-indigo-50 p-3 text-center">
                          <p className="text-xl font-bold text-indigo-600">15</p>
                          <p className="text-xs text-muted-foreground">
                            새 콘텐츠
                          </p>
                        </div>
                        <div className="rounded-lg bg-green-50 p-3 text-center">
                          <p className="text-xl font-bold text-green-600">2.3M</p>
                          <p className="text-xs text-muted-foreground">
                            총 조회수
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div> : null}
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

              {dropdowns.notification ? <div
                  data-dropdown
                  className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-background shadow-lg"
                >
                  <div className="flex items-center justify-between border-b p-4">
                    <h3 className="font-semibold">알림</h3>
                    <Button variant="ghost" size="sm">
                      모두 읽음
                    </Button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <div className="cursor-pointer border-b p-4 hover:bg-muted">
                      <div className="flex items-start">
                        <div className="mr-3 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-500 font-bold text-white">
                          A
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            Ado가 새 영상을 업로드했습니다
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            【歌ってみた】새로운 커버곡
                          </p>
                          <p className="mt-1 text-xs text-indigo-600">10분 전</p>
                        </div>
                        <div className="h-2 w-2 rounded-full bg-indigo-600" />
                      </div>
                    </div>
                  </div>
                </div> : null}
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
                  {user?.name?.charAt(0) || '사'}
                </div>
                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name || '사용자님'}
                </span>
              </Button>

              {dropdowns.profile ? <div
                  data-dropdown
                  className="absolute right-0 z-50 mt-2 w-48 rounded-lg border bg-background shadow-lg"
                >
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
                    
                    {/* 크리에이터 신청 관련 메뉴 */}
                    {applicationStatus === 'none' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-indigo-600"
                        onClick={() => {
                          dispatch(openApplicationModal());
                          dispatch(closeAllDropdowns());
                        }}
                      >
                        <Star className="mr-2 h-4 w-4" />
                        크리에이터 신청하기
                      </Button>
                    )}
                    
                    {applicationStatus === 'pending' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-orange-600"
                        onClick={() => {
                          dispatch(openStatusModal());
                          dispatch(closeAllDropdowns());
                        }}
                      >
                        <Clock className="mr-2 h-4 w-4" />
                        신청 상태 확인
                      </Button>
                    )}
                    
                    {applicationStatus === 'approved' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-green-600"
                        onClick={() => {
                          router.push('/creator-dashboard');
                          dispatch(closeAllDropdowns());
                        }}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        크리에이터 대시보드
                      </Button>
                    )}
                    
                    {applicationStatus === 'rejected' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600"
                        onClick={() => {
                          dispatch(openApplicationModal());
                          dispatch(closeAllDropdowns());
                        }}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        재신청하기
                      </Button>
                    )}
                    
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
                </div> : null}
            </div>
          </div>
        </div>
      </header>
      
      {/* 크리에이터 신청 모달 */}
      <CreatorApplicationModal 
        isOpen={isApplicationModalOpen}
        onClose={() => dispatch(closeApplicationModal())}
      />
      
      {/* 크리에이터 상태 모달 */}
      <CreatorStatusModal 
        isOpen={isStatusModalOpen}
        onClose={() => dispatch(closeStatusModal())}
      />
    </>
  );
}
