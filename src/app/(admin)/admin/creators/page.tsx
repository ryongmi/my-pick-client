import type { Metadata } from 'next';
import { AdminCreators } from '@/components/admin/admin-creators';

export const metadata: Metadata = {
  title: 'MyPick 크리에이터 관리',
  description: '등록된 크리에이터와 채널 정보를 관리하세요',
};

export default function AdminCreatorsPage() {
  return <AdminCreators />;
}