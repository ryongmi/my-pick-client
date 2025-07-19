'use client';

import { Users, Star, Video, Settings, BarChart, Database } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/redux';
import { useAdmin } from '@/hooks/redux';
import { setCurrentAdminPage } from '@/store/slices/adminSlice';
import { cn } from '@/lib/utils';

const ADMIN_MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: BarChart },
  { id: 'users', label: '사용자 관리', icon: Users },
  { id: 'creators', label: '크리에이터 관리', icon: Star },
  { id: 'content', label: '콘텐츠 모니터링', icon: Video },
  { id: 'api', label: 'API 키 관리', icon: Database },
  { id: 'settings', label: '시스템 설정', icon: Settings },
];

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

export function AdminView() {
  const dispatch = useAppDispatch();
  const { currentAdminPage } = useAdmin();

  const handleMenuClick = (pageId: string) => {
    dispatch(setCurrentAdminPage(pageId as any));
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 사용자</p>
                <p className="text-2xl font-bold">{MOCK_STATS.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  ↗ {MOCK_STATS.userGrowth}% 증가
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
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
                <p className="text-xs text-green-600 mt-1">
                  ↗ {MOCK_STATS.creatorGrowth}% 증가
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
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
                <p className="text-2xl font-bold">{MOCK_STATS.totalContent.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  ↗ {MOCK_STATS.contentGrowth}% 증가
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
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
                <p className="text-xs text-yellow-600 mt-1">
                  ⚠ 주의 필요
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Database className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 & 인기 크리에이터 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_RECENT_ACTIVITY.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={cn('w-2 h-2 rounded-full mr-3', activity.color)} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
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
                <div key={creator.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={cn(
                      'w-10 h-10 rounded-full mr-3 flex items-center justify-center text-white font-bold',
                      creator.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
                    )}>
                      {creator.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{creator.name}</p>
                      <p className="text-xs text-muted-foreground">
                        팔로워 {creator.followers.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-green-600">+{creator.growth}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">사용자 관리</h2>
          <p className="text-muted-foreground">등록된 사용자를 관리하고 권한을 설정합니다.</p>
        </div>
        <Button>새 사용자 추가</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">사용자 관리 기능이 여기에 표시됩니다.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderCreators = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">크리에이터 관리</h2>
          <p className="text-muted-foreground">등록된 크리에이터와 채널 정보를 관리합니다.</p>
        </div>
        <Button>크리에이터 추가</Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">크리에이터 관리 기능이 여기에 표시됩니다.</p>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (currentAdminPage) {
      case 'users':
        return renderUsers();
      case 'creators':
        return renderCreators();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex">
      {/* 관리자 사이드바 */}
      <aside className="w-64 bg-slate-900 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-white mb-6">관리자 메뉴</h2>
          <nav className="space-y-2">
            {ADMIN_MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={cn(
                    'w-full flex items-center px-4 py-2 text-left rounded-lg transition-colors',
                    currentAdminPage === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  )}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* 관리자 메인 콘텐츠 */}
      <main className="flex-1 p-6 bg-gray-50">
        {renderContent()}
      </main>
    </div>
  );
}
