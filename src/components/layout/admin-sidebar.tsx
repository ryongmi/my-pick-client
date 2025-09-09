'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  BarChart, 
  Users, 
  Star, 
  Layers, 
  Video, 
  Database, 
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ADMIN_MENU_ITEMS = [
  { 
    id: 'dashboard', 
    label: '대시보드', 
    icon: BarChart, 
    href: '/admin',
    description: '전체 현황 및 통계'
  },
  { 
    id: 'users', 
    label: '사용자 관리', 
    icon: Users, 
    href: '/admin/users',
    description: '등록된 사용자 관리'
  },
  { 
    id: 'creators', 
    label: '크리에이터 관리', 
    icon: Star, 
    href: '/admin/creators',
    description: '크리에이터 및 채널 관리'
  },
  { 
    id: 'platforms', 
    label: '플랫폼 관리', 
    icon: Layers, 
    href: '/admin/platforms',
    description: '지원 플랫폼 설정'
  },
  { 
    id: 'content', 
    label: '콘텐츠 모니터링', 
    icon: Video, 
    href: '/admin/content',
    description: '콘텐츠 현황 모니터링'
  },
  { 
    id: 'api', 
    label: 'API 키 관리', 
    icon: Database, 
    href: '/admin/api',
    description: 'API 키 및 할당량 관리'
  },
  { 
    id: 'settings', 
    label: '시스템 설정', 
    icon: Settings, 
    href: '/admin/settings',
    description: '시스템 환경 설정'
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps): JSX.Element | null {
  const pathname = usePathname();

  if (!isOpen) {return null;}

  return (
    <>
      {/* 모바일 오버레이 */}
      <div 
        className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
        onClick={onToggle}
      />
      
      {/* 사이드바 */}
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 shadow-lg",
        "transform transition-transform duration-300 ease-in-out",
        "lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* 사이드바 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <h2 className="text-lg font-semibold text-gray-900">관리자 메뉴</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="p-4 space-y-2">
          {ADMIN_MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  "hover:bg-gray-100",
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-blue-600" : "text-gray-500"
                )} />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{item.label}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 사이드바 하단 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>MyPick Admin v1.0</p>
            <p className="mt-1">관리자 전용 패널</p>
          </div>
        </div>
      </aside>
    </>
  );
}