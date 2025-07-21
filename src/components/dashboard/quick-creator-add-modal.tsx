'use client';

import { useState, useEffect } from 'react';
import { X, Search, Plus, Youtube, Twitter, Instagram, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchCreators, followCreator, updateFollowedCreators } from '@/store/slices/creatorSlice';
import { cn } from '@/lib/utils';
import { mockGetFollowedCreators } from '@/data/creators';
import { Creator } from '@/types';

interface QuickCreatorAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCreator: (creator: Creator) => void;
}

// 플랫폼 타입 정의
const PLATFORMS = [
  { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-600' },
  { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
];

export function QuickCreatorAddModal({ isOpen, onClose, onAddCreator }: QuickCreatorAddModalProps) {
  const dispatch = useAppDispatch();
  const { creators, followedCreators, isLoading, isFollowing } = useAppSelector(state => state.creator);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Creator[]>([]);

  // 모달이 열릴 때 크리에이터와 구독 정보 로드
  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, dispatch]);

  const loadData = async () => {
    try {
      // Redux를 통해 크리에이터 데이터 로드
      await dispatch(fetchCreators({ sortBy: 'followers', limit: 20 })).unwrap();
      
      // 팔로우된 크리에이터 데이터 로드
      const followed = mockGetFollowedCreators();
      dispatch(updateFollowedCreators(followed));
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await dispatch(fetchCreators({
        search: searchTerm,
        limit: 10
      })).unwrap();
      setSearchResults(response.data);
    } catch (error) {
      console.error('검색 실패:', error);
    }
  };

  const handleQuickAdd = async (creator: Creator) => {
    try {
      await mockFollowCreator(creator.id);
      onAddCreator(creator);
      handleClose();
    } catch (error) {
      console.error('크리에이터 추가 실패:', error);
    }
  };

  const handleClose = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    onClose();
  };

  const getPlatformIcon = (platformType: string) => {
    switch (platformType) {
      case 'youtube':
        return <Youtube className="h-4 w-4 text-red-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
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

  const isCreatorFollowed = (creatorId: string) => {
    return followedCreators.some(c => c.id === creatorId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold">크리에이터 빠른 추가</h2>
            <p className="text-sm text-muted-foreground">
              등록된 크리에이터를 검색하고 구독하세요
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4 max-h-[calc(90vh-100px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2" />
              <span className="text-sm text-muted-foreground">로딩 중...</span>
            </div>
          ) : (
            <>
              {/* 검색 섹션 */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="크리에이터 이름으로 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <Button 
                  onClick={handleSearch}
                  disabled={!searchTerm.trim() || isSearching}
                  className="w-full"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      검색 중...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      검색하기
                    </>
                  )}
                </Button>
              </div>

              {/* 검색 결과 */}
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">검색 결과</h3>
                  <div className="space-y-2">
                    {searchResults.filter(creator => !isCreatorFollowed(creator.id)).map((creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center justify-between p-3 border border-input rounded-md hover:border-primary/50 transition-colors"
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
                              <p className="font-medium text-sm">{creator.displayName}</p>
                              {creator.isVerified && (
                                <Star className="h-3 w-3 text-blue-500 fill-current" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(creator.followerCount)} 팔로워
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {creator.platforms.map((platform, index) => (
                                <div key={index} className="flex items-center gap-1">
                                  {getPlatformIcon(platform.type)}
                                  <span className="text-xs text-muted-foreground">
                                    {formatNumber(platform.followerCount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleQuickAdd(creator)}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          구독
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 구분선 */}
              {searchResults.length === 0 && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">등록된 크리에이터</span>
                  </div>
                </div>
              )}

              {/* 등록된 크리에이터 섹션 */}
              {searchResults.length === 0 && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {popularCreators.filter(creator => !isCreatorFollowed(creator.id)).map((creator) => (
                      <div
                        key={creator.id}
                        className="flex items-center justify-between p-3 border border-input rounded-md hover:border-primary/50 transition-colors"
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
                              <p className="font-medium text-sm">{creator.displayName}</p>
                              {creator.isVerified && (
                                <Star className="h-3 w-3 text-blue-500 fill-current" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(creator.followerCount)} 팔로워
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleQuickAdd(creator)}
                          className="h-8"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          구독
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}