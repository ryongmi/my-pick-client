'use client';

import { Inter } from 'next/font/google';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';
import { useAppDispatch, useUI } from '@/hooks/redux';
import { setIsMobile } from '@/store/slices/uiSlice';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

/**
 * 루트 레이아웃
 * - Providers (Redux, ThemeProvider, AuthProvider, AuthGuard 포함)
 * - Header + Sidebar (모든 페이지 공통, 단 크리에이터 대시보드에서는 Sidebar 숨김)
 */
function RootLayoutClient({ children }: { children: React.ReactNode }): JSX.Element {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { sidebarOpen } = useUI();

  // 크리에이터 대시보드 페이지인지 확인
  const isDashboardPage = pathname?.startsWith('/creator-dashboard');

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
      {/* 크리에이터 대시보드가 아닐 때만 전역 사이드바 표시 */}
      {!isDashboardPage && sidebarOpen && <Sidebar />}
      <main className={isDashboardPage ? '' : 'mt-16 overflow-auto'}>
        {children}
      </main>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#6366f1" />
        <title>MyPick - 크리에이터 통합 대시보드</title>
        <meta name="description" content="좋아하는 크리에이터의 YouTube와 Twitter 콘텐츠를 한 곳에서 관리하세요" />
        <meta name="keywords" content="크리에이터, YouTube, Twitter, 대시보드, 팬, 콘텐츠" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </Providers>
      </body>
    </html>
  );
}
