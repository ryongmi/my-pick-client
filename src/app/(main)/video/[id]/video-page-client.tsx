'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Share2, MoreHorizontal } from 'lucide-react';
import { VideoPlayer } from '@/components/video/video-player';
import { VideoInfo } from '@/components/video/video-info';
import { CreatorPanel } from '@/components/video/creator-panel';
import { RelatedVideos } from '@/components/video/related-videos';
import { Button } from '@/components/ui/button';

interface VideoPageClientProps {
  videoId: string;
  creatorId: string;
}

export function VideoPageClient({ videoId, creatorId }: VideoPageClientProps): JSX.Element {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  useEffect(() => {
    // 페이지 로드 시 스크롤을 맨 위로
    window.scrollTo(0, 0);
    
    // 페이지 타이틀 설정
    document.title = `비디오 상세 - MyPick`;
    
    // 뒤로가기 감지
    const handlePopState = (): void => {
      // 브라우저 뒤로가기 처리
    };
    
    window.addEventListener('popstate', handlePopState);
    return (): void => window.removeEventListener('popstate', handlePopState);
  }, [videoId]);

  const handleGoBack = (): void => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: '비디오 상세 - MyPick',
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: 토스트 메시지 표시
    }
  };

  const handleTheaterModeToggle = (): void => {
    setIsTheaterMode(!isTheaterMode);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 상단 네비게이션 바 (모바일) */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b lg:hidden">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto p-4 lg:p-6">
        {/* 데스크톱용 뒤로가기 버튼 */}
        <div className="hidden lg:block mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            뒤로가기
          </Button>
        </div>

        <div className={`grid gap-4 lg:gap-6 transition-all duration-300 ${
          isTheaterMode 
            ? 'grid-cols-1' 
            : sidebarCollapsed 
              ? 'grid-cols-1 xl:grid-cols-6' 
              : 'grid-cols-1 xl:grid-cols-12'
        }`}>
          {/* 메인 비디오 영역 */}
          <div className={`${
            isTheaterMode 
              ? 'col-span-1' 
              : sidebarCollapsed 
                ? 'xl:col-span-5' 
                : 'xl:col-span-8'
          }`}>
            <div className="space-y-4 lg:space-y-6">
              {/* 비디오 플레이어 */}
              <div className="relative">
                <VideoPlayer videoId={videoId} />
                
                {/* 극장 모드 토글 버튼 */}
                <div className="absolute top-4 right-4 hidden lg:block">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleTheaterModeToggle}
                    className="bg-black/50 hover:bg-black/70 text-white"
                  >
                    {isTheaterMode ? '일반 모드' : '극장 모드'}
                  </Button>
                </div>
              </div>
              
              {/* 비디오 정보 */}
              <VideoInfo videoId={videoId} />
              
              {/* 극장 모드일 때만 관련 영상 하단에 표시 */}
              {isTheaterMode ? <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">관련 영상</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <RelatedVideos currentVideoId={videoId} />
                  </div>
                </div> : null}
            </div>
          </div>

          {/* 우측 사이드바 (극장 모드가 아닐 때만) */}
          {!isTheaterMode && (
            <div className={`${
              sidebarCollapsed ? 'xl:col-span-1' : 'xl:col-span-4'
            }`}>
              <div className="space-y-4">
                {/* 사이드바 접기/펼치기 버튼 */}
                <div className="hidden xl:flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  >
                    {sidebarCollapsed ? '펼치기' : '접기'}
                  </Button>
                </div>

                {!sidebarCollapsed && (
                  <>
                    {/* 크리에이터 패널 */}
                    <div className="sticky top-4">
                      <CreatorPanel 
                        creatorId={creatorId}
                        currentVideoId={videoId}
                      />
                    </div>
                    
                    {/* 관련 영상 */}
                    <div className="lg:hidden xl:block">
                      <RelatedVideos currentVideoId={videoId} />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 모바일/태블릿용 관련 영상 (하단) - 극장 모드가 아닐 때만 */}
          {!isTheaterMode && (
            <div className="xl:hidden col-span-full">
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">관련 영상</h2>
                <RelatedVideos currentVideoId={videoId} />
              </div>
            </div>
          )}
        </div>

        {/* 플로팅 액션 버튼 (모바일) */}
        <div className="fixed bottom-6 right-6 lg:hidden">
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={handleShare}
              className="rounded-full w-12 h-12 shadow-lg"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}