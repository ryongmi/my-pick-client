import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';

export const metadata: Metadata = {
  title: 'MyPick 관리자 대시보드',
  description: '시스템 현황 및 통계를 확인하세요',
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}