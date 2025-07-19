'use client';

import { useState } from 'react';
import { Eye, Clock, Heart, Bookmark, Play, Youtube, Twitter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/redux';
import { useUI, useContent } from '@/hooks/redux';
import { setPlatformFilter, setSortBy } from '@/store/slices/uiSlice';
import { toggleBookmarkOptimistic, toggleLikeOptimistic } from '@/store/slices/contentSlice';
import { cn } from '@/lib/utils';
import { formatNumber, formatDate } from '@/lib/utils';

const MOCK_CONTENT = [
  {
    id: '1',
    title: '【歌ってみた】새로운 커버곡 / Ado',
    description: '오늘은 특별한 커버곡을 준비했어요! 많은 분들이 요청해주신 곡인데요...',
    thumbnail: '',
    platform: 'youtube' as const,
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
      avatar: '',
    },
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    viewCount: 520000,
    likeCount: 45000,
    duration: '15:23',
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '2',
    title: '今日はレコーディングでした！新しい曲もうすぐ完成します🎵',
    description: '',
    platform: 'twitter' as const,
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
      avatar: '',
    },
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    likeCount: 5800,
    isBookmarked: false,
    isLiked: false,
  },
  {
    id: '3',
    title: '【검증】1000만원의 〇〇 사봤다!',
    description: '안녕하세요! 히카킨입니다! 오늘은 무려 1000만원의...',
    thumbnail: '',
    platform: 'youtube' as const,
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
      avatar: '',
    },
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 1200000,
    likeCount: 89000,
    duration: '8:45',
    isBookmarked: false,
    isLiked: false,
  },
];

export function MainContent() {
  const dispatch = useAppDispatch();
  const { filters, sidebarOpen } = useUI();
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const handlePlatformFilter = (platform: string) => {
    setSelectedPlatform(platform);
    dispatch(setPlatformFilter([platform]));
  };

  const handleBookmark = (contentId: string) => {
    dispatch(toggleBookmarkOptimistic(contentId));
  };

  const handleLike = (contentId: string) => {
    dispatch(toggleLikeOptimistic(contentId));
  };

  const filteredContent = MOCK_CONTENT.filter(content => {
    // 크리에이터 필터
    const creatorMatch = filters.selectedCreators.includes('all') || 
                        filters.selectedCreators.includes(content.creator.id);
    
    // 플랫폼 필터
    const platformMatch = selectedPlatform === 'all' || content.platform === selectedPlatform;
    
    return creatorMatch && platformMatch;
  });

  const renderContentCard = (content: any) => {
    if (content.platform === 'youtube') {
      return (
        <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="flex flex-col sm:flex-row">
            {/* 썸네일 */}
            <div className="relative w-full sm:w-64 h-48 sm:h-36 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                {content.duration}
              </span>
              <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center">
                <Youtube className="h-3 w-3 mr-1" />
                YouTube
              </div>
            </div>
            
            {/* 콘텐츠 정보 */}
            <div className="p-4 flex-1">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">{content.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2 space-x-4">
                    <div className="flex items-center">
                      <div className={cn(
                        'w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold',
                        content.creator.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
                      )}>
                        {content.creator.displayName.charAt(0)}
                      </div>
                      <span className="font-medium">{content.creator.displayName}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{formatNumber(content.viewCount)}회</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formatDate(content.publishedAt, 'relative')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {content.description}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleBookmark(content.id)}
                    className={cn(
                      content.isBookmarked && 'text-blue-600'
                    )}
                  >
                    <Bookmark className={cn(
                      'h-4 w-4',
                      content.isBookmarked && 'fill-current'
                    )} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleLike(content.id)}
                    className={cn(
                      content.isLiked && 'text-red-600'
                    )}
                  >
                    <Heart className={cn(
                      'h-4 w-4',
                      content.isLiked && 'fill-current'
                    )} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      );
    } else {
      // Twitter 포스트
      return (
        <Card key={content.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start">
            <div className={cn(
              'w-12 h-12 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-white font-bold',
              content.creator.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
            )}>
              {content.creator.displayName.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-wrap">
                  <h4 className="font-bold mr-2">{content.creator.displayName}</h4>
                  <span className="text-muted-foreground text-sm">@{content.creator.name}</span>
                  <div className="flex items-center ml-3 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatDate(content.publishedAt, 'relative')}</span>
                  </div>
                </div>
                <div className="bg-blue-400 text-white text-xs px-2 py-1 rounded flex items-center">
                  <Twitter className="h-3 w-3 mr-1" />
                  Twitter
                </div>
              </div>
              <p className="mb-3">{content.title}</p>
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg h-32 flex items-center justify-center mb-3">
                <div className="text-4xl">🎵</div>
              </div>
              <div className="flex items-center text-muted-foreground text-sm space-x-6">
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <span className="mr-1">💬</span> 234
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <span className="mr-1">🔄</span> 1.2K
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-auto p-1',
                    content.isLiked && 'text-red-600'
                  )}
                  onClick={() => handleLike(content.id)}
                >
                  <Heart className={cn(
                    'h-3 w-3 mr-1',
                    content.isLiked && 'fill-current'
                  )} />
                  {formatNumber(content.likeCount)}
                </Button>
                <Button variant="ghost" size="sm" className="h-auto p-1">
                  <span className="mr-1">📤</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      );
    }
  };

  return (
    <main className={cn(
      'flex-1 max-w-6xl mx-auto p-4 sm:p-6 transition-all duration-300',
      !sidebarOpen && 'ml-0'
    )}>
      {/* 필터 상태 표시 */}
      <div className="bg-background rounded-lg shadow-sm mb-6 p-4 border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-sm text-muted-foreground">현재 필터:</span>
            <div className="flex items-center space-x-2">
              {filters.selectedCreators.includes('all') ? (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  전체 보기
                </span>
              ) : (
                filters.selectedCreators.map(creatorId => (
                  <span key={creatorId} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {creatorId === 'ado' ? 'Ado' : '히카킨'}
                  </span>
                ))
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            필터 초기화
          </Button>
        </div>
      </div>

      {/* 플랫폼 필터 탭 */}
      <div className="bg-background rounded-lg shadow-sm mb-6 border">
        <div className="flex items-center border-b overflow-x-auto">
          <button
            onClick={() => handlePlatformFilter('all')}
            className={cn(
              'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2',
              selectedPlatform === 'all'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            전체
          </button>
          <button
            onClick={() => handlePlatformFilter('youtube')}
            className={cn(
              'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 flex items-center',
              selectedPlatform === 'youtube'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Youtube className="h-4 w-4 mr-2 text-red-600" />
            YouTube
          </button>
          <button
            onClick={() => handlePlatformFilter('twitter')}
            className={cn(
              'px-4 sm:px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 flex items-center',
              selectedPlatform === 'twitter'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <Twitter className="h-4 w-4 mr-2 text-blue-400" />
            Twitter
          </button>
          <div className="ml-auto px-4">
            <select className="text-sm border border-input rounded px-3 py-1 bg-background">
              <option>최신순</option>
              <option>인기순</option>
              <option>조회수순</option>
            </select>
          </div>
        </div>
      </div>

      {/* 콘텐츠 타임라인 */}
      <div className="space-y-6">
        {filteredContent.map(renderContentCard)}
        
        {/* 로딩 인디케이터 */}
        <div className="py-8 text-center">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
            <span className="text-muted-foreground">더 많은 콘텐츠를 불러오는 중...</span>
          </div>
        </div>
      </div>
    </main>
  );
}
