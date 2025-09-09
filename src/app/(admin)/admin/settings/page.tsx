'use client';

import { AdminSettings } from '@/components/admin/admin-settings';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminSettingsPage(): JSX.Element {
  useDocumentTitle('시스템 설정');
  return <AdminSettings />;
}