'use client';

import { useState, useEffect } from 'react';
import { User, Settings, Bookmark, Activity, Edit, Star, Play, Youtube, Twitter, Eye, Clock, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/redux';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { unfollowCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { fetchBookmarks, removeBookmark, toggleBookmarkOptimistic } from '@/store/slices/contentSlice';
import { cn } from '@/lib/utils';
import { formatNumber, formatDate } from '@/lib/utils';
import { mockGetFollowedCreators } from '@/data/creators';
import { Creator } from '@/types';

const MOCK_USER_STATS = {
  followedCreators: 12,
  watchedContent: 12500,
  bookmarks: 234,
  likes: 25600,
};

const MOCK_ACTIVITY = [
  {
    id: '1',
    type: 'watched',
    title: '【歌ってみた】새로운 커버곡을 시청했습니다',
    creator: 'Ado',
    time: '30분 전',
    icon: '▶️',
  },
  {
    id: '2',
    type: 'liked',
    title: '히카킨의 트윗에 좋아요를 눌렀습니다',
    time: '1시간 전',
    icon: '❤️',
  },
  {
    id: '3',
    type: 'bookmarked',
    title: '【검증】1000만원의 〇〇 사봤다!를 북마크했습니다',
    time: '2시간 전',
    icon: '🔖',
  },
];

// MOCK_FOLLOWED_CREATORS 제거 - 실제 데이터 사용

export function ProfileView() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { followedCreators, isFollowing } = useAppSelector(state => state.creator);
  const { bookmarkedContents, isLoadingBookmarks } = useAppSelector(state => state.content);
  const [activeTab, setActiveTab] = useState('activity');

  // 구독 중인 크리에이터 로드
  useEffect(() => {
    const loadFollowedCreators = () => {
      const followed = mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed));
    };
    loadFollowedCreators();

    // 구독 상태 변경 이벤트 리스너
    const handleFollowChange = () => {
      loadFollowedCreators();
    };

    window.addEventListener('followersChanged', handleFollowChange);
    return () => window.removeEventListener('followersChanged', handleFollowChange);
  }, [dispatch]);

  // 컴포넌트 마운트 시 북마크 데이터 로드
  useEffect(() => {
    dispatch(fetchBookmarks());
  }, [dispatch]);

  // 북마크 탭 클릭 시 데이터 새로고침
  useEffect(() => {
    if (activeTab === 'bookmarks') {
      dispatch(fetchBookmarks());
    }
  }, [dispatch, activeTab]);

  // 구독 취소 핸들러
  const handleUnfollow = async (creatorId: string) => {
    try {
      await dispatch(unfollowCreator(creatorId)).unwrap();
      
      // 다른 컴포넌트들에게 알림
      window.dispatchEvent(new CustomEvent('followersChanged'));
    } catch (error) {
      console.error('구독 취소 실패:', error);
    }
  };

  // 북마크 해제 핸들러
  const handleRemoveBookmark = async (contentId: string) => {
    // 낙관적 업데이트
    dispatch(toggleBookmarkOptimistic(contentId));
    
    try {
      await dispatch(removeBookmark(contentId)).unwrap();
      // 북마크 목록 새로고침
      dispatch(fetchBookmarks());
    } catch (error) {
      // 에러 시 롤백
      dispatch(toggleBookmarkOptimistic(contentId));
      console.error('북마크 해제 실패:', error);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const tabs = [
    { id: 'activity', label: '활동 내역', icon: Activity },
    { id: 'creators', label: '내 크리에이터', icon: User },
    { id: 'bookmarks', label: '북마크', icon: Bookmark },
    { id: 'settings', label: '설정', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'activity':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">최근 활동</h3>
            <div className="space-y-4">
              {MOCK_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">{activity.icon}</span>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'creators':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">팔로우 중인 크리에이터 ({followedCreators.length})</h3>
            {followedCreators.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 팔로우한 크리에이터가 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    크리에이터 관리 페이지에서 관심있는 크리에이터를 팔로우해보세요!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followedCreators.map((creator) => (
                  <Card key={creator.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className={cn(
                          'w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold',
                          creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                          creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          creator.id === 'kuzuha' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                          'bg-gradient-to-r from-gray-400 to-gray-600'
                        )}>
                          {creator.displayName.charAt(0)}
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{creator.displayName}</h4>
                            {creator.isVerified ? <Star className="h-4 w-4 text-blue-500 fill-current" /> : null}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {creator.platforms.map(p => p.type === 'youtube' ? 'YouTube' : 'Twitter').join(' • ')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            팔로워 {formatNumber(creator.followerCount)} • {creator.contentCount}개 콘텐츠
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUnfollow(creator.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          disabled={isFollowing}
                        >
                          구독 취소
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'bookmarks':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">북마크한 콘텐츠</h3>
              {bookmarkedContents.length > 0 && (
                <p className="text-sm text-muted-foreground">{bookmarkedContents.length}개</p>
              )}
            </div>
            
            {isLoadingBookmarks ? (
              // 로딩 상태
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
                    <div className="flex">
                      <div className="w-48 h-28 bg-gray-200 rounded"></div>
                      <div className="flex-1 p-4">
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bookmarkedContents.length === 0 ? (
              // 빈 상태
              <Card>
                <CardContent className="p-6 text-center">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">아직 북마크한 콘텐츠가 없습니다.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    좋아하는 콘텐츠에 북마크를 추가해보세요!
                  </p>
                </CardContent>
              </Card>
            ) : (
              // 북마크 콘텐츠 목록
              <div className="space-y-4">
                {bookmarkedContents.map((content) => (
                  <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row">
                      {/* 썸네일 */}
                      <div className="relative w-full sm:w-48 h-32 sm:h-28 flex-shrink-0">
                        {content.platform === 'youtube' ? (
                          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
                            <Play className="h-8 w-8 text-white" />
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                            <div className="text-2xl">🎵</div>
                          </div>
                        )}
                        {content.duration ? <span className="absolute bottom-2 right-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                            {content.duration}
                          </span> : null}
                        <div className="absolute top-2 left-2 text-white text-xs px-2 py-1 rounded flex items-center">
                          {content.platform === 'youtube' ? (
                            <>
                              <Youtube className="h-3 w-3 mr-1 text-red-600" />
                              <span className="bg-red-600 px-1 rounded">YouTube</span>
                            </>
                          ) : (
                            <>
                              <Twitter className="h-3 w-3 mr-1 text-blue-400" />
                              <span className="bg-blue-400 px-1 rounded">Twitter</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* 콘텐츠 정보 */}
                      <div className="p-4 flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm mb-2 line-clamp-2">{content.title}</h4>
                            <div className="flex items-center text-xs text-muted-foreground mb-2 space-x-3">
                              <div className="flex items-center">
                                <div className={cn(
                                  'w-4 h-4 rounded-full mr-1 flex items-center justify-center text-white text-xs font-bold',
                                  content.creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                                  content.creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                  'bg-gradient-to-r from-gray-400 to-gray-600'
                                )}>
                                  {content.creator.displayName.charAt(0)}
                                </div>
                                <span className="font-medium">{content.creator.displayName}</span>
                              </div>
                              {content.viewCount ? <div className="flex items-center">
                                  <Eye className="h-3 w-3 mr-1" />
                                  <span>{formatNumber(content.viewCount)}회</span>
                                </div> : null}
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>{formatDate(content.publishedAt, 'relative')}</span>
                              </div>
                            </div>
                            {content.description ? <p className="text-xs text-muted-foreground line-clamp-2">
                                {content.description}
                              </p> : null}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveBookmark(content.id)}
                            className="text-red-600 hover:bg-red-50 ml-2"
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">계정 설정</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>알림 설정</CardTitle>
                <CardDescription>어떤 알림을 받을지 선택하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">이메일 알림</p>
                    <p className="text-sm text-muted-foreground">새로운 콘텐츠 알림을 이메일로 받기</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">푸시 알림</p>
                    <p className="text-sm text-muted-foreground">브라우저 푸시 알림 받기</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">주간 다이제스트</p>
                    <p className="text-sm text-muted-foreground">주간 요약 리포트 받기</p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>개인정보 설정</CardTitle>
                <CardDescription>프로필 공개 범위를 설정하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">프로필 공개</p>
                    <p className="text-sm text-muted-foreground">다른 사용자가 내 프로필을 볼 수 있음</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">활동 내역 공개</p>
                    <p className="text-sm text-muted-foreground">내 시청 기록과 좋아요 공개</p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>표시 설정</CardTitle>
                <CardDescription>앱 표시 방식을 설정하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">테마</label>
                  <select className="w-full border border-input rounded-lg px-3 py-2 bg-background">
                    <option>라이트</option>
                    <option>다크</option>
                    <option>시스템 설정에 따라</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">언어</label>
                  <select className="w-full border border-input rounded-lg px-3 py-2 bg-background">
                    <option>한국어</option>
                    <option>English</option>
                    <option>日本語</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* 프로필 헤더 */}
        <Card>
        <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg" />
        <CardContent className="px-6 pb-6">
          <div className="flex items-center -mt-16">
            <div className="w-32 h-32 bg-background rounded-full p-2 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.charAt(0) || '사'}
              </div>
            </div>
            <div className="ml-6 mt-16">
              <h1 className="text-2xl font-bold">{user?.name || '사용자님'}</h1>
              <p className="text-muted-foreground">{user?.email || 'user@example.com'}</p>
              <p className="text-sm text-muted-foreground mt-1">
                2024년 1월부터 MyPick과 함께
              </p>
            </div>
            <Button className="ml-auto mt-16" variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              프로필 편집
            </Button>
          </div>
        </CardContent>
        </Card>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600">{formatNumber(followedCreators.length)}</p>
            <p className="text-sm text-muted-foreground mt-1">팔로우 크리에이터</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{formatNumber(MOCK_USER_STATS.watchedContent)}</p>
            <p className="text-sm text-muted-foreground mt-1">시청한 콘텐츠</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{formatNumber(bookmarkedContents.length)}</p>
            <p className="text-sm text-muted-foreground mt-1">북마크</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600">{formatNumber(MOCK_USER_STATS.likes)}</p>
            <p className="text-sm text-muted-foreground mt-1">좋아요</p>
          </CardContent>
          </Card>
        </div>

        {/* 탭 메뉴 */}
        <Card>
        <div className="border-b">
          <nav className="flex -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-3 border-b-2 font-medium text-sm flex items-center',
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

          <CardContent className="p-6">
            {renderTabContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
