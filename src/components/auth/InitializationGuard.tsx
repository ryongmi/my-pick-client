'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface InitializationGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 초기화 가드 컴포넌트
 *
 * initializeAuth() 완료 전까지 자식 컴포넌트 렌더링을 지연시킵니다.
 * API 호출이 있는 페이지에 적용하여 초기화 완료 후에만 데이터를 로드합니다.
 *
 * @example
 * ```tsx
 * export default function HomePage() {
 *   return (
 *     <InitializationGuard>
 *       <HomePageContent />
 *     </InitializationGuard>
 *   );
 * }
 * ```
 */
export function InitializationGuard({
  children,
  fallback
}: InitializationGuardProps): JSX.Element {
  const { isInitialized, loading } = useAuth();

  // 초기화 중이거나 로딩 중일 때 fallback 표시
  if (!isInitialized || loading) {
    return (
      <>
        {fallback || (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">앱을 준비하는 중...</p>
            </div>
          </div>
        )}
      </>
    );
  }

  // 초기화 완료 후에만 children 렌더링
  return <>{children}</>;
}
