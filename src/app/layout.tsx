import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { AuthGuard } from '@/components/auth/auth-guard';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <AuthGuard>
            {children}
          </AuthGuard>
        </Providers>
      </body>
    </html>
  );
}
