'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Clock, 
  Calendar, 
  Eye, 
  MoreVertical, 
  Trash2, 
  BookmarkPlus, 
  Share2,
  ChevronDown,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn, formatNumber, formatDate, formatDuration } from '@/lib/utils';

interface WatchHistoryItem {
  id: string;
  videoId: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    name: string;
    displayName: string;
  };
  duration: number; // seconds
  watchedDuration: number; // seconds
  watchedPercentage: number;
  watchedAt: string;
  platform: 'youtube' | 'twitch' | 'niconico';
  category: string;
  isCompleted: boolean;
  viewCount: number;
  publishedAt: string;
}

interface WatchHistoryProps {
  searchQuery: string;
  timeFilter: 'all' | 'today' | 'week' | 'month';
}

// Mock 시청 기록 데이터
const MOCK_WATCH_HISTORY: WatchHistoryItem[] = [
  {
    id: '1',
    videoId: '1',
    title: '【歌ってみた】새로운 커버곡 / Ado',
    thumbnail: '',
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
    },
    duration: 263, // 4:23
    watchedDuration: 263,
    watchedPercentage: 100,
    watchedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    platform: 'youtube',
    category: '음악',
    isCompleted: true,
    viewCount: 520000,
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    videoId: '2',
    title: '【검증】1000만원의 〇〇 사봤다!',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
    },
    duration: 525, // 8:45
    watchedDuration: 320,
    watchedPercentage: 61,
    watchedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    platform: 'youtube',
    category: '엔터테인먼트',
    isCompleted: false,
    viewCount: 1200000,
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    videoId: '3',
    title: '【Live】특별 라이브 방송! 새로운 곡 공개',
    thumbnail: '',
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
    },
    duration: 2712, // 45:12
    watchedDuration: 1450,
    watchedPercentage: 53,
    watchedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    platform: 'youtube',
    category: '음악',
    isCompleted: false,
    viewCount: 340000,
    publishedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    videoId: '4',
    title: '【Q&A】팬들의 질문에 답해드려요!',
    thumbnail: '',
    creator: {
      id: 'ado',
      name: 'Ado',
      displayName: 'Ado',
    },
    duration: 1425, // 23:45
    watchedDuration: 890,
    watchedPercentage: 62,
    watchedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    platform: 'youtube',
    category: '소통',
    isCompleted: false,
    viewCount: 680000,
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    videoId: '5',
    title: '【Vlog】스튜디오에서의 하루',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
    },
    duration: 750, // 12:30
    watchedDuration: 750,
    watchedPercentage: 100,
    watchedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    platform: 'youtube',
    category: 'Vlog',
    isCompleted: true,
    viewCount: 920000,
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    videoId: '6',
    title: '【리뷰】새로운 음향 장비 테스트!',
    thumbnail: '',
    creator: {
      id: 'hikakin',
      name: '히카킨',
      displayName: '히카킨',
    },
    duration: 1102, // 18:22
    watchedDuration: 450,
    watchedPercentage: 41,
    watchedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1주일 전
    platform: 'youtube',
    category: '리뷰',
    isCompleted: false,
    viewCount: 450000,
    publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function WatchHistory({ searchQuery, timeFilter }: WatchHistoryProps): JSX.Element {
  const [historyItems, setHistoryItems] = useState<WatchHistoryItem[]>(MOCK_WATCH_HISTORY);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'progress'>('date');
  const [showCompleted, setShowCompleted] = useState(true);
  const [showIncomplete, setShowIncomplete] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // 필터링 및 정렬된 데이터
  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...historyItems];

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.creator.displayName.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    // 시간 필터
    const now = new Date();
    if (timeFilter !== 'all') {
      filtered = filtered.filter(item => {
        const watchedDate = new Date(item.watchedAt);
        switch (timeFilter) {
          case 'today': {
            return watchedDate.toDateString() === now.toDateString();
          }
          case 'week': {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return watchedDate >= weekAgo;
          }
          case 'month': {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            return watchedDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    // 완료/미완료 필터
    if (!showCompleted) {
      filtered = filtered.filter(item => !item.isCompleted);
    }
    if (!showIncomplete) {
      filtered = filtered.filter(item => item.isCompleted);
    }

    // 정렬
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime();
        case 'duration':
          return b.watchedDuration - a.watchedDuration;
        case 'progress':
          return b.watchedPercentage - a.watchedPercentage;
        default:
          return 0;
      }
    });

    return filtered;
  }, [historyItems, searchQuery, timeFilter, showCompleted, showIncomplete, sortBy]);

  const handleSelectAll = (checked: boolean): void => {
    if (checked) {
      setSelectedItems(new Set(filteredAndSortedItems.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (itemId: string, checked: boolean): void => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleDeleteSelected = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setHistoryItems(prev => prev.filter(item => !selectedItems.has(item.id)));
      setSelectedItems(new Set());
      setIsLoading(false);
    }, 1000);
  };

  const handleDeleteItem = async (itemId: string): Promise<void> => {
    setIsLoading(true);
    setTimeout(() => {
      setHistoryItems(prev => prev.filter(item => item.id !== itemId));
      setIsLoading(false);
    }, 500);
  };

  const getCreatorColor = (creatorId: string): string => {
    const colors = {
      ado: 'from-purple-400 to-pink-500',
      hikakin: 'from-blue-400 to-cyan-500',
    };
    return colors[creatorId as keyof typeof colors] || 'from-gray-400 to-gray-600';
  };

  const groupItemsByDate = (items: WatchHistoryItem[]): { [key: string]: WatchHistoryItem[] } => {
    const groups: { [key: string]: WatchHistoryItem[] } = {};
    
    items.forEach(item => {
      const date = new Date(item.watchedAt);
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      let groupKey: string;
      if (date.toDateString() === today.toDateString()) {
        groupKey = '오늘';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = '어제';
      } else {
        groupKey = formatDate(item.watchedAt, 'short');
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey]!.push(item);
    });
    
    return groups;
  };

  const groupedItems = groupItemsByDate(filteredAndSortedItems);

  if (isLoading && filteredAndSortedItems.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 animate-pulse">
            <div className="w-32 h-20 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredAndSortedItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">시청 기록이 없습니다</h3>
        <p className="text-muted-foreground mb-4">
          {searchQuery ? '검색 조건에 맞는 기록을 찾을 수 없습니다.' : '아직 시청한 영상이 없습니다.'}
        </p>
        <Link href="/">
          <Button>콘텐츠 둘러보기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 컨트롤 바 */}
      <div className="flex items-center justify-between py-2 border-b">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedItems.size === filteredAndSortedItems.length && filteredAndSortedItems.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              {selectedItems.size > 0 ? `${selectedItems.size}개 선택` : '전체 선택'}
            </span>
          </div>

          {selectedItems.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isLoading}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              선택 삭제
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* 필터 옵션 */}
          <div className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={showCompleted}
              onCheckedChange={setShowCompleted}
            />
            <span>완료</span>
            <Checkbox
              checked={showIncomplete}
              onCheckedChange={setShowIncomplete}
            />
            <span>미완료</span>
          </div>

          {/* 정렬 옵션 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                정렬: {sortBy === 'date' ? '최신순' : sortBy === 'duration' ? '시청시간순' : '진행률순'}
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('date')}>
                최신 시청순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('duration')}>
                시청 시간순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('progress')}>
                진행률순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 시청 기록 목록 */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([dateGroup, items]) => (
          <div key={dateGroup}>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 sticky top-0 bg-background py-2">
              {dateGroup} ({items.length}개)
            </h3>
            
            <div className="space-y-3">
              {items.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <div className="flex gap-4 p-4">
                    {/* 선택 체크박스 */}
                    <div className="flex items-start pt-2">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, !!checked)}
                      />
                    </div>

                    {/* 썸네일 */}
                    <Link href={`/video/${item.videoId}`} className="block">
                      <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden group">
                        <div className={cn(
                          "w-full h-full bg-gradient-to-br flex items-center justify-center group-hover:scale-105 transition-transform",
                          getCreatorColor(item.creator.id)
                        )}>
                          <Play className="h-6 w-6 text-white" />
                        </div>
                        
                        {/* 시청 진행률 표시 */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                          <div 
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${item.watchedPercentage}%` }}
                          />
                        </div>
                        
                        {/* 시청 시간 */}
                        <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                          {formatDuration(item.watchedDuration)} / {formatDuration(item.duration)}
                        </div>
                        
                        {/* 완료 표시 */}
                        {item.isCompleted ? <div className="absolute top-1 right-1 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle2 className="h-3 w-3" />
                          </div> : null}
                      </div>
                    </Link>

                    {/* 비디오 정보 */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/video/${item.videoId}`}>
                        <h3 className="font-medium text-sm line-clamp-2 mb-2 hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <div className={cn(
                              "w-4 h-4 rounded-full mr-2 flex items-center justify-center text-white text-xs font-bold",
                              `bg-gradient-to-r ${getCreatorColor(item.creator.id)}`
                            )}>
                              {item.creator.displayName.charAt(0)}
                            </div>
                            <span>{item.creator.displayName}</span>
                          </div>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{formatNumber(item.viewCount)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>시청: {formatDate(item.watchedAt, 'relative')}</span>
                          </div>
                          <span>•</span>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>게시: {formatDate(item.publishedAt, 'relative')}</span>
                          </div>
                        </div>

                        {/* 진행률 바 */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">시청 진행률</span>
                            <span className="font-medium">{item.watchedPercentage}%</span>
                          </div>
                          <Progress value={item.watchedPercentage} className="h-1" />
                        </div>
                      </div>
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
                          <DropdownMenuItem asChild>
                            <Link href={`/video/${item.videoId}`}>
                              <Play className="h-4 w-4 mr-2" />
                              다시 시청
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookmarkPlus className="h-4 w-4 mr-2" />
                            북마크 추가
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="h-4 w-4 mr-2" />
                            공유
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            기록에서 삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}