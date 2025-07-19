'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { MainContent } from '@/components/dashboard/main-content';
import { AdminView } from '@/components/dashboard/admin-view';
import { ProfileView } from '@/components/dashboard/profile-view';
import { useAppDispatch } from '@/hooks/redux';
import { useUI } from '@/hooks/redux';
import { setIsMobile } from '@/store/slices/uiSlice';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { currentView, isMobile } = useUI();

  useEffect(() => {
    const checkMobile = () => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'admin':
        return <AdminView />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <div className="flex">
            <Sidebar />
            <MainContent />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {renderCurrentView()}
    </div>
  );
}
