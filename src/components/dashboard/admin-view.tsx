'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Star, Video, Settings, BarChart, Database, 
  Search, Filter, MoreHorizontal, ExternalLink, 
  CheckCircle, Clock, XCircle, TrendingUp, TrendingDown,
  Eye, Calendar, Tag, Hash
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/redux';
import { useAdmin } from '@/hooks/redux';
import { setCurrentAdminPage } from '@/store/slices/adminSlice';
import { cn } from '@/lib/utils';
import { mockCreators } from '@/data/creators';
import { Creator } from '@/types';

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

// 관리자 페이지용 크리에이터 데이터 가공
const transformCreatorForAdmin = (creator: Creator) => {
  const youtubeData = creator.platforms.find(p => p.type === 'youtube');
  const twitterData = creator.platforms.find(p => p.type === 'twitter');
  
  return {
    id: creator.id,
    name: creator.name,
    displayName: creator.displayName,
    platform: 'YouTube',
    channelUrl: youtubeData?.url || '',
    subscriberCount: creator.followerCount,
    totalVideos: creator.contentCount,
    avgViews: Math.floor(creator.totalViews / creator.contentCount),
    status: creator.isVerified ? 'active' : 'pending',
    verificationStatus: creator.isVerified ? 'verified' : 'pending',
    joinedDate: creator.createdAt.split('T')[0],
    lastActivity: creator.updatedAt.split('T')[0],
    contentCategories: creator.description ? ['음악', '엔터테인먼트'] : ['게임', '리뷰'],
    monthlyGrowth: Math.random() * 20 - 5, // -5% ~ 15% 랜덤 성장률
    engagementRate: Math.random() * 15 + 5, // 5% ~ 20% 랜덤 참여율
    topVideo: {
      title: `${creator.displayName}의 인기 영상`,
      views: Math.floor(creator.totalViews * 0.1),
      uploadDate: new Date().toISOString().split('T')[0]
    }
  };
};

export function AdminView() {
  const dispatch = useAppDispatch();
  const { currentAdminPage } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCreators, setSelectedCreators] = useState<string[]>([]);
  const [adminCreatorsData, setAdminCreatorsData] = useState<any[]>([]);

  // Mock 데이터를 관리자 페이지 형식으로 변환
  useEffect(() => {
    const transformedData = mockCreators.map(transformCreatorForAdmin);
    setAdminCreatorsData(transformedData);
  }, []);

  const handleMenuClick = (pageId: string) => {
    dispatch(setCurrentAdminPage(pageId as any));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '활성';
      case 'pending':
        return '대기중';
      case 'inactive':
        return '비활성';
      default:
        return status;
    }
  };

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const filteredCreators = adminCreatorsData.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || creator.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
      {/* 헤더 및 액션 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">크리에이터 관리</h2>
          <p className="text-muted-foreground">등록된 크리에이터와 채널 정보를 관리합니다.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">일괄 작업</Button>
          <Button>크리에이터 추가</Button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 크리에이터</p>
                <p className="text-2xl font-bold">{adminCreatorsData.length}</p>
              </div>
              <Star className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">활성 크리에이터</p>
                <p className="text-2xl font-bold">{adminCreatorsData.filter(c => c.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">승인 대기</p>
                <p className="text-2xl font-bold">{adminCreatorsData.filter(c => c.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">총 구독자</p>
                <p className="text-2xl font-bold">{formatNumber(adminCreatorsData.reduce((sum, c) => sum + c.subscriberCount, 0))}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="크리에이터 이름으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">모든 상태</option>
                <option value="active">활성</option>
                <option value="pending">대기중</option>
                <option value="inactive">비활성</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                필터
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 크리에이터 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>크리에이터 목록 ({filteredCreators.length}명)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-sm">크리에이터</th>
                  <th className="text-left p-4 font-medium text-sm">구독자</th>
                  <th className="text-left p-4 font-medium text-sm">성장률</th>
                  <th className="text-left p-4 font-medium text-sm">참여율</th>
                  <th className="text-left p-4 font-medium text-sm">상태</th>
                  <th className="text-left p-4 font-medium text-sm">마지막 활동</th>
                  <th className="text-left p-4 font-medium text-sm">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredCreators.map((creator) => (
                  <tr key={creator.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm',
                          creator.id === 'ado' ? 'bg-gradient-to-r from-pink-400 to-purple-500' :
                          creator.id === 'hikakin' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                          creator.id === 'pewdiepie' ? 'bg-gradient-to-r from-red-400 to-pink-500' :
                          creator.id === 'mrBeast' ? 'bg-gradient-to-r from-green-400 to-blue-500' :
                          'bg-gradient-to-r from-gray-400 to-gray-600'
                        )}>
                          {creator.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{creator.displayName}</p>
                            {getVerificationIcon(creator.verificationStatus)}
                          </div>
                          <p className="text-sm text-muted-foreground">{creator.platform}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {creator.contentCategories.slice(0, 2).map((category, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{formatNumber(creator.subscriberCount)}</p>
                        <p className="text-sm text-muted-foreground">{creator.totalVideos} 영상</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        {creator.monthlyGrowth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500" />
                        )}
                        <span className={cn(
                          "font-medium",
                          creator.monthlyGrowth > 0 ? "text-green-600" : "text-red-600"
                        )}>
                          {creator.monthlyGrowth > 0 ? '+' : ''}{creator.monthlyGrowth}%
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${Math.min(creator.engagementRate * 10, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{creator.engagementRate}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(creator.status)}
                        <span className="text-sm">{getStatusText(creator.status)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm">{creator.lastActivity}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
    <div className="w-full max-w-none">
      <div className="space-y-6">
        {/* 관리자 메뉴 탭 */}
        <div className="border-b border-gray-200">
          <div className="w-full overflow-x-auto">
            <nav className="flex space-x-8 min-w-max">
              {ADMIN_MENU_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={cn(
                      'flex items-center px-1 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                      currentAdminPage === item.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 관리자 메인 콘텐츠 */}
        <div className="w-full">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
