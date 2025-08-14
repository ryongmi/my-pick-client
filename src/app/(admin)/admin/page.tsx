'use client';

import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminDashboardPage() {
  useDocumentTitle('관리자 대시보드');
  return <AdminDashboard />;
}