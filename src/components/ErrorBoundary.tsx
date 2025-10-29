'use client';

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary
 *
 * React 컴포넌트 트리에서 발생하는 JavaScript 에러를 포착하여
 * 전체 앱이 크래시되는 것을 방지합니다.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // 다음 렌더링에서 폴백 UI가 보이도록 상태 업데이트
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // 에러 로깅 서비스에 전송 가능
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: 프로덕션 환경에서는 에러 로깅 서비스로 전송
    // 예: Sentry.captureException(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // 커스텀 폴백 UI가 제공되면 사용
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 기본 폴백 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <div className="mb-6">
              <svg
                className="mx-auto h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold mb-4 text-foreground">
              문제가 발생했습니다
            </h1>

            <p className="text-muted-foreground mb-6">
              애플리케이션에서 오류가 발생했습니다.
              <br />
              페이지를 새로고침하면 해결될 수 있습니다.
            </p>

            {this.state.error && process.env.NODE_ENV === 'development' && (
              <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <summary className="cursor-pointer font-medium text-sm mb-2">
                  에러 상세 정보 (개발 환경에서만 표시)
                </summary>
                <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              페이지 새로고침
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
