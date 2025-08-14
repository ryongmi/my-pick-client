'use client';

import { MainContent } from '@/components/main/dashboard/main-content';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function HomePage() {
  useDocumentTitle('대시보드');
  
  return (
    <div className="p-6">
      <MainContent />
    </div>
  );
}
