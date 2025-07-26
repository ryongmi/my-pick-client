'use client';

import { useEffect } from 'react';
import { AdminHeader } from '@/components/layout/admin-header';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setIsMobile, toggleAdminSidebar } from '@/store/slices/uiSlice';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const dispatch = useAppDispatch();
  const { adminSidebarOpen, isMobile } = useAppSelector(state => state.ui);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      dispatch(setIsMobile(isMobile));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  const toggleSidebar = () => {
    dispatch(toggleAdminSidebar());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader onToggleSidebar={toggleSidebar} />
      
      <div className="flex">
        <AdminSidebar 
          isOpen={adminSidebarOpen} 
          onToggle={toggleSidebar}
        />
        
        <main className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          "pt-16", // Header height
          adminSidebarOpen ? "ml-64" : "ml-0"
        )}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}