import type { Metadata } from 'next';
import { AdminPlatforms } from '@/components/admin/admin-platforms';

export const metadata: Metadata = {
  title: 'MyPick 플랫폼 관리',
  description: '애플리케이션에서 사용할 플랫폼을 관리하세요',
};

export default function AdminPlatformsPage() {
  return <AdminPlatforms />;
}