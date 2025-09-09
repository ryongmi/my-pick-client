'use client';

import { useState, useEffect } from 'react';
import { 
  Eye, 
  Heart, 
  Bookmark, 
  Share2, 
  Clock, 
  ThumbsUp, 
  Youtube, 
  MoreHorizontal,
  Flag,
  Download,
  Calendar,
  Tag,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { followCreator, unfollowCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { mockGetFollowedCreators } from '@/data/creators';
import { cn, formatNumber, formatDate } from '@/lib/utils';
import type { Creator } from '@/types';

interface VideoInfoProps {
  videoId: string;
}

// Mock 데이터 (실제로는 API에서 가져옴)
const MOCK_VIDEO_DATA = {
  '1': {
    id: '1',
    title: '【歌ってみた】새로운 커버곡 / Ado',
    description: '오늘은 특별한 커버곡을 준비했어요! 많은 분들이 요청해주신 곡인데요, 정말 오랜 시간 연습했습니다. 이번 곡은 특히 감정적인 부분이 많아서 표현하는데 신경을 많이 썼어요. 여러분들이 좋아해주셨으면 좋겠습니다!\n\n🎵 원곡: 新時代 (Uta from ONE PIECE FILM RED)\n🎤 보컬: Ado\n🎹 편곡: 오리지널\n\n항상 응원해주시는 구독자 여러분께 감사드립니다! 다음에도 더 좋은 커버곡으로 찾아뵐게요.',
    platform: 'youtube' as const,
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
      avatar: '',
      subscriberCount: 7200000,
      verified: true,
    },
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    viewCount: 520000,
    likeCount: 45000,
    commentCount: 3200,
    duration: '15:23',
    tags: ['음악', 'Cover', 'J-Pop', 'Ado'],
    category: '음악',
    isBookmarked: false,
    isLiked: false,
    originalUrl: 'https://youtube.com/watch?v=example1',
  },
  '2': {
    id: '2',
    title: '【검증】1000만원의 〇〇 사봤다!',
    description: '안녕하세요! 히카킨입니다! 오늘은 무려 1000만원의 최고급 아이템을 직접 구매해봤습니다! 정말 비싸긴 하지만 과연 그 값어치를 할까요?\n\n이번 영상에서는:\n• 1000만원 아이템 언박싱\n• 실제 품질 테스트\n• 일반 제품과의 비교\n• 솔직한 리뷰\n\n여러분들도 궁금하셨을 텐데, 직접 확인해보세요!',
    platform: 'youtube' as const,
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
      avatar: '',
      subscriberCount: 5400000,
      verified: true,
    },
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    viewCount: 1200000,
    likeCount: 89000,
    commentCount: 5600,
    duration: '8:45',
    tags: ['검증', '리뷰', '언박싱', '고급'],
    category: '엔터테인먼트',
    isBookmarked: false,
    isLiked: false,
    originalUrl: 'https://youtube.com/watch?v=example2',
  },
};

export function VideoInfo({ videoId }: VideoInfoProps): JSX.Element {
  const dispatch = useAppDispatch();
  const { followedCreators, isFollowing } = useAppSelector(state => state.creator);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);

  // Mock 데이터에서 비디오 정보 가져오기
  const videoData = MOCK_VIDEO_DATA[videoId as keyof typeof MOCK_VIDEO_DATA];

  // 현재 크리에이터의 구독 상태 확인
  const isFollowingCreator = videoData ? followedCreators.some(
    creator => creator.id === videoData.creator.id
  ) : false;

  useEffect(() => {
    if (videoData) {
      setIsBookmarked(videoData.isBookmarked);
      setIsLiked(videoData.isLiked);
    }
  }, [videoData]);

  // 구독한 크리에이터 목록 초기 로드
  useEffect(() => {
    const loadFollowedCreators = async (): Promise<void> => {
      const followed = await mockGetFollowedCreators();
      dispatch(updateFollowedCreators((followed.data as Creator[]) || []));
    };
    
    if (followedCreators.length === 0) {
      loadFollowedCreators();
    }
  }, [dispatch, followedCreators.length]);

  if (!videoData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">비디오 정보를 찾을 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  const handleBookmark = (): void => {
    setIsBookmarked(!isBookmarked);
    // TODO: API 호출
  };

  const handleLike = (): void => {
    setIsLiked(!isLiked);
    // TODO: API 호출
  };

  const handleShare = (): void => {
    if (navigator.share) {
      navigator.share({
        title: videoData.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: 토스트 메시지 표시
    }
  };

  const handleCreatorClick = (): void => {
    // TODO: 크리에이터 프로필 페이지로 이동
    // eslint-disable-next-line no-console
    console.log('크리에이터 프로필로 이동:', videoData.creator.id);
  };

  const handleSubscribe = async (): Promise<void> => {
    if (!videoData) {return;}

    try {
      if (isFollowingCreator) {
        // 구독 해제
        await dispatch(unfollowCreator(videoData.creator.id)).unwrap();
      } else {
        // 구독
        const creatorToFollow = {
          id: videoData.creator.id,
          name: videoData.creator.name,
          displayName: videoData.creator.displayName,
          avatar: videoData.creator.avatar,
          category: 'entertainment', // 기본 카테고리 추가
          platforms: [
            {
              type: 'youtube' as const,
              platformId: videoData.creator.id,
              username: videoData.creator.name,
              url: `https://youtube.com/@${videoData.creator.name}`,
              isActive: true,
              followerCount: videoData.creator.subscriberCount,
              lastSync: new Date().toISOString(),
            }
          ],
          description: `${videoData.creator.displayName}의 채널`,
          isVerified: videoData.creator.verified,
          followerCount: videoData.creator.subscriberCount,
          contentCount: 0,
          totalViews: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await dispatch(followCreator(creatorToFollow)).unwrap();
      }

      // 사이드바와 동기화를 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('followersChanged'));
      
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('구독 처리 실패:', error);
      // TODO: 에러 토스트 메시지 표시
    }
  };

  const truncatedDescription = videoData.description.length > 200 
    ? videoData.description.substring(0, 200) + '...'
    : videoData.description;

  return (
    <div className="space-y-6">
      {/* 비디오 제목 및 메타데이터 */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* 제목 */}
          <h1 className="text-2xl font-bold leading-tight">{videoData.title}</h1>

          {/* 메타정보 */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              {formatNumber(videoData.viewCount)}회 시청
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(videoData.publishedAt, 'relative')}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {videoData.duration}
            </div>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 mr-1" />
              {formatNumber(videoData.likeCount)}
            </div>
            <Badge variant="secondary" className="flex items-center">
              <Youtube className="h-3 w-3 mr-1" />
              YouTube
            </Badge>
            <Badge variant="outline">{videoData.category}</Badge>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={handleLike}
              className={cn(
                "flex items-center gap-2",
                isLiked && "bg-red-600 hover:bg-red-700"
              )}
            >
              <Heart className={cn(
                "h-4 w-4",
                isLiked && "fill-current"
              )} />
              {isLiked ? '좋아요 취소' : '좋아요'}
            </Button>

            <Button
              variant={isBookmarked ? "default" : "outline"}
              size="sm"
              onClick={handleBookmark}
              className={cn(
                "flex items-center gap-2",
                isBookmarked && "bg-blue-600 hover:bg-blue-700"
              )}
            >
              <Bookmark className={cn(
                "h-4 w-4",
                isBookmarked && "fill-current"
              )} />
              {isBookmarked ? '북마크 해제' : '북마크'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              공유
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(videoData.originalUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <Youtube className="h-4 w-4" />
              YouTube에서 보기
            </Button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMoreActions(!showMoreActions)}
                className="flex items-center gap-2"
              >
                <MoreHorizontal className="h-4 w-4" />
                더보기
              </Button>

              {showMoreActions ? <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-lg shadow-lg z-10">
                  <div className="p-1">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm"
                      onClick={() => {
                        setShowMoreActions(false);
                        // TODO: Implement download functionality
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      오프라인 저장
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setShowMoreActions(false);
                        // TODO: Implement report functionality
                      }}
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      신고하기
                    </Button>
                  </div>
                </div> : null}
            </div>
          </div>
        </div>
      </Card>

      {/* 크리에이터 정보 */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div 
            className="flex items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleCreatorClick}
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold">
              {videoData.creator.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">{videoData.creator.displayName}</h3>
                {videoData.creator.verified ? <Badge variant="secondary" className="text-xs">
                    인증됨
                  </Badge> : null}
              </div>
              <p className="text-sm text-muted-foreground">
                구독자 {formatNumber(videoData.creator.subscriberCount)}명
              </p>
            </div>
          </div>
          
          <Button 
            size="sm"
            variant={isFollowingCreator ? "outline" : "default"}
            onClick={handleSubscribe}
            disabled={isFollowing}
            className={cn(
              "min-w-[80px]",
              isFollowingCreator && "border-red-200 text-red-600 hover:bg-red-50"
            )}
          >
            {isFollowing ? (
              "처리중..."
            ) : isFollowingCreator ? (
              "구독해제"
            ) : (
              "구독"
            )}
          </Button>
        </div>
      </Card>

      {/* 비디오 설명 */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="font-semibold">설명</h3>
          
          {/* 태그 */}
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Tag className="h-4 w-4 mr-1" />
              태그
            </h4>
            <div className="flex flex-wrap gap-2">
              {videoData.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="cursor-pointer hover:bg-accent">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* 설명 텍스트 */}
          <div className="space-y-2">
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {showFullDescription ? videoData.description : truncatedDescription}
            </p>
            
            {videoData.description.length > 200 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="p-0 h-auto text-primary hover:underline flex items-center"
              >
                {showFullDescription ? (
                  <>
                    접기 <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    더보기 <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}