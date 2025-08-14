'use client';

import { TrendingUp, Search, Flame, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrendingSearchesProps {
  onSearch: (query: string) => void;
}

interface TrendingItem {
  id: string;
  query: string;
  category: string;
  rank: number;
  changeType: 'up' | 'down' | 'new' | 'stable';
  changeValue?: number;
  searchCount: number;
  relatedKeywords: string[];
}

// Mock 인기 검색어 데이터
const MOCK_TRENDING_SEARCHES: TrendingItem[] = [
  {
    id: '1',
    query: 'Ado 새로운 커버곡',
    category: '음악',
    rank: 1,
    changeType: 'new',
    searchCount: 12500,
    relatedKeywords: ['Ado', '커버', 'J-Pop', '신곡'],
  },
  {
    id: '2',
    query: '히카킨 1000만원',
    category: '엔터테인먼트',
    rank: 2,
    changeType: 'up',
    changeValue: 3,
    searchCount: 9800,
    relatedKeywords: ['히카킨', '검증', '리뷰'],
  },
  {
    id: '3',
    query: 'VTuber 콜라보',
    category: '게임',
    rank: 3,
    changeType: 'up',
    changeValue: 1,
    searchCount: 7600,
    relatedKeywords: ['VTuber', '콜라보', '라이브'],
  },
  {
    id: '4',
    query: '요리 레시피',
    category: '요리',
    rank: 4,
    changeType: 'stable',
    searchCount: 6200,
    relatedKeywords: ['요리', '레시피', '간단요리'],
  },
  {
    id: '5',
    query: '일본 여행 vlog',
    category: '여행',
    rank: 5,
    changeType: 'down',
    changeValue: 2,
    searchCount: 5800,
    relatedKeywords: ['일본', '여행', 'vlog', '도쿄'],
  },
  {
    id: '6',
    query: '게임 리뷰',
    category: '게임',
    rank: 6,
    changeType: 'up',
    changeValue: 4,
    searchCount: 4900,
    relatedKeywords: ['게임', '리뷰', 'PS5', 'Switch'],
  },
  {
    id: '7',
    query: '운동 루틴',
    category: '운동',
    rank: 7,
    changeType: 'new',
    searchCount: 4200,
    relatedKeywords: ['홈트', '운동', '다이어트'],
  },
  {
    id: '8',
    query: 'K-POP 커버',
    category: '음악',
    rank: 8,
    changeType: 'stable',
    searchCount: 3800,
    relatedKeywords: ['K-POP', '커버', 'BTS', 'NewJeans'],
  },
];

// 시간대별 인기 검색어
const HOURLY_TRENDING = [
  { time: '현재', keywords: ['Ado', '히카킨', 'VTuber'] },
  { time: '1시간 전', keywords: ['게임리뷰', '요리', '여행'] },
  { time: '2시간 전', keywords: ['K-POP', '운동', '리뷰'] },
];

export function TrendingSearches({ onSearch }: TrendingSearchesProps) {
  const formatSearchCount = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  const getChangeIcon = (changeType: TrendingItem['changeType'], changeValue?: number) => {
    switch (changeType) {
      case 'up':
        return (
          <div className="flex items-center text-green-600">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span className="text-xs font-medium">+{changeValue}</span>
          </div>
        );
      case 'down':
        return (
          <div className="flex items-center text-red-600">
            <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
            <span className="text-xs font-medium">-{changeValue}</span>
          </div>
        );
      case 'new':
        return (
          <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-600">
            NEW
          </Badge>
        );
      default:
        return (
          <span className="text-xs text-muted-foreground">-</span>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      '음악': 'bg-purple-100 text-purple-700',
      '엔터테인먼트': 'bg-blue-100 text-blue-700',
      '게임': 'bg-green-100 text-green-700',
      '요리': 'bg-orange-100 text-orange-700',
      '여행': 'bg-cyan-100 text-cyan-700',
      '운동': 'bg-red-100 text-red-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* 실시간 인기 검색어 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500" />
            실시간 인기 검색어
            <Badge variant="secondary" className="text-xs animate-pulse">
              LIVE
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            {MOCK_TRENDING_SEARCHES.slice(0, 8).map((item) => (
              <div
                key={item.id}
                onClick={() => onSearch(item.query)}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* 순위 */}
                  <div className={cn(
                    "flex items-center justify-center w-6 h-6 rounded text-xs font-bold",
                    item.rank <= 3 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {item.rank}
                  </div>

                  {/* 검색어 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium group-hover:text-primary transition-colors">
                        {item.query}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", getCategoryColor(item.category))}
                      >
                        {item.category}
                      </Badge>
                    </div>
                    
                    {/* 관련 키워드 */}
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {item.relatedKeywords.slice(0, 3).map((keyword, index) => (
                        <span key={index} className="hover:text-primary cursor-pointer">
                          #{keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 변화 및 검색량 */}
                <div className="flex items-center gap-3 text-right">
                  <div className="text-xs text-muted-foreground">
                    {formatSearchCount(item.searchCount)}
                  </div>
                  {getChangeIcon(item.changeType, item.changeValue)}
                </div>
              </div>
            ))}
          </div>

          {/* 더보기 버튼 */}
          <div className="mt-4 pt-3 border-t">
            <Button variant="ghost" className="w-full text-sm">
              전체 순위 보기
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 시간대별 검색어 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            시간대별 인기 검색어
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {HOURLY_TRENDING.map((timeSlot, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {timeSlot.time}
                  </span>
                  {index === 0 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {timeSlot.keywords.map((keyword, keywordIndex) => (
                    <button
                      key={keywordIndex}
                      onClick={() => onSearch(keyword)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-full border transition-colors hover:bg-accent",
                        keywordIndex === 0 && index === 0 && "ring-2 ring-primary ring-offset-2"
                      )}
                    >
                      {keywordIndex + 1}. {keyword}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 추천 검색 키워드 */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            추천 검색 키워드
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">음악</h4>
              <div className="flex flex-wrap gap-2">
                {['J-POP', 'K-POP', '커버곡', '신곡', 'OST'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onSearch(keyword)}
                    className="px-3 py-1 text-sm border rounded-full hover:bg-purple-50 hover:border-purple-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">엔터테인먼트</h4>
              <div className="flex flex-wrap gap-2">
                {['리뷰', '언박싱', '검증', '챌린지', '예능'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onSearch(keyword)}
                    className="px-3 py-1 text-sm border rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-2 text-muted-foreground">라이프스타일</h4>
              <div className="flex flex-wrap gap-2">
                {['요리', '운동', '여행', 'vlog', '일상'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => onSearch(keyword)}
                    className="px-3 py-1 text-sm border rounded-full hover:bg-green-50 hover:border-green-200 transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}