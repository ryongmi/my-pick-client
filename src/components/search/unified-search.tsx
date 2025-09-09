'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Eye, 
  User, 
  Heart, 
  Bookmark,
  Share2,
  MoreVertical,
  Calendar,
  Tag,
  Search,
  Youtube,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatNumber, formatDate, formatDuration } from '@/lib/utils';

interface SearchResult {
  type: 'video' | 'creator' | 'category';
  id: string;
  title: string;
  description?: string;
  thumbnail: string;
  creator?: {
    id: string;
    name: string;
    displayName: string;
    verified?: boolean;
  };
  metadata: {
    viewCount?: number;
    subscriberCount?: number;
    videoCount?: number;
    duration?: number;
    publishedAt?: string;
    category?: string;
    tags?: string[];
    platform?: 'youtube' | 'twitch' | 'niconico';
  };
  relevanceScore: number;
  matchType: 'title' | 'description' | 'tags' | 'creator' | 'category';
}

interface UnifiedSearchProps {
  query: string;
  searchType: 'all' | 'videos' | 'creators' | 'categories';
}

// Mock 검색 결과 데이터
const MOCK_SEARCH_RESULTS: SearchResult[] = [
  {
    type: 'video',
    id: '1',
    title: '【歌ってみた】새로운 커버곡 / Ado',
    description: '오늘은 특별한 커버곡을 준비했어요! 많은 분들이 요청해주신 곡인데요...',
    thumbnail: '',
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
      verified: true,
    },
    metadata: {
      viewCount: 520000,
      duration: 263,
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      category: '음악',
      tags: ['Cover', '음악', 'J-Pop'],
      platform: 'youtube',
    },
    relevanceScore: 95,
    matchType: 'title',
  },
  {
    type: 'creator',
    id: 'ado',
    title: 'Ado',
    description: '日本のシンガー。映画『ONE PIECE FILM RED』でウタの歌声を担당。',
    thumbnail: '',
    metadata: {
      subscriberCount: 7200000,
      videoCount: 156,
      category: '음악',
    },
    relevanceScore: 92,
    matchType: 'creator',
  },
  {
    type: 'video',
    id: '2',
    title: '【검증】1000만원의 〇〇 사봤다!',
    description: '안녕하세요! 히카킨입니다! 오늘은 무려 1000만원의 최고급 아이템을...',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
      verified: true,
    },
    metadata: {
      viewCount: 1200000,
      duration: 525,
      publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      category: '엔터테인먼트',
      tags: ['검증', '리뷰', '언박싱'],
      platform: 'youtube',
    },
    relevanceScore: 88,
    matchType: 'description',
  },
  {
    type: 'video',
    id: '3',
    title: '【Live】특별 라이브 방송! 새로운 곡 공개',
    description: '팬들과 함께하는 특별한 라이브 방송입니다.',
    thumbnail: '',
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
      verified: true,
    },
    metadata: {
      viewCount: 340000,
      duration: 2712,
      publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      category: '음악',
      tags: ['라이브', '신곡', '팬미팅'],
      platform: 'youtube',
    },
    relevanceScore: 85,
    matchType: 'tags',
  },
  {
    type: 'creator',
    id: 'hikakin',
    title: '히카킨',
    description: '일본의 대표적인 유튜버. 다양한 상품 리뷰, 챌린지, 엔터테인먼트 콘텐츠를 제작합니다.',
    thumbnail: '',
    metadata: {
      subscriberCount: 5400000,
      videoCount: 3200,
      category: '엔터테인먼트',
    },
    relevanceScore: 82,
    matchType: 'creator',
  },
  {
    type: 'category',
    id: 'music',
    title: '음악',
    description: '다양한 음악 콘텐츠를 만나보세요',
    thumbnail: '',
    metadata: {
      videoCount: 1250,
      category: '음악',
    },
    relevanceScore: 78,
    matchType: 'category',
  },
];

export function UnifiedSearch({ query, searchType }: UnifiedSearchProps): JSX.Element {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'views' | 'duration'>('relevance');
  const [isLoading, setIsLoading] = useState(true);

  // 검색 결과 필터링 및 정렬
  const filteredAndSortedResults = useMemo(() => {
    let filtered = [...results];

    // 타입 필터
    if (searchType !== 'all') {
      const typeMap = {
        videos: 'video',
        creators: 'creator', 
        categories: 'category',
      };
      filtered = filtered.filter(result => result.type === typeMap[searchType]);
    }

    // 검색어 필터링 (더 정교한 매칭)
    const queryLower = query.toLowerCase();
    filtered = filtered.filter(result => {
      return (
        result.title.toLowerCase().includes(queryLower) ||
        result.description?.toLowerCase().includes(queryLower) ||
        result.metadata.tags?.some(tag => tag.toLowerCase().includes(queryLower)) ||
        result.creator?.displayName.toLowerCase().includes(queryLower) ||
        result.metadata.category?.toLowerCase().includes(queryLower)
      );
    });

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.relevanceScore - a.relevanceScore;
        case 'date':
          if (a.metadata.publishedAt && b.metadata.publishedAt) {
            return new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime();
          }
          return 0;
        case 'views':
          return (b.metadata.viewCount || 0) - (a.metadata.viewCount || 0);
        case 'duration':
          return (b.metadata.duration || 0) - (a.metadata.duration || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [results, searchType, query, sortBy]);

  useEffect(() => {
    // 검색 API 호출 시뮬레이션
    setIsLoading(true);
    setTimeout(() => {
      setResults(MOCK_SEARCH_RESULTS);
      setIsLoading(false);
    }, 800);
  }, [query, searchType]);

  const getCreatorColor = (creatorId: string): string => {
    const colors = {
      ado: 'from-purple-400 to-pink-500',
      hikakin: 'from-blue-400 to-cyan-500',
      kuzuha: 'from-green-400 to-teal-500',
    };
    return colors[creatorId as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const getMatchTypeBadge = (matchType: SearchResult['matchType']): JSX.Element | null => {
    switch (matchType) {
      case 'title':
        return <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">제목 일치</Badge>;
      case 'description':
        return <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">설명 일치</Badge>;
      case 'tags':
        return <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">태그 일치</Badge>;
      case 'creator':
        return <Badge variant="secondary" className="text-xs bg-orange-50 text-orange-700">크리에이터</Badge>;
      case 'category':
        return <Badge variant="secondary" className="text-xs bg-pink-50 text-pink-700">카테고리</Badge>;
      default:
        return null;
    }
  };

  // 비디오 결과 컴포넌트
  const VideoResult = ({ result }: { result: SearchResult }): JSX.Element => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* 썸네일 */}
          <Link href={`/video/${result.id}`} className="block">
            <div className="relative w-48 h-28 flex-shrink-0 rounded overflow-hidden group">
              <div className={cn(
                "w-full h-full bg-gradient-to-br flex items-center justify-center group-hover:scale-105 transition-transform",
                result.creator ? getCreatorColor(result.creator.id) : 'from-gray-400 to-gray-600'
              )}>
                <Play className="h-8 w-8 text-white" />
              </div>
              
              {result.metadata.duration ? <div className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {formatDuration(result.metadata.duration)}
                </div> : null}
              
              {result.metadata.platform ? <div className="absolute top-2 left-2">
                  <Youtube className="h-4 w-4 text-red-500" />
                </div> : null}
            </div>
          </Link>

          {/* 콘텐츠 정보 */}
          <div className="flex-1 min-w-0">
            <Link href={`/video/${result.id}`}>
              <h3 className="font-medium text-lg line-clamp-2 mb-2 hover:text-primary transition-colors">
                {result.title}
              </h3>
            </Link>
            
            <div className="flex items-center gap-2 mb-2">
              {result.creator ? <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                    `bg-gradient-to-r ${getCreatorColor(result.creator.id)}`
                  )}>
                    {result.creator.displayName.charAt(0)}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {result.creator.displayName}
                  </span>
                  {result.creator.verified ? <CheckCircle2 className="h-4 w-4 text-blue-500" /> : null}
                </div> : null}
              {getMatchTypeBadge(result.matchType)}
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {result.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              {result.metadata.viewCount ? <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(result.metadata.viewCount)}회 시청</span>
                </div> : null}
              {result.metadata.publishedAt ? <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(result.metadata.publishedAt, 'relative')}</span>
                </div> : null}
              {result.metadata.category ? <Badge variant="outline" className="text-xs">
                  {result.metadata.category}
                </Badge> : null}
            </div>
            
            {/* 태그 */}
            {result.metadata.tags && result.metadata.tags.length > 0 ? <div className="flex flex-wrap gap-1">
                {result.metadata.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
              </div> : null}
          </div>

          {/* 액션 메뉴 */}
          <div className="flex items-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Heart className="h-4 w-4 mr-2" />
                  좋아요
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="h-4 w-4 mr-2" />
                  북마크
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 크리에이터 결과 컴포넌트
  const CreatorResult = ({ result }: { result: SearchResult }): JSX.Element => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex gap-4 items-center">
          <div className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
            `bg-gradient-to-br from-purple-400 to-pink-500`
          )}>
            {result.title.charAt(0)}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{result.title}</h3>
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
              {getMatchTypeBadge(result.matchType)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {result.description}
            </p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {result.metadata.subscriberCount ? <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>구독자 {formatNumber(result.metadata.subscriberCount)}명</span>
                </div> : null}
              {result.metadata.videoCount ? <div className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  <span>영상 {formatNumber(result.metadata.videoCount)}개</span>
                </div> : null}
              {result.metadata.category ? <Badge variant="outline" className="text-xs">
                  {result.metadata.category}
                </Badge> : null}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm">구독</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Share2 className="h-4 w-4 mr-2" />
                  공유
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // 카테고리 결과 컴포넌트
  const CategoryResult = ({ result }: { result: SearchResult }): JSX.Element => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
            <Tag className="h-6 w-6 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{result.title}</h3>
              {getMatchTypeBadge(result.matchType)}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">
              {result.description}
            </p>
            
            {result.metadata.videoCount ? <div className="text-sm text-muted-foreground">
                {formatNumber(result.metadata.videoCount)}개의 영상
              </div> : null}
          </div>
          
          <Button size="sm" variant="outline">
            카테고리 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const LoadingSkeleton = (): JSX.Element => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-48 h-28 bg-gray-200 rounded"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (filteredAndSortedResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">검색 결과가 없습니다</h3>
        <p className="text-muted-foreground mb-4">
          다른 검색어를 시도해보세요.
        </p>
        <div className="flex justify-center gap-2 text-sm text-muted-foreground">
          <span>추천:</span>
          <button className="text-primary hover:underline">음악</button>
          <span>•</span>
          <button className="text-primary hover:underline">Ado</button>
          <span>•</span>
          <button className="text-primary hover:underline">커버</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 정렬 옵션 */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {filteredAndSortedResults.length}개 결과
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">정렬:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'relevance' | 'date' | 'views' | 'duration')}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            <option value="relevance">관련도순</option>
            <option value="date">최신순</option>
            <option value="views">조회수순</option>
            <option value="duration">길이순</option>
          </select>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="space-y-4">
        {filteredAndSortedResults.map((result) => {
          switch (result.type) {
            case 'video':
              return <VideoResult key={result.id} result={result} />;
            case 'creator':
              return <CreatorResult key={result.id} result={result} />;
            case 'category':
              return <CategoryResult key={result.id} result={result} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}