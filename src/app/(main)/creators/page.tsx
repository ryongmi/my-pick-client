'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Users, Youtube, Twitter, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCreators, followCreator, unfollowCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { mockGetFollowedCreators } from '@/data/creators';
import { Creator } from '@/types';
import { useDocumentTitle } from '@/hooks/use-document-title';

export default function CreatorsPage() {
  useDocumentTitle('크리에이터');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Creator[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('followers');
  
  const dispatch = useAppDispatch();
  const { creators, followedCreators, isLoading, isFollowing } = useAppSelector(state => state.creator);

  // 초기 데이터 로드
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Redux를 통해 크리에이터 데이터 로드
        await dispatch(fetchCreators({ 
          sortBy: sortBy, 
          platform: selectedPlatform 
        })).unwrap();
        
        // 팔로우된 크리에이터 데이터 로드 (mock에서 가져와서 Redux에 저장)
        const followed = await mockGetFollowedCreators();
        dispatch(updateFollowedCreators(followed.data));
      } catch (_error) {
        // 초기 데이터 로드 실패
      }
    };
    void loadInitialData();
  }, [dispatch, sortBy, selectedPlatform]);

  // 구독 상태 변경 이벤트 리스너
  useEffect(() => {
    const handleFollowChange = async () => {
      const followed = await mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed.data));
    };

    window.addEventListener('followersChanged', handleFollowChange);
    return () => window.removeEventListener('followersChanged', handleFollowChange);
  }, [dispatch]);

  // 검색 함수
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      // Redux를 통해 검색
      const response = await dispatch(fetchCreators({
        search: searchTerm,
        platform: selectedPlatform,
        sortBy: sortBy,
        limit: 10
      })).unwrap();
      setSearchResults(response.data?.items || []);
    } catch (_error) {
      // 검색 오류
    }
  };

  // 검색어가 비어있을 때 검색 결과 초기화
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
    }
  }, [searchTerm]);

  // 엔터키 검색
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 팔로우/언팔로우
  const handleFollowToggle = async (creator: Creator) => {
    const isFollowed = followedCreators.some(c => c.id === creator.id);
    
    try {
      if (isFollowed) {
        await dispatch(unfollowCreator(creator.id)).unwrap();
      } else {
        await dispatch(followCreator(creator)).unwrap();
      }
      
      // 다른 컴포넌트들에게 알림
      window.dispatchEvent(new CustomEvent('followersChanged'));
    } catch (_error) {
      // 팔로우 처리 오류
    }
  };

  const getPlatformIcon = (platformType: string) => {
    switch (platformType) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      default:
        return null;
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

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="space-y-6">
        {/* 헤더 */}
        <div>
          <h1 className="text-2xl font-bold">
            크리에이터 관리
          </h1>
          <p className="text-muted-foreground">
            MyPick에 등록된 크리에이터를 검색하고 구독하세요
          </p>
        </div>
        
        {/* 크리에이터 검색 섹션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              크리에이터 검색
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 검색 입력 */}
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="크리에이터 이름으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading}>
                {isLoading ? '검색 중...' : '검색'}
              </Button>
            </div>

            {/* 필터 옵션 */}
            <div className="flex gap-4">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-input rounded-md"
              >
                <option value="all">모든 플랫폼</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-input rounded-md"
              >
                <option value="followers">팔로워 순</option>
                <option value="name">이름 순</option>
                <option value="content">콘텐츠 수</option>
                <option value="recent">최근 업데이트</option>
              </select>
            </div>

            {/* 검색 결과 또는 전체 크리에이터 */}
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
                <span className="text-sm text-muted-foreground">크리에이터 로딩 중...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {(() => {
                  const creatorsToShow = searchResults.length > 0 ? searchResults : creators;
                  // 구독 중인 크리에이터 제외
                  const unfollowedCreators = creatorsToShow.filter(creator => 
                    !followedCreators.some(followed => followed.id === creator.id)
                  );
                  
                  return (
                    <>
                      <h3 className="text-sm font-medium">
                        {searchResults.length > 0 
                          ? `검색 결과 (${unfollowedCreators.length}개)` 
                          : `등록된 크리에이터 (${unfollowedCreators.length}개)`
                        }
                      </h3>
                      {unfollowedCreators.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          {searchResults.length > 0 
                            ? '검색된 크리에이터가 없습니다.' 
                            : '구독 가능한 크리에이터가 없습니다.'
                          }
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {unfollowedCreators.map((creator) => (
                            <div
                              key={creator.id}
                              className="flex items-center justify-between p-4 border border-input rounded-md hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  'w-12 h-12 rounded-full flex items-center justify-center text-white font-bold',
                                  creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                                  creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                  creator.id === 'kuzuha' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                                  'bg-gradient-to-r from-gray-400 to-gray-600'
                                )}>
                                  {creator.displayName.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-medium">{creator.displayName}</h4>
                                    {creator.isVerified ? <Star className="h-4 w-4 text-blue-500 fill-current" /> : null}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    팔로워 {formatNumber(creator.followerCount || 0)} • {creator.contentCount}개 콘텐츠
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    {creator.platforms?.map((platform, index) => (
                                      <div key={index} className="flex items-center gap-1">
                                        {getPlatformIcon(platform.type)}
                                        <span className="text-xs text-muted-foreground">
                                          {formatNumber(platform?.followerCount ?? 0)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleFollowToggle(creator)}
                                disabled={isFollowing}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                구독하기
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 구독 중인 크리에이터 목록 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              구독 중인 크리에이터 ({followedCreators.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {followedCreators.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                아직 구독한 크리에이터가 없습니다.
                <br />
                위에서 크리에이터를 검색하고 구독해보세요!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followedCreators.map((creator) => (
                  <div
                    key={creator.id}
                    className="flex items-center justify-between p-4 border border-input rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                        creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                        creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                        creator.id === 'kuzuha' ? 'bg-gradient-to-r from-green-400 to-teal-500' :
                        'bg-gradient-to-r from-gray-400 to-gray-600'
                      )}>
                        {creator.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{creator.displayName}</h4>
                          {creator.isVerified ? <Star className="h-3 w-3 text-blue-500 fill-current" /> : null}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatNumber(creator.followerCount || 0)} 팔로워
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFollowToggle(creator)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      disabled={isFollowing}
                    >
                      구독 취소
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}