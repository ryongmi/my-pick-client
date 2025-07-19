import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'MyPick - 크리에이터 통합 대시보드',
  description: '좋아하는 크리에이터의 YouTube와 Twitter 콘텐츠를 한 곳에서 관리하세요',
  keywords: ['크리에이터', 'YouTube', 'Twitter', '대시보드', '팬', '콘텐츠'],
  authors: [{ name: 'MyPick Team' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#6366f1',
  openGraph: {
    title: 'MyPick - 크리에이터 통합 대시보드',
    description: '좋아하는 크리에이터의 모든 콘텐츠를 한 곳에서',
    type: 'website',
    locale: 'ko_KR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MyPick - 크리에이터 통합 대시보드',
    description: '좋아하는 크리에이터의 모든 콘텐츠를 한 곳에서',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
