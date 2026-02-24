'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Link2, FileVideo, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

const menuItems = [
  {
    id: 'overview',
    label: '개요',
    icon: LayoutDashboard,
    href: '/creator-dashboard',
  },
  {
    id: 'platforms',
    label: '플랫폼 관리',
    icon: Link2,
    href: '/creator-dashboard/platforms',
  },
  {
    id: 'contents',
    label: '콘텐츠 관리',
    icon: FileVideo,
    href: '/creator-dashboard/contents',
  },
];

export function DashboardSidebar({ isOpen = true, onClose, isMobile = false }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActiveMenu = (href: string) => {
    if (href === '/creator-dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 모바일 오버레이 */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          'fixed left-0 bg-background border-r z-50 transition-transform duration-300',
          'w-64 flex flex-col',
          // 데스크톱: Redux 상태로 제어, 헤더 아래 위치
          'hidden md:flex md:top-16 md:h-[calc(100vh-4rem)]',
          !isMobile && !isOpen && 'md:-translate-x-full',
          !isMobile && isOpen && 'md:translate-x-0',
          // 모바일: 드로어 형태, 전체 화면
          isMobile && 'flex md:hidden top-0 h-full',
          isMobile && !isOpen && '-translate-x-full',
          isMobile && isOpen && 'translate-x-0'
        )}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">크리에이터 대시보드</h2>
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* 메뉴 */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActiveMenu(item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => {
                  if (isMobile && onClose) {
                    onClose();
                  }
                }}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  active && 'bg-primary text-primary-foreground hover:bg-primary/90'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 푸터 (옵션) */}
        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            크리에이터 도구
          </p>
        </div>
      </aside>
    </>
  );
}
