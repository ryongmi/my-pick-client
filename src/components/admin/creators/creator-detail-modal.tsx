'use client';

import { X, ExternalLink, TrendingUp, TrendingDown, Users, Video, Eye, Heart, MessageCircle, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreatorDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any; // 크리에이터 데이터 타입
}

export function CreatorDetailModal({ isOpen, onClose, creator }: CreatorDetailModalProps) {
  if (!isOpen || !creator) {return null;}

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'inactive':
        return <XCircle className="h-5 w-5 text-red-500" />;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <Card className="border-0 shadow-none">
          <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold text-white',
                    creator.id === 'ado'
                      ? 'bg-gradient-to-r from-pink-400 to-purple-500'
                      : creator.id === 'hikakin'
                        ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                        : creator.id === 'pewdiepie'
                          ? 'bg-gradient-to-r from-red-400 to-pink-500'
                          : creator.id === 'mrBeast'
                            ? 'bg-gradient-to-r from-green-400 to-blue-500'
                            : 'bg-gradient-to-r from-gray-400 to-gray-600'
                  )}
                >
                  {creator.displayName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-2xl">{creator.displayName}</CardTitle>
                    <span className={cn('px-3 py-1 text-sm font-medium rounded-full', getStatusColor(creator.status))}>
                      {getStatusIcon(creator.status)}
                      <span className="ml-1">{getStatusText(creator.status)}</span>
                    </span>
                  </div>
                  <CardDescription className="text-lg mt-1">
                    {creator.platform} • @{creator.name}
                  </CardDescription>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      가입일: {creator.joinedDate}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      마지막 활동: {creator.lastActivity}
                    </div>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-6">
              {/* 주요 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">구독자</p>
                        <p className="text-2xl font-bold">{formatNumber(creator.subscriberCount)}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">총 영상</p>
                        <p className="text-2xl font-bold">{creator.totalVideos}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <Video className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">평균 조회수</p>
                        <p className="text-2xl font-bold">{formatNumber(creator.avgViews)}</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Eye className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">참여율</p>
                        <p className="text-2xl font-bold">{creator.engagementRate.toFixed(1)}%</p>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
                        <Heart className="h-5 w-5 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 성장 지표 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">월간 성장률</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {creator.monthlyGrowth > 0 ? (
                          <TrendingUp className="h-8 w-8 text-green-500" />
                        ) : (
                          <TrendingDown className="h-8 w-8 text-red-500" />
                        )}
                        <div>
                          <p className={cn(
                            'text-3xl font-bold',
                            creator.monthlyGrowth > 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            {creator.monthlyGrowth > 0 ? '+' : ''}{creator.monthlyGrowth.toFixed(1)}%
                          </p>
                          <p className="text-sm text-muted-foreground">지난 달 대비</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full',
                              creator.monthlyGrowth > 0 ? 'bg-green-500' : 'bg-red-500'
                            )}
                            style={{ width: `${Math.min(Math.abs(creator.monthlyGrowth) * 5, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">참여율 분석</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">좋아요 비율</span>
                        <span className="font-medium">{(creator.engagementRate * 0.6).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">댓글 비율</span>
                        <span className="font-medium">{(creator.engagementRate * 0.3).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">공유 비율</span>
                        <span className="font-medium">{(creator.engagementRate * 0.1).toFixed(1)}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 콘텐츠 카테고리 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">콘텐츠 카테고리</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {creator.contentCategories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 인기 영상 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">최고 인기 영상</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{creator.topVideo.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          업로드: {creator.topVideo.uploadDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatNumber(creator.topVideo.views)}</p>
                        <p className="text-sm text-muted-foreground">조회수</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 채널 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">채널 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">플랫폼</span>
                      <span>{creator.platform}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">채널 URL</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(creator.channelUrl, '_blank')}
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        채널 방문
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">인증 상태</span>
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full',
                        creator.verificationStatus === 'verified' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      )}>
                        {creator.verificationStatus === 'verified' ? '인증됨' : '대기중'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>

          {/* 액션 버튼 */}
          <div className="border-t p-6">
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                닫기
              </Button>
              <Button
                onClick={() => window.open(creator.channelUrl, '_blank')}
                className="flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                채널 방문
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}