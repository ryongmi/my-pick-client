import type { Metadata } from 'next';
import { AdminView } from '@/components/dashboard/admin-view';

export const metadata: Metadata = {
  title: 'MyPick 관리자',
  description: '시스템 관리 및 사용자 관리',
};

export default function AdminPage() {
  return (
    <div className="p-6">
      <AdminView />
    </div>
  );
}