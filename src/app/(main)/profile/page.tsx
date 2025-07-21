import type { Metadata } from 'next';
import { ProfileView } from '@/components/dashboard/profile-view';

export const metadata: Metadata = {
  title: 'MyPick 프로필',
  description: '프로필 및 계정 설정',
};

export default function ProfilePage() {
  return (
    <div className="p-6">
      <ProfileView />
    </div>
  );
}