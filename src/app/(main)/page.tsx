import type { Metadata } from 'next';
import { MainContent } from '@/components/main/dashboard/main-content';

export const metadata: Metadata = {
  title: 'MyPick 대시보드',
  description: '크리에이터 콘텐츠를 한눈에 확인하세요',
};

export default function HomePage() {
  return (
    <div className="p-6">
      <MainContent />
    </div>
  );
}
