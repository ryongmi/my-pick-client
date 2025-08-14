'use client';

import { AdminContent } from '@/components/admin/admin-content';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminContentPage() {
  useDocumentTitle('콘텐츠 모니터링');
  return <AdminContent />;
}