'use client';

import { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Calendar,
  Globe,
  Youtube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  History,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  fetchUserDetail,
} from '@/store/slices/userManagementSlice';
import { cn } from '@/lib/utils';
import { MyPickUser, UserDetailInfo } from '@/types/userManagement';

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function UserDetailModal({ isOpen, onClose, userId }: UserDetailModalProps) {
  const dispatch = useAppDispatch();
  const { userDetail, isLoadingDetail, error } = useAppSelector(
    (state) => state.userManagement
  );

  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'api' | 'content'>('profile');

  // 사용자 상세 정보 로드
  useEffect(() => {
    if (isOpen && userId) {
      dispatch(fetchUserDetail(userId));
    }
  }, [dispatch, isOpen, userId]);


  if (!isOpen) {return null;}


  const renderProfileTab = () => {
    if (!userDetail?.user) {return null;}

    const user = userDetail.user;

    return (
      <div className="space-y-6">
        {/* 기본 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-medium text-gray-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      user.userType === 'creator' 
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-gray-100 text-gray-700'
                    )}>
                      {user.userType === 'creator' ? '크리에이터' : '일반 사용자'}
                    </span>
                    <span className={cn(
                      'px-2 py-1 rounded-full text-xs font-medium',
                      user.serviceStatus === 'active' 
                        ? 'bg-green-100 text-green-700'
                        : user.serviceStatus === 'inactive'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-red-100 text-red-700'
                    )}>
                      {user.serviceStatus === 'active' ? '활성' : 
                       user.serviceStatus === 'inactive' ? '비활성' : '정지'}
                    </span>
                  </div>
                </>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* 메타 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              계정 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">가입일</label>
                <p className="text-sm">{new Date(user.createdAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">마지막 수정</label>
                <p className="text-sm">{new Date(user.updatedAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">마지막 로그인</label>
                <p className="text-sm">
                  {user.lastLoginAt 
                    ? new Date(user.lastLoginAt).toLocaleDateString('ko-KR')
                    : '없음'
                  }
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">역할</label>
                <p className="text-sm">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* YouTube 연동 정보 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="h-5 w-5 text-red-500" />
              YouTube 연동
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user.youtubeConnection.isConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">연동됨</span>
                  {user.youtubeConnection.hasError ? <AlertTriangle className="h-4 w-4 text-red-500" /> : null}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-muted-foreground">채널명</label>
                    <p>{user.youtubeConnection.channelName || '-'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">구독자 수</label>
                    <p>{user.youtubeConnection.subscriberCount?.toLocaleString() || '-'}</p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">연동일</label>
                    <p>
                      {user.youtubeConnection.connectedAt 
                        ? new Date(user.youtubeConnection.connectedAt).toLocaleDateString('ko-KR')
                        : '-'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="font-medium text-muted-foreground">마지막 동기화</label>
                    <p>
                      {user.youtubeConnection.lastSyncAt 
                        ? new Date(user.youtubeConnection.lastSyncAt).toLocaleDateString('ko-KR')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
                
                {user.youtubeConnection.hasError ? <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-700">
                      <strong>오류:</strong> {user.youtubeConnection.errorMessage}
                    </p>
                  </div> : null}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <XCircle className="h-4 w-4" />
                <span className="text-sm">YouTube 계정이 연동되지 않음</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderActivityTab = () => {
    if (!userDetail?.activityLog) {return null;}

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            활동 기록
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userDetail.activityLog.map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded">
                <div className={cn(
                  'p-1 rounded-full',
                  log.type === 'login' ? 'bg-green-100' :
                  log.type === 'logout' ? 'bg-gray-100' :
                  log.type === 'error' ? 'bg-red-100' :
                  'bg-blue-100'
                )}>
                  {log.type === 'login' ? <CheckCircle className="h-3 w-3 text-green-600" /> :
                   log.type === 'logout' ? <XCircle className="h-3 w-3 text-gray-600" /> :
                   log.type === 'error' ? <AlertTriangle className="h-3 w-3 text-red-600" /> :
                   <Activity className="h-3 w-3 text-blue-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderApiTab = () => {
    if (!userDetail?.user || !userDetail?.apiUsageHistory) {return null;}

    const user = userDetail.user;

    return (
      <div className="space-y-6">
        {/* API 사용량 현황 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              API 사용량 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">이번 달 사용량</label>
                <p className="text-2xl font-bold">
                  {user.apiUsage.currentMonth.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  / {user.apiUsage.monthlyLimit.toLocaleString()} (월 한도)
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">일일 한도</label>
                <p className="text-2xl font-bold">
                  {user.apiUsage.dailyLimit.toLocaleString()}
                </p>
                <p className={cn(
                  'text-sm',
                  user.apiUsage.quotaExceeded ? 'text-red-600' : 'text-green-600'
                )}>
                  {user.apiUsage.quotaExceeded ? '한도 초과' : '정상'}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={cn(
                    'h-2 rounded-full',
                    user.apiUsage.quotaExceeded 
                      ? 'bg-red-500' 
                      : user.apiUsage.currentMonth / user.apiUsage.monthlyLimit > 0.8
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  )}
                  style={{
                    width: `${Math.min(
                      (user.apiUsage.currentMonth / user.apiUsage.monthlyLimit) * 100,
                      100
                    )}%`
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                사용률: {Math.round((user.apiUsage.currentMonth / user.apiUsage.monthlyLimit) * 100)}%
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 사용량 히스토리 */}
        <Card>
          <CardHeader>
            <CardTitle>최근 7일 사용량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userDetail.apiUsageHistory.map((history, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{history.date}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{history.calls}</span>
                    <div className="w-16 bg-gray-200 rounded-full h-1">
                      <div 
                        className="h-1 rounded-full bg-blue-500"
                        style={{
                          width: `${Math.min((history.calls / history.quota) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContentTab = () => {
    if (!userDetail?.user || !userDetail?.contentHistory) {return null;}

    const user = userDetail.user;

    return (
      <div className="space-y-6">
        {/* 콘텐츠 통계 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              콘텐츠 통계
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">총 영상 수</label>
                <p className="text-2xl font-bold">{user.contentStats.videoCount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">총 조회수</label>
                <p className="text-2xl font-bold">{user.contentStats.totalViews.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">총 좋아요</label>
                <p className="text-2xl font-bold">{user.contentStats.totalLikes.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">평균 조회수</label>
                <p className="text-2xl font-bold">{user.contentStats.averageViews.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 최근 콘텐츠 */}
        {userDetail.contentHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>최근 콘텐츠</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userDetail.contentHistory.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{content.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(content.uploadedAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">조회수: {content.views.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        좋아요: {content.likes.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">사용자 상세 정보</h2>
            {userDetail?.user ? <p className="text-sm text-muted-foreground">
                {userDetail.user.name} ({userDetail.user.email})
              </p> : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b">
          {[
            { id: 'profile', label: '프로필', icon: User },
            { id: 'activity', label: '활동', icon: Activity },
            { id: 'api', label: 'API', icon: BarChart3 },
            { id: 'content', label: '콘텐츠', icon: History },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {isLoadingDetail ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">사용자 정보를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'activity' && renderActivityTab()}
              {activeTab === 'api' && renderApiTab()}
              {activeTab === 'content' && renderContentTab()}
            </>
          )}
        </div>
      </div>
    </div>
  );
}