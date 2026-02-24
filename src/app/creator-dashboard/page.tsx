'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import {
  fetchCreatorDashboard,
  fetchMyPlatforms,
  selectMyCreatorInfo,
  selectDashboardStats,
  selectIsLoading,
} from '@/store/slices/creatorDashboardSlice';
import { StatsCards } from '@/components/creator-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, FileVideo, ArrowRight } from 'lucide-react';

export default function CreatorDashboardPage(): JSX.Element {
  useDocumentTitle('크리에이터 대시보드');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isInitialized } = useAuth();

  const creatorInfo = useAppSelector(selectMyCreatorInfo);
  const stats = useAppSelector(selectDashboardStats);
  const isLoading = useAppSelector(selectIsLoading);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isInitialized) return;

    const loadData = async () => {
      try {
        // 대시보드 정보 로드
        await dispatch(fetchCreatorDashboard()).unwrap();

        // 플랫폼 목록 로드
        await dispatch(fetchMyPlatforms());
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      }
    };

    loadData();
  }, [dispatch, isInitialized]);

  // 로딩 상태
  if (isLoading && !creatorInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 크리에이터 정보가 없는 경우
  if (!creatorInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>크리에이터 등록 필요</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              크리에이터 대시보드를 사용하려면 먼저 크리에이터로 등록해야 합니다.
            </p>
            <Button onClick={() => router.push('/')} className="w-full">
              홈으로 돌아가기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">대시보드 개요</h1>
        <p className="text-muted-foreground mt-1">{creatorInfo.name}님, 환영합니다!</p>
      </div>

      {/* 통계 카드 */}
      <div className="mb-8">
        <StatsCards stats={stats} isLoading={isLoading && !stats} />
      </div>

      {/* 빠른 액세스 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/creator-dashboard/platforms">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Link2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">플랫폼 관리</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      연동된 플랫폼 관리
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                YouTube, Twitter 등의 플랫폼을 추가하고 동기화 설정을 관리하세요
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/creator-dashboard/contents">
          <Card className="cursor-pointer transition-all hover:shadow-md hover:border-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileVideo className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">콘텐츠 관리</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      콘텐츠 공개 여부 관리
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                업로드된 콘텐츠의 공개/비공개 상태를 관리하고 삭제할 수 있습니다
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
