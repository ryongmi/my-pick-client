import type { Metadata } from 'next';
import { AdminContent } from '@/components/admin/admin-content';

export const metadata: Metadata = {
  title: 'MyPick 콘텐츠 모니터링',
  description: '콘텐츠 현황을 모니터링하고 관리하세요',
};

export default function AdminContentPage() {
  return <AdminContent />;
}