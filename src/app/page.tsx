'use client';

import { useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Eye, Clock, Heart, Bookmark, Play, Youtube, Twitter, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useUI, useContent } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import { setPlatformFilter, clearFilters } from '@/store/slices/uiSlice';
import { setSelectedPlatform, selectSelectedPlatform } from '@/store/slices/platformSlice';
import { updateFollowedCreators } from '@/store/slices/creatorSlice';
import { mockGetFollowedCreators } from '@/data/creators';
import { Creator } from '@/types';
import {
  fetchContent,
  fetchMoreContent,
  toggleBookmarkOptimistic,
  toggleLikeOptimistic,
  bookmarkContent,
  removeBookmark,
  likeContent,
  unlikeContent
} from '@/store/slices/contentSlice';
import { cn } from '@/lib/utils';
import { formatNumber, formatDate } from '@/lib/utils';

export default function HomePage(): JSX.Element {
  useDocumentTitle('대시보드');

  const dispatch = useAppDispatch();
  const { filters } = useUI();
  const { contents, isLoading, hasMore, isLoadingMore, pagination } = useContent();
  const { isLoggedIn, user, loading, isAuthenticated } = useAuth();
  const { followedCreators } = useAppSelector(state => state.creator);
  const selectedPlatform = useAppSelector(selectSelectedPlatform);
  const loadingRef = useRef<HTMLDivElement>(null);

  // 인증 상태 디버깅
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[HomePage] Auth Status:', {
      isLoggedIn,
      isAuthenticated,
      hasUser: !!user,
      loading,
      userId: user?.id
    });
  }, [isLoggedIn, isAuthenticated, user, loading]);

  // SSO 로그인 처리
  const handleLogin = (): void => {
    const returnUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
    const redirectUri = encodeURIComponent(`${window.location.origin}${returnUrl}`);
    const ssoStartUrl = `${process.env.NEXT_PUBLIC_AUTH_SERVER_URL}/api/auth/login?redirect_uri=${redirectUri}`;
    window.location.href = ssoStartUrl;
  };

  // 팔로우한 크리에이터 초기 로드
  useEffect(() => {
    if (followedCreators.length === 0) {
      const loadFollowed = async (): Promise<void> => {
        const followed = await mockGetFollowedCreators();
        dispatch(updateFollowedCreators((followed.data as Creator[]) || []));
      };
      loadFollowed();
    }
  }, [dispatch, followedCreators.length]);

  // 컴포넌트 마운트 시 콘텐츠 로드
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[DEBUG] Fetching content with filters:', {
      creators: filters.selectedCreators,
      platforms: [selectedPlatform],
      sortBy: 'newest'
    });
    dispatch(fetchContent({
      creators: filters.selectedCreators,
      platforms: [selectedPlatform],
      sortBy: 'newest'
    }));
  }, [dispatch, filters.selectedCreators, selectedPlatform]);

  // contents 배열 변경 감지 (디버깅용)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('[DEBUG] Contents updated:', {
      count: contents.length,
      hasMore,
      isLoadingMore,
      currentPage: pagination.page
    });
  }, [contents, hasMore, isLoadingMore, pagination.page]);

  // 무한 스크롤 로직
  const loadMoreContent = useCallback((): void => {
    if (hasMore && !isLoadingMore && !isLoading) {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Loading more content:', {
        nextPage: pagination.page + 1,
        creators: filters.selectedCreators,
        platforms: [selectedPlatform]
      });
      dispatch(fetchMoreContent({
        page: pagination.page + 1,
        creators: filters.selectedCreators,
        platforms: [selectedPlatform],
        sortBy: 'newest'
      }));
    } else {
      // eslint-disable-next-line no-console
      console.log('[DEBUG] Cannot load more:', {
        hasMore,
        isLoadingMore,
        isLoading
      });
    }
  }, [dispatch, hasMore, isLoadingMore, isLoading, pagination.page, filters.selectedCreators, selectedPlatform]);

  // Intersection Observer를 사용한 스크롤 감지
  useEffect(() => {
    const loadingElement = loadingRef.current;
    if (!loadingElement || !hasMore) {return;}

    const observer = new IntersectionObserver(
      (entries): void => {
        if (entries[0]?.isIntersecting) {
          loadMoreContent();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadingElement);

    return (): void => {
      observer.disconnect();
    };
  }, [loadMoreContent, hasMore]);

  const handlePlatformFilter = (platform: string): void => {
    dispatch(setSelectedPlatform(platform));
    dispatch(setPlatformFilter([platform]));
  };

  // 크리에이터 이름을 정확히 가져오는 함수
  const getCreatorDisplayName = (creatorId: string): string => {
    const creator = followedCreators.find(c => c.id === creatorId);
    return creator?.displayName || creatorId;
  };

  // 필터 초기화 함수
  const handleClearFilters = (): void => {
    dispatch(clearFilters());
    dispatch(setSelectedPlatform('all'));
  };

  const handleBookmark = async (contentId: string): Promise<void> => {
    // 낙관적 업데이트
    dispatch(toggleBookmarkOptimistic(contentId));

    // 실제 API 호출
    const content = contents.find(c => c.id === contentId);
    try {
      if (content?.isBookmarked) {
        await dispatch(removeBookmark(contentId)).unwrap();
      } else {
        await dispatch(bookmarkContent(contentId)).unwrap();
      }
    } catch (error) {
      // 에러 시 롤백
      dispatch(toggleBookmarkOptimistic(contentId));
      // eslint-disable-next-line no-console
      console.error('북마크 처리 실패:', error);
    }
  };

  const handleLike = async (contentId: string): Promise<void> => {
    // 낙관적 업데이트
    dispatch(toggleLikeOptimistic(contentId));

    // 실제 API 호출
    const content = contents.find(c => c.id === contentId);
    try {
      if (content?.isLiked) {
        await dispatch(unlikeContent(contentId)).unwrap();
      } else {
        await dispatch(likeContent(contentId)).unwrap();
      }
    } catch (error) {
      // 에러 시 롤백
      dispatch(toggleLikeOptimistic(contentId));
      // eslint-disable-next-line no-console
      console.error('좋아요 처리 실패:', error);
    }
  };

  // Redux store에서 가져온 콘텐츠 사용 (무한스크롤 반영)
  const displayContent = contents;

  const filteredContent = displayContent.filter(content => {
    // 크리에이터 필터 - 팔로우한 크리에이터 기준으로 필터링
    let creatorMatch = false;

    if (filters.selectedCreators.includes('all')) {
      // 전체 보기 시 로직 개선
      if (followedCreators.length > 0) {
        // 팔로우한 크리에이터가 있으면 해당 크리에이터만 표시
        const followedCreatorIds = followedCreators.map(c => c.id);
        creatorMatch = content.creator ? followedCreatorIds.includes(content.creator.id) : false;
      } else {
        // 팔로우한 크리에이터가 없으면 모든 컨텐츠 표시 (초기 사용자)
        creatorMatch = true;
      }
    } else {
      // 특정 크리에이터 선택 시
      creatorMatch = content.creator ? filters.selectedCreators.includes(content.creator.id) : false;
    }

    // 플랫폼 필터
    const platformMatch = selectedPlatform === 'all' || content.platform === selectedPlatform;

    return creatorMatch && platformMatch;
  });

  const renderContentCard = (content: {
    id: string;
    title: string;
    description?: string;
    thumbnail?: string;
    platform: string;
    creator?: {
      id: string;
      name: string;
      displayName: string;
      avatar?: string;
    };
    publishedAt: string;
    viewCount?: number;
    likeCount?: number;
    duration?: string | number;
    isBookmarked?: boolean;
    isLiked?: boolean;
  }): JSX.Element => {
    if (content.platform === 'youtube') {
      return (
        <Link href={`/video/${content.id}`} key={content.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
            <div className="flex flex-col sm:flex-row">
              {/* 썸네일 */}
              <div className="relative w-full sm:w-64 h-48 sm:h-36 flex-shrink-0">
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center group-hover:scale-105 transition-transform">
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
                        content.creator?.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
                      )}>
                        {content.creator?.displayName?.charAt(0) || '?'}
                      </div>
                      <span className="font-medium">{content.creator?.displayName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{formatNumber(content.viewCount || 0)}회</span>
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleBookmark(content.id);
                    }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(content.id);
                    }}
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
        </Link>
      );
    } else {
      // Twitter 포스트
      return (
        <Card key={content.id} className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-start">
            <div className={cn(
              'w-12 h-12 rounded-full mr-3 flex-shrink-0 flex items-center justify-center text-white font-bold',
              content.creator?.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
            )}>
              {content.creator?.displayName?.charAt(0) || '?'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-wrap">
                  <h4 className="font-bold mr-2">{content.creator?.displayName || 'Unknown'}</h4>
                  <span className="text-muted-foreground text-sm">@{content.creator?.name || 'unknown'}</span>
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
                  {formatNumber(content.likeCount || 0)}
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

  // 로딩 중
  if (loading) {
    return (
      <div className="p-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 미인증 사용자용 UI
  if (!isLoggedIn) {
    return (
      <div className="p-6">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 헤로 섹션 */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 text-sm font-medium rounded-full mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              크리에이터 콘텐츠 허브
            </div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-gray-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">
              MyPick
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
              좋아하는 크리에이터의 YouTube와 Twitter 콘텐츠를 <br />
              한 곳에서 쉽고 빠르게 관리하세요.
            </p>

            {/* 통계 섹션 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 max-w-2xl mx-auto">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-3xl font-bold text-blue-500 mb-2">∞</div>
                <div className="text-sm text-gray-500">크리에이터 콘텐츠</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-3xl font-bold text-green-600 mb-2">🎥</div>
                <div className="text-sm text-gray-500">YouTube 영상</div>
              </div>
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <div className="text-3xl font-bold text-orange-600 mb-2">🐦</div>
                <div className="text-sm text-gray-500">Twitter 포스트</div>
              </div>
            </div>
          </div>

          {/* 미인증 사용자용 안내 */}
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">로그인이 필요합니다</h3>
            <p className="text-gray-500 mb-6">크리에이터 콘텐츠를 보려면 로그인하세요.</p>
            <button
              onClick={handleLogin}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-400 to-indigo-400 text-gray-800 font-medium rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              로그인하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="w-full max-w-7xl mx-auto">
        <div className="space-y-6">
          {/* 필터 상태 표시 */}
          <div className="bg-background rounded-lg shadow-sm p-4 border">
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
                      {getCreatorDisplayName(creatorId)}
                    </span>
                  ))
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleClearFilters}
            >
              필터 초기화
            </Button>
          </div>
          </div>

          {/* 플랫폼 필터 */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={selectedPlatform === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlatformFilter('all')}
            >
              전체
            </Button>
            <Button
              variant={selectedPlatform === 'youtube' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlatformFilter('youtube')}
            >
              <Youtube className="h-4 w-4 mr-1" />
              YouTube
            </Button>
            <Button
              variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePlatformFilter('twitter')}
            >
              <Twitter className="h-4 w-4 mr-1" />
              Twitter
            </Button>
          </div>

          {/* 콘텐츠 타임라인 */}
          <div className="space-y-6">
        {isLoading ? (
              // 로딩 상태
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="flex">
                      <div className="w-64 h-36 bg-gray-200 rounded"></div>
                      <div className="flex-1 p-4">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredContent.length > 0 ? (
              <>
                {filteredContent.map((content, index) => (
                  <div key={content.id} className={index > 0 ? "mt-6" : ""}>
                    {renderContentCard(content)}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">선택한 필터에 맞는 콘텐츠가 없습니다.</p>
              </div>
            )}

          {/* 무한 스크롤 로딩 인디케이터 */}
          {hasMore ? <div
              ref={loadingRef}
              className="py-8 text-center"
            >
              {isLoadingMore ? (
                <div className="inline-flex items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"></div>
                  <span className="text-muted-foreground">더 많은 콘텐츠를 불러오는 중...</span>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  스크롤하여 더 많은 콘텐츠 보기
                </div>
              )}
            </div> : null}

          {/* 모든 콘텐츠 로드 완료 메시지 */}
          {!hasMore && !isLoading && filteredContent.length > 0 && (
            <div className="py-8 text-center">
              <span className="text-muted-foreground text-sm">모든 콘텐츠를 불러왔습니다</span>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
