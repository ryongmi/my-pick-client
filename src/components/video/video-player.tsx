'use client';

import { useState, useEffect } from 'react';
import { Loader2, Play, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoId: string;
  autoplay?: boolean;
}

export function VideoPlayer({ videoId, autoplay = false }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // YouTube 비디오 ID 추출 (URL에서 ID만 추출)
  const extractVideoId = (id: string) => {
    // 이미 ID 형태인 경우
    if (id.length === 11 && !/[\/\?]/.test(id)) {
      return id;
    }
    
    // YouTube URL에서 ID 추출
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/
    ];
    
    for (const pattern of patterns) {
      const match = id.match(pattern);
      if (match) {
        return match[1];
      }
    }
    
    return id; // 추출 실패 시 원본 반환
  };

  const youtubeVideoId = extractVideoId(videoId);
  
  const embedUrl = `https://www.youtube.com/embed/${youtubeVideoId}?${new URLSearchParams({
    autoplay: autoplay ? '1' : '0',
    rel: '0',
    modestbranding: '1',
    fs: '1',
    cc_load_policy: '0',
    iv_load_policy: '3',
    autohide: '0'
  }).toString()}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // iframe을 다시 로드하기 위해 key를 변경
    window.location.reload();
  };

  return (
    <Card className="overflow-hidden">
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        {/* 로딩 상태 */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">동영상을 불러오는 중...</p>
            </div>
          </div>
        )}

        {/* 에러 상태 */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center p-6">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                동영상을 불러올 수 없습니다
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                네트워크 연결을 확인하거나 잠시 후 다시 시도해주세요.
              </p>
              <Button onClick={handleRetry} variant="outline" size="sm">
                다시 시도
              </Button>
            </div>
          </div>
        )}

        {/* 재생 전 썸네일 (자동재생이 아닌 경우) */}
        {!autoplay && !isPlaying && !isLoading && !hasError && (
          <div 
            className="absolute inset-0 bg-black flex items-center justify-center cursor-pointer group"
            onClick={handlePlayClick}
            style={{
              backgroundImage: `url(https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="relative z-10 bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors">
              <Play className="h-8 w-8 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* YouTube iframe */}
        {(isPlaying || autoplay) && (
          <iframe
            className={cn(
              "absolute inset-0 w-full h-full",
              isLoading && "opacity-0"
            )}
            src={embedUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        )}
      </div>
    </Card>
  );
}