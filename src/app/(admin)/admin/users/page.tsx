'use client';

import { AdminUsers } from '@/components/admin/admin-users';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminUsersPage(): JSX.Element {
  useDocumentTitle('사용자 관리');
  return <AdminUsers />;
}