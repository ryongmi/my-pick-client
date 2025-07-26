import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { VideoPlayer } from '@/components/video/video-player';
import { VideoInfo } from '@/components/video/video-info';
import { RelatedVideos } from '@/components/video/related-videos';

interface VideoPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  // TODO: 실제 API에서 비디오 정보 가져오기
  return {
    title: `비디오 상세 - MyPick`,
    description: '크리에이터 콘텐츠를 시청하세요',
  };
}

export default function VideoPage({ params }: VideoPageProps) {
  const { id } = params;

  if (!id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8">
          {/* 메인 비디오 영역 */}
          <div className="lg:col-span-7">
            <div className="space-y-4 lg:space-y-6">
              {/* 비디오 플레이어 */}
              <VideoPlayer videoId={id} />
              
              {/* 비디오 정보 */}
              <VideoInfo videoId={id} />
            </div>
          </div>

          {/* 우측 사이드바 - 관련 영상 (모바일에서는 하단) */}
          <div className="lg:col-span-3 order-last lg:order-none">
            <div className="sticky top-4">
              <RelatedVideos currentVideoId={id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}