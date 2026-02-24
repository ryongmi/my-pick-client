'use client';

import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardSidebar } from '@/components/creator-dashboard/DashboardSidebar';
import { useAppDispatch, useUI } from '@/hooks/redux';
import { toggleDashboardSidebar } from '@/store/slices/uiSlice';

export default function CreatorDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const { dashboardSidebarOpen } = useUI();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen pt-16">
      {/* 데스크톱 사이드바 - Redux 상태로 제어 */}
      <DashboardSidebar isOpen={dashboardSidebarOpen} />

      {/* 모바일 사이드바 */}
      <DashboardSidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        isMobile
      />

      {/* 메인 콘텐츠 영역 - 사이드바 상태에 따라 여백 조정 */}
      <main className={`flex-1 transition-all duration-300 ${dashboardSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        {/* 모바일 헤더 */}
        <div className="sticky top-16 z-30 flex items-center gap-4 p-4 bg-background border-b md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">크리에이터 대시보드</h1>
        </div>

        {/* 페이지 콘텐츠 */}
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
