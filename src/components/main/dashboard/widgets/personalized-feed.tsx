'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, Eye, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PersonalizedContent {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
    avatar?: string;
  };
  thumbnail: string;
  duration: string;
  viewCount: number;
  publishedAt: string;
  isLive?: boolean;
  reason?: string; // Why this content was recommended
}

export interface PersonalizedFeedProps {
  limit?: number;
  showReason?: boolean;
}

export function PersonalizedFeed({ limit = 4, showReason = true }: PersonalizedFeedProps): JSX.Element {
  const [contents, setContents] = useState<PersonalizedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock personalized content - in real app, this would come from API
  useEffect(() => {
    const mockContents: PersonalizedContent[] = [
      {
        id: '1',
        title: '【歌ってみた】새로운 커버곡 - 감정 가득한 노래',
        creator: {
          id: 'ado',
          name: 'Ado',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: '4:23',
        viewCount: 1250000,
        publishedAt: '2시간 전',
        reason: '자주 시청하는 크리에이터',
      },
      {
        id: '2',
        title: '【검증】1000만원의 〇〇 사봤다! 과연 그 가치는?',
        creator: {
          id: 'hikakin',
          name: 'HikakinTV',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: '15:42',
        viewCount: 2800000,
        publishedAt: '5시간 전',
        reason: '비슷한 관심사',
      },
      {
        id: '3',
        title: '【LIVE】오늘은 뭘 할까요? 여러분과 함께!',
        creator: {
          id: 'kuzuha',
          name: 'Kuzuha',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: 'LIVE',
        viewCount: 45000,
        publishedAt: '진행 중',
        isLive: true,
        reason: '팔로우 중인 크리에이터',
      },
      {
        id: '4',
        title: '오늘의 게임 스트리밍 - 신작 게임 체험해보기',
        creator: {
          id: 'streamer',
          name: 'GameStreamer',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: '12:35',
        viewCount: 890000,
        publishedAt: '1일 전',
        reason: '즐겨보는 카테고리',
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setContents(mockContents.slice(0, limit));
      setIsLoading(false);
    }, 1000);
  }, [limit]);

  const formatViewCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const getCreatorColor = (creatorId: string): string => {
    const colors = {
      ado: 'from-pink-400 to-purple-500',
      hikakin: 'from-blue-400 to-cyan-500',
      kuzuha: 'from-green-400 to-teal-500',
      streamer: 'from-orange-400 to-red-500',
    };
    return colors[creatorId as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="flex space-x-3 animate-pulse">
            <div className="w-20 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">맞춤 추천</h4>
        <Button variant="ghost" size="sm" className="text-xs">
          더보기 <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {contents.map((content) => (
          <div
            key={content.id}
            className="flex space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative w-20 h-12 flex-shrink-0">
              <div className={cn(
                "w-full h-full rounded bg-gradient-to-br flex items-center justify-center",
                content.isLive ? "from-red-500 to-red-600" : "from-purple-400 to-pink-500"
              )}>
                <Play className="h-4 w-4 text-white" />
              </div>
              
              {/* Duration/Live badge */}
              {content.isLive ? (
                <div className="absolute bottom-1 right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                  LIVE
                </div>
              ) : (
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                  {content.duration}
                </div>
              )}
            </div>

            {/* Content Info */}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary">
                {content.title}
              </h5>
              
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                <div className="flex items-center">
                  <div className={cn(
                    "w-3 h-3 rounded-full mr-1.5 flex items-center justify-center text-white text-xs font-bold",
                    `bg-gradient-to-r ${getCreatorColor(content.creator.id)}`
                  )}>
                    {content.creator.name.charAt(0)}
                  </div>
                  <span className="font-medium">{content.creator.name}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                {content.isLive ? (
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1 animate-pulse"></div>
                    <span>{formatViewCount(content.viewCount)}명 시청 중</span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{formatViewCount(content.viewCount)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{content.publishedAt}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Recommendation Reason */}
              {showReason && content.reason ? <div className="mt-1">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    <Star className="w-2.5 h-2.5 inline mr-1" />
                    {content.reason}
                  </span>
                </div> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}