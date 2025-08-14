'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { VideoPageClient } from './video-page-client';

// Mock 데이터에서 크리에이터 ID 매핑
const VIDEO_CREATOR_MAP: Record<string, string> = {
  '1': 'ado',
  '2': 'hikakin',
};

export default function VideoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) {
      router.push('/404');
    }
  }, [id, router]);

  if (!id) {
    return null; // 리디렉션 처리 중
  }

  const creatorId = VIDEO_CREATOR_MAP[id] || 'ado';

  return <VideoPageClient videoId={id} creatorId={creatorId} />;
}