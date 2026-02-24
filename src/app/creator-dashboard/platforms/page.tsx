'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/use-document-title';
import {
  fetchCreatorDashboard,
  fetchMyPlatforms,
  selectMyCreatorInfo,
  selectIsLoading,
} from '@/store/slices/creatorDashboardSlice';
import { PlatformsSection } from '@/components/creator-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PlatformsPage(): JSX.Element {
  useDocumentTitle('플랫폼 관리 - 크리에이터 대시보드');

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isInitialized } = useAuth();

  const creatorInfo = useAppSelector(selectMyCreatorInfo);
  const isLoading = useAppSelector(selectIsLoading);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isInitialized) return;

    const loadData = async () => {
      try {
        // 크리에이터 정보 로드
        await dispatch(fetchCreatorDashboard()).unwrap();

        // 플랫폼 목록 로드
        await dispatch(fetchMyPlatforms());
      } catch (error) {
        console.error('Failed to load platforms:', error);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold">플랫폼 관리</h1>
        <p className="text-muted-foreground mt-1">
          콘텐츠 동기화를 위한 플랫폼을 추가하고 관리하세요
        </p>
      </div>

      <PlatformsSection />
    </div>
  );
}
