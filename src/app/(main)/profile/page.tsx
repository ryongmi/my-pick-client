import type { Metadata } from 'next';
import { ProfileView } from '@/components/dashboard/profile-view';

export const metadata: Metadata = {
  title: 'MyPick 프로필',
  description: '프로필 및 계정 설정',
};

export default function ProfilePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          프로필
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          프로필 정보 및 계정 설정 관리
        </p>
      </div>
      <ProfileView />
    </div>
  );
}