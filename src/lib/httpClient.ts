import { ApiResponse } from '@/types';
import { HttpClient } from '@krgeobuk/http-client';
import type {
  MultiServerConfig,
  TokenRefreshConfig,
  SecurityPolicy,
} from '@krgeobuk/http-client/types';
import type { AxiosRequestConfig } from 'axios';

// =============================================================================
// HTTP CLIENT 설정
// =============================================================================

// 환경 변수 설정
const getEnvConfig = (): MultiServerConfig => ({
  auth: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    withCredentials: true,
  },
  authz: {
    baseURL: process.env.NEXT_PUBLIC_AUTHZ_API_URL || 'http://localhost:8100/api',
    timeout: 30000,
    withCredentials: true,
  },
  portal: {
    baseURL: process.env.NEXT_PUBLIC_PORTAL_API_URL || 'http://localhost:8200/api',
    timeout: 30000,
    withCredentials: true,
  },
  mypick: {
    baseURL: process.env.NEXT_PUBLIC_MYPICK_API_URL || 'http://localhost:8300/api',
    timeout: 30000,
    withCredentials: true,
  },
});

// 토큰 새로고침 설정
const tokenRefreshConfig: TokenRefreshConfig = {
  refreshUrl: 'http://localhost:8000/api/auth/refresh',
  refreshBeforeExpiry: 5, // 5분 전 갱신
};

// 보안 정책 설정
const getSecurityPolicy = (): Partial<SecurityPolicy> => {
  // 환경변수에서 허용된 오리진 읽기
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['localhost', 'krgeobuk.com', '127.0.0.1'];

  return {
    allowedOrigins,
    enableCSRF: false, // CSRF 보호 비활성화 (개발 환경)
    enableInputValidation: false, // 입력 검증 비활성화 (개발 환경)
    enableSecurityLogging: false, // 보안 로깅 비활성화
    rateLimitConfig: {
      maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '1000'),
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
    },
  };
};

// HttpClient 인스턴스 생성
export const httpClient = new HttpClient(
  getEnvConfig(),
  tokenRefreshConfig,
  getSecurityPolicy()
);

// =============================================================================
// 서버별 API 클라이언트 (Service 레이어에서 사용)
// =============================================================================

/**
 * Auth Server API 클라이언트
 */
export const authApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.get<T>('auth', url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.post<T>('auth', url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.put<T>('auth', url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.patch<T>('auth', url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.delete<T>('auth', url, config),
};

/**
 * Authz Server API 클라이언트
 */
export const authzApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.get<T>('authz', url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.post<T>('authz', url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.put<T>('authz', url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.patch<T>('authz', url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.delete<T>('authz', url, config),
};

/**
 * Portal Server API 클라이언트
 */
export const portalApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.get<T>('portal', url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.post<T>('portal', url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.put<T>('portal', url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.patch<T>('portal', url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.delete<T>('portal', url, config),
};

/**
 * MyPick Server API 클라이언트
 */
export const mypickApi = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.get<T>('mypick', url, config),
  post: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.post<T>('mypick', url, data, config),
  put: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.put<T>('mypick', url, data, config),
  patch: <T = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> => httpClient.patch<T>('mypick', url, data, config),
  delete: <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> =>
    httpClient.delete<T>('mypick', url, config),
};




export const tokenManager = httpClient.getTokenManager();

// =============================================================================
// 보안 관리 함수
// =============================================================================

export const securityManager = {
  /**
   * 세션 갱신
   */
  refreshSession: (): void => {
    httpClient.refreshSession();
  },

  /**
   * 보안 정책 업데이트
   */
  updateSecurityPolicy: (policy: Partial<SecurityPolicy>): void => {
    httpClient.updateSecurityPolicy(policy);
  },

  /**
   * 사용 가능한 서버 목록 조회
   */
  getAvailableServers: (): string[] => {
    return httpClient.getAvailableServers();
  },

  /**
   * 정리 (메모리 누수 방지)
   */
  cleanup: (): void => {
    httpClient.cleanup();
  },
};

// =============================================================================
// 에러 처리 유틸리티
// =============================================================================

export const errorUtils = {
  /**
   * krgeobuk 서버 에러인지 확인
   */
  isKrgeobukError(error: unknown): boolean {
    const typedError = error as { response?: { data?: { code?: unknown } } };
    return !!typedError.response?.data?.code && typeof typedError.response.data.code === 'string';
  },

  /**
   * 에러 코드 추출
   */
  getErrorCode(error: unknown): string | null {
    const typedError = error as { response?: { data?: { code?: string } } };
    return typedError.response?.data?.code || null;
  },

  /**
   * 사용자 친화적 에러 메시지 추출
   */
  getUserMessage(error: unknown): string {
    const typedError = error as { response?: { data?: { message?: string } }; message?: string };

    if (typedError.response?.data?.message) {
      return typedError.response.data.message;
    }

    if (typedError.message) {
      return typedError.message;
    }

    return '알 수 없는 오류가 발생했습니다.';
  },

  /**
   * 재시도 가능한 에러인지 확인
   */
  isRetryableError(error: unknown): boolean {
    const typedError = error as { response?: { status?: number } };
    const status = typedError.response?.status;

    // 네트워크 오류나 서버 오류는 재시도 가능
    if (!status || status >= 500) {
      return true;
    }

    // 레이트 리미트는 재시도 가능
    if (status === 429) {
      return true;
    }

    return false;
  },

  /**
   * 인증 관련 에러인지 확인
   */
  isAuthError(error: unknown): boolean {
    const typedError = error as { response?: { status?: number } };
    const status = typedError.response?.status;
    const code = this.getErrorCode(error);

    return (
      status === 401 ||
      code === 'AUTH_TOKEN_EXPIRED' ||
      code === 'JWT_EXPIRED' ||
      (code?.startsWith('AUTH_') || false)
    );
  },
};

// 기본 export
export default httpClient;
