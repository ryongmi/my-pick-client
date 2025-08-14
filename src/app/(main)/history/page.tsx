'use client';

import { useState } from 'react';
import { Clock, Calendar, TrendingUp, BarChart3, Filter, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WatchHistory } from '@/components/history/watch-history';
import { HistoryFilters } from '@/components/history/history-filters';
import { ViewingStats } from '@/components/history/viewing-stats';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto p-4 lg:p-6">
        {/* 페이지 헤더 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Clock className="h-8 w-8 text-primary" />
                시청 기록
              </h1>
              <p className="text-muted-foreground mt-2">
                내가 시청한 모든 콘텐츠를 한 곳에서 확인하고 관리하세요
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                필터
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                기록 삭제
              </Button>
            </div>
          </div>

          {/* 검색 및 탭 */}
          <div className="space-y-4">
            {/* 검색 바 */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="시청 기록 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 시간 필터 탭 */}
            <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
              <TabsList className="grid w-full max-w-md grid-cols-4">
                <TabsTrigger value="all">전체</TabsTrigger>
                <TabsTrigger value="today">오늘</TabsTrigger>
                <TabsTrigger value="week">이번 주</TabsTrigger>
                <TabsTrigger value="month">이번 달</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* 필터 섹션 */}
        {showFilters ? <div className="mb-6">
            <HistoryFilters />
          </div> : null}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* 메인 시청 기록 */}
          <div className="xl:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  시청 기록
                </CardTitle>
              </CardHeader>
              <CardContent>
                <WatchHistory 
                  searchQuery={searchQuery}
                  timeFilter={activeTab}
                />
              </CardContent>
            </Card>
          </div>

          {/* 우측 사이드바 - 통계 */}
          <div className="xl:col-span-4">
            <div className="space-y-6">
              {/* 시청 통계 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    시청 통계
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ViewingStats timeFilter={activeTab} />
                </CardContent>
              </Card>

              {/* 자주 본 크리에이터 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    자주 본 크리에이터
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Mock 데이터 - 실제로는 WatchHistory에서 계산 */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
                          A
                        </div>
                        <div>
                          <p className="font-medium text-sm">Ado</p>
                          <p className="text-xs text-muted-foreground">12개 영상</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">2.5시간</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white text-sm font-bold">
                          히
                        </div>
                        <div>
                          <p className="font-medium text-sm">히카킨</p>
                          <p className="text-xs text-muted-foreground">8개 영상</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">1.8시간</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold">
                          K
                        </div>
                        <div>
                          <p className="font-medium text-sm">Kuzuha</p>
                          <p className="text-xs text-muted-foreground">5개 영상</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">1.2시간</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 시청 패턴 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">시청 패턴</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">가장 활발한 시간</span>
                        <span className="text-sm font-medium">21:00 - 23:00</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-primary rounded-full w-3/4"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">평균 시청 시간</span>
                        <span className="text-sm font-medium">12분</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-green-500 rounded-full w-2/3"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">완시청률</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full w-[68%]"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}