'use client';

import { useState } from 'react';
import { User, Settings, Bookmark, Activity, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/redux';
import { cn } from '@/lib/utils';

const MOCK_USER_STATS = {
  followedCreators: 12,
  watchedContent: 847,
  bookmarks: 234,
  likes: 1200,
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

const MOCK_FOLLOWED_CREATORS = [
  {
    id: 'ado',
    name: 'Ado',
    platforms: ['YouTube', 'Twitter'],
    followedSince: '2024년 3월',
  },
  {
    id: 'hikakin',
    name: '히카킨',
    platforms: ['YouTube', 'Twitter'],
    followedSince: '2024년 1월',
  },
];

export function ProfileView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('activity');

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
            <h3 className="text-lg font-semibold">팔로우 중인 크리에이터</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_FOLLOWED_CREATORS.map((creator) => (
                <Card key={creator.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center">
                      <div className={cn(
                        'w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold',
                        creator.id === 'ado' ? 'gradient-ado' : 'gradient-hikakin'
                      )}>
                        {creator.name.charAt(0)}
                      </div>
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium">{creator.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {creator.platforms.join(' • ')}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {creator.followedSince}부터 팔로우
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        팔로우 중
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'bookmarks':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">북마크한 콘텐츠</h3>
            <Card>
              <CardContent className="p-6 text-center">
                <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">아직 북마크한 콘텐츠가 없습니다.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  좋아하는 콘텐츠에 북마크를 추가해보세요!
                </p>
              </CardContent>
            </Card>
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
    <div className="max-w-4xl mx-auto p-6">
      {/* 프로필 헤더 */}
      <Card className="mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-indigo-600">{MOCK_USER_STATS.followedCreators}</p>
            <p className="text-sm text-muted-foreground mt-1">팔로우 크리에이터</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-green-600">{MOCK_USER_STATS.watchedContent}</p>
            <p className="text-sm text-muted-foreground mt-1">시청한 콘텐츠</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{MOCK_USER_STATS.bookmarks}</p>
            <p className="text-sm text-muted-foreground mt-1">북마크</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-3xl font-bold text-red-600">{MOCK_USER_STATS.likes}</p>
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
  );
}
