'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Eye, Clock, Youtube, Star, TrendingUp, Heart, Bookmark, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useAppSelector } from '@/hooks/redux';
import { cn, formatNumber, formatDate } from '@/lib/utils';

interface RelatedVideosProps {
  currentVideoId: string;
}

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    displayName: string;
  };
  viewCount: number;
  duration: string;
  publishedAt: string;
  platform: 'youtube' | 'twitch' | 'niconico';
  category?: string;
  tags?: string[];
  engagementScore?: number;
  recommendationType?: 'same_creator' | 'similar_content' | 'trending' | 'personalized' | 'recently_watched';
}

// Mock 관련 영상 데이터 (개선된 버전)
const MOCK_RELATED_VIDEOS: Video[] = [
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
    category: '음악',
    tags: ['라이브', '신곡', 'J-Pop'],
    engagementScore: 9.2,
    recommendationType: 'same_creator',
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
    category: '소통',
    tags: ['Q&A', '팬미팅', 'Ado'],
    engagementScore: 8.7,
    recommendationType: 'same_creator',
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
    category: 'Vlog',
    tags: ['일상', '스튜디오', '브이로그'],
    engagementScore: 8.4,
    recommendationType: 'personalized',
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
    category: '리뷰',
    tags: ['음향', '장비', '테스트'],
    engagementScore: 7.9,
    recommendationType: 'similar_content',
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
    category: '음악',
    tags: ['K-Pop', '메들리', 'Cover'],
    engagementScore: 9.5,
    recommendationType: 'trending',
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
    category: '이벤트',
    tags: ['팬이벤트', '특별기획', '소통'],
    engagementScore: 8.8,
    recommendationType: 'recently_watched',
  },
  {
    id: '9',
    title: '【신곡】감정이 담긴 새로운 오리지널 곡',
    thumbnail: '',
    creator: {
      id: 'ado',
      displayName: 'Ado',
    },
    viewCount: 2800000,
    duration: '4:12',
    publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
    category: '음악',
    tags: ['신곡', '오리지널', '감성'],
    engagementScore: 9.8,
    recommendationType: 'trending',
  },
  {
    id: '10',
    title: '【콜라보】유명 아티스트와의 특별 콜라보',
    thumbnail: '',
    creator: {
      id: 'ado',
      displayName: 'Ado',
    },
    viewCount: 1800000,
    duration: '5:45',
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    platform: 'youtube' as const,
    category: '음악',
    tags: ['콜라보', '듀엣', '특별'],
    engagementScore: 9.3,
    recommendationType: 'similar_content',
  },
];

export function RelatedVideos({ currentVideoId }: RelatedVideosProps) {
  const { followedCreators } = useAppSelector(state => state.creator);
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending' | 'same_creator'>('personalized');
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 개인화된 추천 알고리즘
  const getPersonalizedVideos = (videos: Video[], currentId: string): Video[] => {
    const filtered = videos.filter(video => video.id !== currentId);
    
    // 점수 기반 정렬
    const scored = filtered.map(video => {
      let score = video.engagementScore || 0;
      
      // 구독 중인 크리에이터 보너스
      if (followedCreators.some(creator => creator.id === video.creator.id)) {
        score += 2;
      }
      
      // 최신성 보너스
      const daysAgo = Math.floor((Date.now() - new Date(video.publishedAt).getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo <= 3) {score += 1.5;}
      else if (daysAgo <= 7) {score += 1;}
      else if (daysAgo <= 14) {score += 0.5;}
      
      // 조회수 보너스
      if (video.viewCount > 1000000) {score += 1;}
      else if (video.viewCount > 500000) {score += 0.5;}
      
      return { ...video, personalizedScore: score };
    });
    
    return scored
      .sort((a, b) => b.personalizedScore - a.personalizedScore)
      .slice(0, 6);
  };

  // 트렌딩 비디오 필터링
  const getTrendingVideos = (videos: Video[], currentId: string): Video[] => {
    return videos
      .filter(video => video.id !== currentId)
      .filter(video => video.recommendationType === 'trending' || video.viewCount > 800000)
      .sort((a, b) => {
        const aScore = (a.engagementScore || 0) + (a.viewCount / 100000);
        const bScore = (b.engagementScore || 0) + (b.viewCount / 100000);
        return bScore - aScore;
      })
      .slice(0, 6);
  };

  // 같은 크리에이터 비디오 필터링
  const getSameCreatorVideos = (videos: Video[], currentId: string): Video[] => {
    // 현재 비디오의 크리에이터 찾기
    const currentVideo = videos.find(v => v.id === currentId);
    if (!currentVideo) {return [];}
    
    return videos
      .filter(video => 
        video.id !== currentId && 
        video.creator.id === currentVideo.creator.id
      )
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
  };

  // 추천 타입에 따라 비디오 필터링
  const getFilteredVideos = (type: typeof activeTab): Video[] => {
    switch (type) {
      case 'personalized':
        return getPersonalizedVideos(MOCK_RELATED_VIDEOS, currentVideoId);
      case 'trending':
        return getTrendingVideos(MOCK_RELATED_VIDEOS, currentVideoId);
      case 'same_creator':
        return getSameCreatorVideos(MOCK_RELATED_VIDEOS, currentVideoId);
      default:
        return [];
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      const filtered = getFilteredVideos(activeTab);
      setRelatedVideos(filtered);
      setIsLoading(false);
    }, 300);
  }, [currentVideoId, activeTab, followedCreators]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      const filtered = getFilteredVideos(activeTab);
      setRelatedVideos(filtered);
      setIsLoading(false);
    }, 500);
  };

  const getRecommendationBadge = (type: Video['recommendationType']) => {
    switch (type) {
      case 'same_creator':
        return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">같은 크리에이터</Badge>;
      case 'trending':
        return <Badge variant="outline" className="text-xs bg-red-50 text-red-700">트렌딩</Badge>;
      case 'personalized':
        return <Badge variant="outline" className="text-xs bg-green-50 text-green-700">맞춤 추천</Badge>;
      case 'similar_content':
        return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">유사 콘텐츠</Badge>;
      case 'recently_watched':
        return <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">최근 시청</Badge>;
      default:
        return null;
    }
  };

  const VideoCard = ({ video }: { video: Video }) => {
    const creatorColors = {
      ado: 'from-purple-400 to-pink-500',
      hikakin: 'from-blue-400 to-cyan-500',
    };
    
    const colorClass = creatorColors[video.creator.id as keyof typeof creatorColors] || 'from-gray-400 to-gray-600';
    
    return (
      <Link href={`/video/${video.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer group">
          <div className="flex gap-3 p-3">
            {/* 썸네일 */}
            <div className="relative w-24 h-16 sm:w-28 sm:h-16 flex-shrink-0 rounded overflow-hidden">
              <div className={cn(
                "w-full h-full bg-gradient-to-br flex items-center justify-center group-hover:scale-105 transition-transform",
                colorClass
              )}>
                <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="absolute bottom-0.5 right-0.5 bg-black/75 text-white text-xs px-1 rounded">
                {video.duration}
              </div>
              
              {/* 참여도 표시 */}
              {video.engagementScore && video.engagementScore > 9 ? <div className="absolute top-0.5 left-0.5 bg-yellow-500 text-white text-xs px-1 rounded flex items-center">
                  <Star className="h-2 w-2 mr-0.5" />
                  HOT
                </div> : null}
            </div>

            {/* 비디오 정보 */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                {video.title}
              </h3>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground font-medium">
                    {video.creator.displayName}
                  </p>
                  {getRecommendationBadge(video.recommendationType)}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground space-x-2">
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    <span>{formatNumber(video.viewCount)}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(video.publishedAt, 'relative')}
                  </div>
                  {video.engagementScore ? <>
                      <span>•</span>
                      <div className="flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {video.engagementScore.toFixed(1)}
                      </div>
                    </> : null}
                </div>
                
                {/* 태그 */}
                {video.tags && video.tags.length > 0 ? <div className="flex flex-wrap gap-1 mt-1">
                    {video.tags.slice(0, 2).map((tag, index) => (
                      <span key={index} className="text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div> : null}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3 p-3 animate-pulse">
          <div className="w-24 h-16 sm:w-28 sm:h-16 bg-gray-200 rounded"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Youtube className="h-5 w-5 text-red-500" />
            관련 영상
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          </Button>
        </div>
        
        {/* 추천 탭 */}
        <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)} className="w-full mt-3">
          <TabsList className="grid w-full grid-cols-3 text-xs">
            <TabsTrigger value="personalized" className="text-xs flex items-center gap-1">
              <Star className="h-3 w-3" />
              맞춤
            </TabsTrigger>
            <TabsTrigger value="trending" className="text-xs flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              인기
            </TabsTrigger>
            <TabsTrigger value="same_creator" className="text-xs flex items-center gap-1">
              <Heart className="h-3 w-3" />
              채널
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <LoadingSkeleton />
        ) : relatedVideos.length > 0 ? (
          <div className="space-y-3">
            {relatedVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Youtube className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              관련 영상이 없습니다.
            </p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              다시 시도
            </Button>
          </div>
        )}
        
        {/* 더 많은 영상 보기 */}
        {relatedVideos.length > 0 && (
          <div className="pt-4 border-t mt-4">
            <Link href="/" className="block">
              <Button variant="ghost" className="w-full text-sm text-primary hover:text-primary/80">
                더 많은 영상 보기 →
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}