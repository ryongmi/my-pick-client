import type { Metadata } from 'next';
import { AdminUsers } from '@/components/admin/admin-users';

export const metadata: Metadata = {
  title: 'MyPick 사용자 관리',
  description: '등록된 사용자를 관리하고 권한을 설정하세요',
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}