'use client';

import { AdminApi } from '@/components/admin/admin-api';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminApiPage(): JSX.Element {
  useDocumentTitle('API 관리');
  return <AdminApi />;
}