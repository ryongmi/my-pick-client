'use client';

import { useEffect } from 'react';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { useAppDispatch, useUI } from '@/hooks/redux';
import { setIsMobile } from '@/store/slices/uiSlice';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useUI();

  useEffect(() => {
    const checkMobile = (): void => {
      dispatch(setIsMobile(window.innerWidth < 768));
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return (): void => window.removeEventListener('resize', checkMobile);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {sidebarOpen ? <Sidebar /> : null}
      <main className="mt-16 overflow-auto">
        {children}
      </main>
    </div>
  );
}