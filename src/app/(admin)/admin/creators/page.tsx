'use client';

import { AdminCreators } from '@/components/admin/admin-creators';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminCreatorsPage() {
  useDocumentTitle('크리에이터 관리');
  return <AdminCreators />;
}