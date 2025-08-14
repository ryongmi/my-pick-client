'use client';

import { AdminPlatforms } from '@/components/admin/admin-platforms';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function AdminPlatformsPage() {
  useDocumentTitle('플랫폼 관리');
  return <AdminPlatforms />;
}