'use client';

import { ProfileView } from '@/components/main/dashboard/profile-view';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function ProfilePage(): JSX.Element {
  useDocumentTitle('프로필');
  return (
    <div className="p-6">
      <ProfileView />
    </div>
  );
}