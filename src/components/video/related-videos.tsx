'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Eye, Clock, Youtube } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn, formatNumber, formatDate } from '@/lib/utils';

interface RelatedVideosProps {
  currentVideoId: string;
}

// Mock 관련 영상 데이터
const MOCK_RELATED_VIDEOS = [
  {
    id: '3',
    title: '【Live】특별 라이브 방송! 새로운 곡 공개',
    thumbnail: '',
    creator: {
      id: 'ado',
      displayName: 'Ado',
    },
    viewCount: 340000,
    duration: '45:12',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
  {
    id: '4',
    title: '【Q&A】팬들의 질문에 답해드려요!',
    thumbnail: '',
    creator: {
      id: 'ado',
      displayName: 'Ado',
    },
    viewCount: 680000,
    duration: '23:45',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
  {
    id: '5',
    title: '【Vlog】스튜디오에서의 하루',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      displayName: '히카킨',
    },
    viewCount: 920000,
    duration: '12:30',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
  {
    id: '6',
    title: '【리뷰】새로운 음향 장비 테스트!',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      displayName: '히카킨',
    },
    viewCount: 450000,
    duration: '18:22',
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
  {
    id: '7',
    title: '【커버】인기 K-Pop 메들리',
    thumbnail: '',
    creator: {
      id: 'ado',
      displayName: 'Ado',
    },
    viewCount: 1200000,
    duration: '25:18',
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
  {
    id: '8',
    title: '【기획】팬들과 함께하는 특별 이벤트',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      displayName: '히카킨',
    },
    viewCount: 780000,
    duration: '31:45',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
  },
];

export function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const [relatedVideos, setRelatedVideos] = useState(MOCK_RELATED_VIDEOS);

  useEffect(() => {
    // 현재 비디오 제외하고 관련 영상 필터링
    const filtered = MOCK_RELATED_VIDEOS.filter(video => video.id !== currentVideoId);
    setRelatedVideos(filtered);
  }, [currentVideoId]);

  const VideoCard = ({ video }: { video: typeof MOCK_RELATED_VIDEOS[0] }) => (
    <Link href={`/video/${video.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer group">
        <div className="flex gap-3 p-3">
          {/* 썸네일 */}
          <div className="relative w-24 h-16 sm:w-32 sm:h-18 flex-shrink-0 rounded overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-xs px-1 rounded">
              {video.duration}
            </div>
          </div>

          {/* 비디오 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
              {video.title}
            </h3>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                {video.creator.displayName}
              </p>
              
              <div className="flex items-center text-xs text-muted-foreground space-x-2">
                <div className="flex items-center">
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">{formatNumber(video.viewCount)}</span>
                  <span className="sm:hidden">{formatNumber(video.viewCount, true)}</span>
                </div>
                <span>•</span>
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDate(video.publishedAt, 'relative')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Youtube className="h-5 w-5 text-red-500" />
          관련 영상
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {relatedVideos.length > 0 ? (
          relatedVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              관련 영상이 없습니다.
            </p>
          </div>
        )}
        
        {/* 더 많은 영상 보기 */}
        {relatedVideos.length > 0 && (
          <div className="pt-3 border-t">
            <Link href="/" className="block">
              <div className="text-center py-3 text-sm text-primary hover:text-primary/80 transition-colors">
                더 많은 영상 보기 →
              </div>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}