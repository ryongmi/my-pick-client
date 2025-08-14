'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Play, Eye, Clock, Flame, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrendingContent {
  id: string;
  title: string;
  creator: {
    id: string;
    name: string;
  };
  thumbnail: string;
  viewCount: number;
  trendingRank: number;
  trendingScore: number; // 0-100
  publishedAt: string;
  duration: string;
  category: string;
  isHot?: boolean;
}

export interface TrendingHighlightProps {
  showCategory?: boolean;
  showRank?: boolean;
}

export function TrendingHighlight({ 
  showCategory = true, 
  showRank = true 
}: TrendingHighlightProps) {
  const [trendingContent, setTrendingContent] = useState<TrendingContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock trending content data
  useEffect(() => {
    const mockTrending: TrendingContent = {
      id: '1',
      title: '【독점 공개】충격적인 비하인드 스토리 대공개! 이것이 진실이다',
      creator: {
        id: 'trendy-creator',
        name: 'TrendyCreator',
      },
      thumbnail: '/api/placeholder/400/225',
      viewCount: 4200000,
      trendingRank: 1,
      trendingScore: 95,
      publishedAt: '6시간 전',
      duration: '18:24',
      category: '엔터테인먼트',
      isHot: true,
    };

    // Simulate API call
    setTimeout(() => {
      setTrendingContent(mockTrending);
      setIsLoading(false);
    }, 1200);
  }, []);

  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    }
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const getTrendingColor = (score: number) => {
    if (score >= 90) {return 'text-red-500';}
    if (score >= 70) {return 'text-orange-500';}
    if (score >= 50) {return 'text-yellow-500';}
    return 'text-green-500';
  };

  const getTrendingBadgeColor = (rank: number) => {
    if (rank === 1) {return 'bg-gradient-to-r from-yellow-400 to-orange-500';}
    if (rank <= 3) {return 'bg-gradient-to-r from-gray-300 to-gray-400';}
    if (rank <= 10) {return 'bg-gradient-to-r from-orange-300 to-red-400';}
    return 'bg-gradient-to-r from-gray-200 to-gray-300';
  };

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="space-y-3">
          <div className="w-full h-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="flex space-x-2">
              <div className="h-4 bg-gray-200 rounded w-16"></div>
              <div className="h-4 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!trendingContent) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-sm">트렌딩 콘텐츠를 불러올 수 없습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Flame className="h-4 w-4 text-orange-500" />
          <h4 className="text-sm font-medium text-muted-foreground">지금 뜨는 콘텐츠</h4>
          {trendingContent.isHot ? <Badge variant="destructive" className="text-xs animate-pulse">
              🔥 HOT
            </Badge> : null}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          트렌딩 <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>

      {/* Trending Content Card */}
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full h-32 group cursor-pointer">
          <div className="w-full h-full rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
            <Play className="h-8 w-8 text-white z-10 group-hover:scale-110 transition-transform" />
          </div>

          {/* Duration */}
          <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
            {trendingContent.duration}
          </div>

          {/* Trending Rank Badge */}
          {showRank ? <div className={cn(
              "absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-md font-bold flex items-center",
              getTrendingBadgeColor(trendingContent.trendingRank)
            )}>
              <TrendingUp className="h-3 w-3 mr-1" />
              #{trendingContent.trendingRank}
            </div> : null}

          {/* Trending Score */}
          <div className="absolute top-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded flex items-center">
            <Flame className={cn("h-3 w-3 mr-1", getTrendingColor(trendingContent.trendingScore))} />
            <span className={getTrendingColor(trendingContent.trendingScore)}>
              {trendingContent.trendingScore}
            </span>
          </div>
        </div>

        {/* Content Info */}
        <div className="space-y-2">
          <h5 className="font-medium text-sm line-clamp-2 hover:text-primary cursor-pointer transition-colors">
            {trendingContent.title}
          </h5>

          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 mr-2 flex items-center justify-center text-white text-xs font-bold">
                {trendingContent.creator.name.charAt(0)}
              </div>
              <span className="font-medium">{trendingContent.creator.name}</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Eye className="h-3 w-3 mr-1" />
                <span>{formatViewCount(trendingContent.viewCount)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{trendingContent.publishedAt}</span>
              </div>
            </div>
            
            {showCategory ? <Badge variant="outline" className="text-xs">
                {trendingContent.category}
              </Badge> : null}
          </div>

          {/* Trending Stats */}
          <div className="mt-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">트렌딩 점수</span>
              <span className={cn("font-medium", getTrendingColor(trendingContent.trendingScore))}>
                {trendingContent.trendingScore}/100
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mt-1">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  trendingContent.trendingScore >= 90 ? "bg-red-500" :
                  trendingContent.trendingScore >= 70 ? "bg-orange-500" :
                  trendingContent.trendingScore >= 50 ? "bg-yellow-500" : "bg-green-500"
                )}
                style={{ width: `${trendingContent.trendingScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}