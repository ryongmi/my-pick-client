import type { Metadata } from 'next';
import { AdminApi } from '@/components/admin/admin-api';

export const metadata: Metadata = {
  title: 'MyPick API 키 관리',
  description: 'API 키 및 할당량을 관리하세요',
};

export default function AdminApiPage() {
  return <AdminApi />;
}