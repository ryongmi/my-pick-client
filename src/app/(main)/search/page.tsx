'use client';

import { useState, useEffect } from 'react';
import { Search, Clock, User, Tag, SlidersHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UnifiedSearch } from '@/components/search/unified-search';
import { SearchFilters } from '@/components/search/search-filters';
import { SearchSuggestions } from '@/components/search/search-suggestions';
import { TrendingSearches } from '@/components/search/trending-searches';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'videos' | 'creators' | 'categories'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  useEffect(() => {
    // URL에서 검색어 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('q');
    if (searchParam) {
      setQuery(searchParam);
    }

    // 검색 기록 로드
    const savedHistory = localStorage.getItem('search-history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {return;}
    
    setQuery(searchQuery);
    
    // 검색 기록에 추가
    const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));

    // URL 업데이트
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('search-history');
  };

  const removeFromHistory = (item: string) => {
    const newHistory = searchHistory.filter(h => h !== item);
    setSearchHistory(newHistory);
    localStorage.setItem('search-history', JSON.stringify(newHistory));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Search className="h-8 w-8 text-primary" />
                통합 검색
              </h1>
              <p className="text-muted-foreground mt-2">
                모든 콘텐츠, 크리에이터, 카테고리를 한 번에 검색하세요
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                고급 필터
              </Button>
            </div>
          </div>

          {/* 검색 바 */}
          <div className="space-y-4">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-4 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="콘텐츠, 크리에이터, 태그 등을 검색하세요..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(query);
                  }
                }}
                className="pl-12 h-12 text-base border-2 focus:border-primary"
              />
              {query.trim() && (
                <Button
                  onClick={() => handleSearch(query)}
                  className="absolute right-2 top-2 h-8"
                  size="sm"
                >
                  검색
                </Button>
              )}
            </div>

            {/* 검색 타입 탭 */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="videos">영상</TabsTrigger>
                <TabsTrigger value="creators">크리에이터</TabsTrigger>
                <TabsTrigger value="categories">카테고리</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* 검색어 제안 및 기록 (검색하기 전) */}
        {!query && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* 인기 검색어 */}
            <TrendingSearches onSearch={handleSearch} />
            
            {/* 검색 기록 */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      최근 검색
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSearchHistory}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      전체 삭제
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {searchHistory.slice(0, 8).map((item, index) => (
                      <div key={index} className="flex items-center justify-between group">
                        <button
                          onClick={() => handleSearch(item)}
                          className="flex items-center gap-3 flex-1 text-left p-2 rounded hover:bg-accent transition-colors"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item}</span>
                        </button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromHistory(item)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* 검색어 자동완성 (타이핑 중) */}
        {query ? <div className="mb-6">
            <SearchSuggestions 
              query={query} 
              onSelect={handleSearch}
            />
          </div> : null}

        {/* 고급 필터 */}
        {showFilters ? <div className="mb-6">
            <SearchFilters />
          </div> : null}

        {/* 검색 결과 */}
        {query ? <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">검색 결과</h2>
                <Badge variant="secondary">
                  "{query}" 검색
                </Badge>
              </div>
              
              <div className="text-sm text-muted-foreground">
                약 1,240개 결과 (0.35초)
              </div>
            </div>

            <UnifiedSearch 
              query={query}
              searchType={activeTab}
            />
          </div> : null}

        {/* 검색하기 전 기본 상태 */}
        {!query && (
          <div className="space-y-8">
            {/* 추천 카테고리 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  인기 카테고리
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: '음악', count: 1250, color: 'bg-purple-500' },
                    { name: '엔터테인먼트', count: 890, color: 'bg-blue-500' },
                    { name: 'Vlog', count: 650, color: 'bg-green-500' },
                    { name: '리뷰', count: 420, color: 'bg-orange-500' },
                    { name: '게임', count: 380, color: 'bg-red-500' },
                    { name: '요리', count: 290, color: 'bg-yellow-500' },
                    { name: '운동', count: 240, color: 'bg-cyan-500' },
                    { name: '여행', count: 180, color: 'bg-pink-500' },
                  ].map((category) => (
                    <button
                      key={category.name}
                      onClick={() => handleSearch(category.name)}
                      className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors group"
                    >
                      <div className={`w-3 h-3 rounded-full ${category.color}`} />
                      <span className="font-medium">{category.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {category.count}개
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 인기 크리에이터 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  인기 크리에이터
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { id: 'ado', name: 'Ado', subscribers: '720만', category: '음악', color: 'from-purple-400 to-pink-500' },
                    { id: 'hikakin', name: '히카킨', subscribers: '540만', category: '엔터테인먼트', color: 'from-blue-400 to-cyan-500' },
                    { id: 'kuzuha', name: 'Kuzuha', subscribers: '180만', category: '게임', color: 'from-green-400 to-teal-500' },
                  ].map((creator) => (
                    <button
                      key={creator.id}
                      onClick={() => handleSearch(creator.name)}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors text-left"
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold`}>
                        {creator.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{creator.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          구독자 {creator.subscribers}명
                        </p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {creator.category}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}