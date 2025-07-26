import type { Metadata } from 'next';
import { AdminSettings } from '@/components/admin/admin-settings';

export const metadata: Metadata = {
  title: 'MyPick 시스템 설정',
  description: '시스템 환경 설정을 관리하세요',
};

export default function AdminSettingsPage() {
  return <AdminSettings />;
}