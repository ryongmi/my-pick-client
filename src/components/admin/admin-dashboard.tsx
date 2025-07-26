'use client';

import { Users, Star, Video, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const MOCK_STATS = {
  totalUsers: 12345,
  totalCreators: 487,
  totalContent: 1892,
  apiUsage: 89,
  userGrowth: 12,
  creatorGrowth: 8,
  contentGrowth: 23,
};

const MOCK_RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'user_joined',
    message: '새 사용자 가입: user1234',
    time: '2분 전',
    color: 'bg-green-500',
  },
  {
    id: '2',
    type: 'creator_added',
    message: '크리에이터 등록: NewCreator',
    time: '15분 전',
    color: 'bg-blue-500',
  },
  {
    id: '3',
    type: 'api_warning',
    message: 'API 할당량 80% 도달',
    time: '1시간 전',
    color: 'bg-yellow-500',
  },
];

const MOCK_POPULAR_CREATORS = [
  {
    id: 'ado',
    name: 'Ado',
    followers: 15200,
    growth: 12,
  },
  {
    id: 'hikakin',
    name: '히카킨',
    followers: 12800,
    growth: 8,
  },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">관리자 대시보드</h1>
        <p className="mt-2 text-gray-600">
          MyPick 시스템의 전체 현황을 한눈에 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 사용자</p>
                <p className="text-2xl font-bold">
                  {MOCK_STATS.totalUsers.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.userGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">등록 크리에이터</p>
                <p className="text-2xl font-bold">{MOCK_STATS.totalCreators}</p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.creatorGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">오늘의 콘텐츠</p>
                <p className="text-2xl font-bold">
                  {MOCK_STATS.totalContent.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-green-600">
                  ↗ {MOCK_STATS.contentGrowth}% 증가
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API 사용량</p>
                <p className="text-2xl font-bold">{MOCK_STATS.apiUsage}%</p>
                <p className="mt-1 text-xs text-yellow-600">⚠ 주의 필요</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
                <Database className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 & 인기 크리에이터 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div
                    className={cn('mr-3 h-2 w-2 rounded-full', activity.color)}
                  />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>인기 크리에이터</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_POPULAR_CREATORS.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div
                      className={cn(
                        'mr-3 flex h-10 w-10 items-center justify-center rounded-full font-bold text-white',
                        creator.id === 'ado'
                          ? 'gradient-ado'
                          : 'gradient-hikakin'
                      )}
                    >
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        팔로워 {creator.followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">
                    +{creator.growth}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}