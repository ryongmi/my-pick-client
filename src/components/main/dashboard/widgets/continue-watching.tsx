'use client';

import { useState, useEffect } from 'react';
import { Play, Clock, ChevronRight, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface WatchProgress {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
  };
  thumbnail: string;
  duration: number; // in seconds
  watchedDuration: number; // in seconds
  lastWatchedAt: string;
  progress: number; // percentage (0-100)
}

export interface ContinueWatchingProps {
  limit?: number;
}

export function ContinueWatching({ limit = 3 }: ContinueWatchingProps) {
  const [watchList, setWatchList] = useState<WatchProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock continue watching data
  useEffect(() => {
    const mockWatchList: WatchProgress[] = [
      {
        id: '1',
        title: '【검증】1000만원의 〇〇 사봤다! 과연 그 가치는?',
        creator: {
          id: 'hikakin',
          name: 'HikakinTV',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: 942, // 15:42
        watchedDuration: 450, // 7:30
        lastWatchedAt: '2시간 전',
        progress: 47.8,
      },
      {
        id: '2',
        title: '【歌ってみた】새로운 커버곡 - 감정 가득한 노래',
        creator: {
          id: 'ado',
          name: 'Ado',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: 263, // 4:23
        watchedDuration: 125, // 2:05
        lastWatchedAt: '어제',
        progress: 47.5,
      },
      {
        id: '3',
        title: '오늘의 게임 스트리밍 - 신작 게임 체험해보기',
        creator: {
          id: 'streamer',
          name: 'GameStreamer',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: 755, // 12:35
        watchedDuration: 580, // 9:40
        lastWatchedAt: '3일 전',
        progress: 76.8,
      },
      {
        id: '4',
        title: '【리뷰】최신 기술 가젯 언박싱 & 첫 인상',
        creator: {
          id: 'tech',
          name: 'TechReviewer',
        },
        thumbnail: '/api/placeholder/320/180',
        duration: 1120, // 18:40
        watchedDuration: 280, // 4:40
        lastWatchedAt: '1주일 전',
        progress: 25.0,
      },
    ];

    // Simulate API call
    setTimeout(() => {
      setWatchList(mockWatchList.slice(0, limit));
      setIsLoading(false);
    }, 800);
  }, [limit]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCreatorColor = (creatorId: string) => {
    const colors = {
      ado: 'from-pink-400 to-purple-500',
      hikakin: 'from-blue-400 to-cyan-500',
      streamer: 'from-orange-400 to-red-500',
      tech: 'from-green-400 to-teal-500',
    };
    return colors[creatorId as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const handleContinueWatching = (item: WatchProgress) => {
    // In real app, this would navigate to video with timestamp
    console.log(`Continue watching ${item.title} from ${formatDuration(item.watchedDuration)}`);
  };

  const handleRemoveFromList = (itemId: string) => {
    setWatchList(prev => prev.filter(item => item.id !== itemId));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="flex space-x-3">
              <div className="w-24 h-16 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
            <div className="h-1.5 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (watchList.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">시청 중인 영상이 없습니다</p>
        <p className="text-xs mt-1">영상을 보다가 중단한 경우 여기에 표시됩니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">이어서 시청하기</h4>
        <Button variant="ghost" size="sm" className="text-xs">
          전체보기 <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      <div className="space-y-4">
        {watchList.map((item) => (
          <div key={item.id} className="space-y-3">
            <div className="flex space-x-3 group">
              {/* Thumbnail with progress indicator */}
              <div className="relative w-24 h-16 flex-shrink-0">
                <div className={cn(
                  "w-full h-full rounded bg-gradient-to-br flex items-center justify-center cursor-pointer",
                  `bg-gradient-to-br ${getCreatorColor(item.creator.id)}`
                )}
                onClick={() => handleContinueWatching(item)}
                >
                  <Play className="h-6 w-6 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
                
                {/* Duration */}
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                  {formatDuration(item.duration)}
                </div>

                {/* Progress indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20 rounded-b">
                  <div 
                    className="h-full bg-red-600 rounded-b transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>

              {/* Content Info */}
              <div className="flex-1 min-w-0">
                <h5 
                  className="text-sm font-medium line-clamp-2 mb-1 cursor-pointer group-hover:text-primary transition-colors"
                  onClick={() => handleContinueWatching(item)}
                >
                  {item.title}
                </h5>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                  <div className="flex items-center">
                    <div className={cn(
                      "w-3 h-3 rounded-full mr-1.5 flex items-center justify-center text-white text-xs font-bold",
                      `bg-gradient-to-r ${getCreatorColor(item.creator.id)}`
                    )}>
                      {item.creator.name.charAt(0)}
                    </div>
                    <span>{item.creator.name}</span>
                  </div>
                  <span>•</span>
                  <span>{item.lastWatchedAt}</span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{formatDuration(item.watchedDuration)} / {formatDuration(item.duration)}</span>
                  <span>•</span>
                  <span>{Math.round(item.progress)}% 시청</span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFromList(item.id)}
                    className="ml-auto h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>진행률 {Math.round(item.progress)}%</span>
                <span>남은 시간: {formatDuration(item.duration - item.watchedDuration)}</span>
              </div>
              <Progress value={item.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}