'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Play, 
  Eye, 
  Calendar,
  ExternalLink,
  Youtube,
  MoreHorizontal,
  Bell,
  BellOff,
  Heart,
  MessageCircle,
  Share2,
  ChevronRight,
  Star,
  Trophy,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { followCreator, unfollowCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { mockGetFollowedCreators } from '@/data/creators';
import { cn, formatNumber, formatDate } from '@/lib/utils';

interface CreatorPanelProps {
  creatorId: string;
  currentVideoId?: string;
}

// Mock 크리에이터 데이터
const MOCK_CREATOR_DATA = {
  'ado': {
    id: 'ado',
    name: 'Ado',
    displayName: 'Ado',
    avatar: '',
    subscriberCount: 7200000,
    totalViews: 890000000,
    videoCount: 156,
    verified: true,
    joinedAt: '2020-10-24T00:00:00Z',
    description: '日本のシンガー。映画『ONE PIECE FILM RED』でウタの歌声を担当。パワフルで感情豊かな歌声が特徴。',
    bannerColor: 'from-purple-400 to-pink-500',
    categories: ['음악', 'J-Pop', 'Cover'],
    socialLinks: {
      youtube: 'https://youtube.com/@ado',
      twitter: 'https://twitter.com/ado1024imoken',
    },
    stats: {
      averageViews: 2800000,
      uploadFrequency: '주 1-2회',
      engagementRate: 12.4,
    },
    recentVideos: [
      {
        id: '1',
        title: '【歌ってみた】새로운 커버곡',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 520000,
        publishedAt: '2시간 전',
        duration: '4:23',
      },
      {
        id: 'ado-2',
        title: '【오리지널】마음을 담은 노래',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 1200000,
        publishedAt: '3일 전',
        duration: '3:45',
      },
      {
        id: 'ado-3',
        title: '【LIVE】팬들과 함께하는 시간',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 890000,
        publishedAt: '1주 전',
        duration: '15:30',
      },
    ],
    milestones: [
      { type: 'subscriber', count: 7000000, date: '2024-01-15', title: '700만 구독자 달성' },
      { type: 'view', count: 100000000, date: '2023-08-20', title: '누적 조회수 1억 돌파' },
    ],
  },
  'hikakin': {
    id: 'hikakin',
    name: '히카킨',
    displayName: '히카킨',
    avatar: '',
    subscriberCount: 5400000,
    totalViews: 12000000000,
    videoCount: 3200,
    verified: true,
    joinedAt: '2011-05-19T00:00:00Z',
    description: '일본의 대표적인 유튜버. 다양한 상품 리뷰, 챌린지, 엔터테인먼트 콘텐츠를 제작합니다.',
    bannerColor: 'from-blue-400 to-cyan-500',
    categories: ['엔터테인먼트', '리뷰', '챌린지'],
    socialLinks: {
      youtube: 'https://youtube.com/@hikakin',
      twitter: 'https://twitter.com/hikakin',
    },
    stats: {
      averageViews: 800000,
      uploadFrequency: '주 3-4회',
      engagementRate: 8.7,
    },
    recentVideos: [
      {
        id: '2',
        title: '【검증】1000만원의 〇〇 사봤다!',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 1200000,
        publishedAt: '5시간 전',
        duration: '8:45',
      },
      {
        id: 'hikakin-2',
        title: '새로운 도전! 30일 챌린지',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 950000,
        publishedAt: '2일 전',
        duration: '12:20',
      },
      {
        id: 'hikakin-3',
        title: '팬들이 보내준 선물 개봉기',
        thumbnail: '/api/placeholder/160/90',
        viewCount: 780000,
        publishedAt: '4일 전',
        duration: '16:15',
      },
    ],
    milestones: [
      { type: 'subscriber', count: 5000000, date: '2023-11-10', title: '500만 구독자 달성' },
      { type: 'video', count: 3000, date: '2023-06-15', title: '영상 3000개 달성' },
    ],
  },
};

export function CreatorPanel({ creatorId, currentVideoId }: CreatorPanelProps) {
  const dispatch = useAppDispatch();
  const { followedCreators, isFollowing } = useAppSelector(state => state.creator);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);

  // Mock 데이터에서 크리에이터 정보 가져오기
  const creatorData = MOCK_CREATOR_DATA[creatorId as keyof typeof MOCK_CREATOR_DATA];

  // 현재 크리에이터의 구독 상태 확인
  const isFollowingCreator = creatorData ? followedCreators.some(
    creator => creator.id === creatorData.id
  ) : false;

  // 구독한 크리에이터 목록 초기 로드
  useEffect(() => {
    const loadFollowedCreators = async () => {
      const followed = await mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed.data || []));
    };
    
    if (followedCreators.length === 0) {
      loadFollowedCreators();
    }
  }, [dispatch, followedCreators.length]);

  useEffect(() => {
    // 구독 중인 크리에이터의 경우 알림 설정 상태 확인
    if (isFollowingCreator) {
      // TODO: 실제로는 API에서 알림 설정 상태를 가져와야 함
      setNotificationEnabled(true);
    }
  }, [isFollowingCreator]);

  if (!creatorData) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground">크리에이터 정보를 찾을 수 없습니다.</p>
        </div>
      </Card>
    );
  }

  const handleSubscribe = async () => {
    try {
      if (isFollowingCreator) {
        // 구독 해제
        await dispatch(unfollowCreator(creatorData.id)).unwrap();
        setNotificationEnabled(false);
      } else {
        // 구독
        const creatorToFollow = {
          id: creatorData.id,
          name: creatorData.name,
          displayName: creatorData.displayName,
          avatar: creatorData.avatar,
          category: 'entertainment', // 기본 카테고리 추가
          platforms: [
            {
              type: 'youtube' as const,
              platformId: creatorData.id,
              username: creatorData.name,
              url: creatorData.socialLinks.youtube,
              isActive: true,
              followerCount: creatorData.subscriberCount,
              lastSync: new Date().toISOString(),
            }
          ],
          description: creatorData.description,
          isVerified: creatorData.verified,
          followerCount: creatorData.subscriberCount,
          contentCount: creatorData.videoCount,
          totalViews: creatorData.totalViews,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await dispatch(followCreator(creatorToFollow)).unwrap();
      }

      // 사이드바와 동기화를 위한 이벤트 발생
      window.dispatchEvent(new CustomEvent('followersChanged'));
      
    } catch (error) {
      console.error('구독 처리 실패:', error);
    }
  };

  const handleNotificationToggle = () => {
    if (!isFollowingCreator) {return;}
    
    setNotificationEnabled(!notificationEnabled);
    // TODO: API 호출로 알림 설정 변경
  };

  const handleChannelVisit = () => {
    window.open(creatorData.socialLinks.youtube, '_blank');
  };

  const handleVideoClick = (videoId: string) => {
    if (videoId !== currentVideoId) {
      // TODO: 비디오 페이지로 네비게이션
      console.log('Navigate to video:', videoId);
    }
  };

  const displayedVideos = showAllVideos 
    ? creatorData.recentVideos 
    : creatorData.recentVideos.slice(0, 3);

  return (
    <div className="space-y-4">
      {/* 크리에이터 메인 정보 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl",
              `bg-gradient-to-br ${creatorData.bannerColor}`
            )}>
              {creatorData.displayName.charAt(0)}
            </div>
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold">{creatorData.displayName}</h2>
                    {creatorData.verified ? <Badge variant="secondary" className="text-xs">
                        인증됨
                      </Badge> : null}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    구독자 {formatNumber(creatorData.subscriberCount)}명
                  </p>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleChannelVisit}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  채널 방문
                </Button>
              </div>

              {/* 구독 및 알림 버튼 */}
              <div className="flex items-center gap-2">
                <Button 
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
                
                {isFollowingCreator ? <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNotificationToggle}
                    className={cn(
                      notificationEnabled && "bg-accent"
                    )}
                  >
                    {notificationEnabled ? (
                      <Bell className="h-4 w-4" />
                    ) : (
                      <BellOff className="h-4 w-4" />
                    )}
                  </Button> : null}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* 크리에이터 설명 */}
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            {creatorData.description}
          </p>
          
          {/* 카테고리 태그 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {creatorData.categories.map((category, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {category}
              </Badge>
            ))}
          </div>
          
          <Separator className="mb-4" />
          
          {/* 통계 정보 */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatNumber(creatorData.totalViews)}
              </div>
              <div className="text-xs text-muted-foreground">총 조회수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {formatNumber(creatorData.videoCount)}
              </div>
              <div className="text-xs text-muted-foreground">영상 수</div>
            </div>
          </div>
          
          {/* 추가 정보 */}
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>평균 조회수</span>
              <span className="font-medium">{formatNumber(creatorData.stats.averageViews)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>업로드 주기</span>
              <span className="font-medium">{creatorData.stats.uploadFrequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>참여율</span>
              <span className="font-medium">{creatorData.stats.engagementRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>가입일</span>
              <span className="font-medium">{formatDate(creatorData.joinedAt, 'short')}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 최근 영상 */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">최근 영상</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAllVideos(!showAllVideos)}
              className="text-xs"
            >
              {showAllVideos ? '접기' : '더보기'}
              <ChevronRight className={cn(
                "h-3 w-3 ml-1 transition-transform",
                showAllVideos && "rotate-90"
              )} />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {displayedVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className={cn(
                  "flex space-x-3 p-2 rounded-lg cursor-pointer transition-colors group",
                  video.id === currentVideoId 
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-muted/50"
                )}
              >
                {/* 썸네일 */}
                <div className="relative w-20 h-12 flex-shrink-0">
                  <div className={cn(
                    "w-full h-full rounded bg-gradient-to-br flex items-center justify-center",
                    creatorData.bannerColor
                  )}>
                    <Play className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                    {video.duration}
                  </div>
                </div>

                {/* 비디오 정보 */}
                <div className="flex-1 min-w-0">
                  <h4 className={cn(
                    "text-sm font-medium line-clamp-2 mb-1 group-hover:text-primary",
                    video.id === currentVideoId && "text-primary"
                  )}>
                    {video.title}
                  </h4>
                  
                  <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      <span>{formatNumber(video.viewCount)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{video.publishedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 주요 성과 */}
      {creatorData.milestones.length > 0 && (
        <Card>
          <CardHeader className="pb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Trophy className="h-4 w-4 text-yellow-500" />
              주요 성과
            </h3>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="space-y-3">
              {creatorData.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    milestone.type === 'subscriber' ? "bg-blue-500" : 
                    milestone.type === 'view' ? "bg-green-500" : "bg-purple-500"
                  )} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(milestone.date, 'short')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}