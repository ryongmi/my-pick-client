import { HttpClient } from '@krgeobuk/http-client';
import type { 
  MultiServerConfig, 
  TokenRefreshConfig, 
  SecurityPolicy 
} from '@krgeobuk/http-client/types';
import type { ApiResponse, PaginatedResponse, User } from '@/types';

// 환경 변수 설정
const getEnvConfig = (): MultiServerConfig => ({
  auth: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000',
    timeout: 10000,
    withCredentials: true,
  },
  authz: {
    baseURL: process.env.NEXT_PUBLIC_AUTHZ_API_URL || 'http://localhost:8100',
    timeout: 30000,
    withCredentials: true,
  },
  mypick: {
    baseURL: process.env.NEXT_PUBLIC_MYPICK_API_URL || 'http://localhost:8300',
    timeout: 30000,
    withCredentials: true,
  },
  portal: {
    baseURL: process.env.NEXT_PUBLIC_PORTAL_API_URL || 'http://localhost:8400',
    timeout: 30000,
    withCredentials: true,
  }
});

// 토큰 새로고침 설정
const tokenRefreshConfig: TokenRefreshConfig = {
  refreshUrl: process.env.TOKEN_REFRESH_URL || '/auth/refresh',
  refreshBeforeExpiry: 5, // 5분 전 갱신
};

// 보안 정책 설정
const getSecurityPolicy = (): Partial<SecurityPolicy> => {
  // 환경변수에서 허용된 오리진 읽기
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['localhost', 'krgeobuk.com', '127.0.0.1'];

  return {
    allowedOrigins,
    enableCSRF: process.env.CSRF_PROTECTION_ENABLED !== 'false',
    enableInputValidation: true,
    enableSecurityLogging: process.env.SECURITY_LOGGING_ENABLED === 'true',
    rateLimitConfig: {
      maxAttempts: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '100'),
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
// AUTH API (auth-server)
// =============================================================================

export const authApi = {
  login: (credentials: { email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> =>
    httpClient.post<{ user: User; token: string }>('auth', '/auth/login', credentials),
  
  register: (data: { name: string; email: string; password: string }): Promise<ApiResponse<{ user: User }>> =>
    httpClient.post<{ user: User }>('auth', '/auth/register', data),
  
  logout: (): Promise<ApiResponse<unknown>> => 
    httpClient.post('auth', '/auth/logout'),
  
  refreshToken: (): Promise<ApiResponse<{ accessToken: string }>> => 
    httpClient.post<{ accessToken: string }>('auth', '/auth/refresh'),
  
  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => 
    httpClient.put('auth', '/auth/profile', data),

  // authSlice에서 사용하는 메서드들 추가
  post: (url: string, data?: unknown): Promise<ApiResponse<unknown>> => 
    httpClient.post('auth', url, data),
  
  get: <T>(url: string): Promise<ApiResponse<T>> => 
    httpClient.get<T>('auth', url),
};

// =============================================================================
// USER API (auth-server)
// =============================================================================

export const userApi = {
  getProfile: (): Promise<ApiResponse<User>> => 
    httpClient.get('auth', '/users/profile'),
  
  updateProfile: (data: Partial<User>): Promise<ApiResponse<User>> => 
    httpClient.put('auth', '/users/profile', data),
  
  getSettings: (): Promise<ApiResponse<unknown>> => 
    httpClient.get('auth', '/users/settings'),
  
  updateSettings: (settings: Record<string, unknown>): Promise<ApiResponse<unknown>> => 
    httpClient.put('auth', '/users/settings', settings),
  
  // 사용자 구독 관리
  getSubscriptions: (): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', '/me/subscriptions'),
};

// =============================================================================
// CREATOR API (my-pick-server)
// =============================================================================

export const creatorApi = {
  getCreators: (params?: Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<unknown>>> => 
    httpClient.get<PaginatedResponse<unknown>>('authz', '/creators', { params }),
  
  getCreator: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', `/creators/${id}`),
  
  // 구독 API (JWT 기반 - userId 자동 추출)
  followCreator: (creatorId: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/me/subscriptions/${creatorId}`),
  
  unfollowCreator: (creatorId: string): Promise<ApiResponse<unknown>> => 
    httpClient.delete('mypick', `/me/subscriptions/${creatorId}`),
  
  checkSubscription: (creatorId: string): Promise<ApiResponse<{ subscribed: boolean }>> => 
    httpClient.get('mypick', `/me/subscriptions/${creatorId}/exists`),
  
  getCreatorSubscribers: (creatorId: string): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', `/creators/${creatorId}/subscribers`),
  
  addCreator: (data: Record<string, unknown>): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', '/creators', data),
  
  updateCreator: (id: string, data: Record<string, unknown>): Promise<ApiResponse<unknown>> => 
    httpClient.put('mypick', `/creators/${id}`, data),
  
  deleteCreator: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.delete('mypick', `/creators/${id}`),
  
  getCreatorStats: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', `/creators/${id}/stats`),
  
  syncCreator: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/creators/${id}/sync`),
  
  // Toggle function for easier usage
  toggleFollow: async (creatorId: string, isCurrentlyFollowing: boolean): Promise<ApiResponse<unknown>> => {
    return isCurrentlyFollowing 
      ? creatorApi.unfollowCreator(creatorId)
      : creatorApi.followCreator(creatorId);
  },
};

// =============================================================================
// CONTENT API (my-pick-server)
// =============================================================================

export const contentApi = {
  getContent: (params?: Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<unknown>>> => 
    httpClient.get<PaginatedResponse<unknown>>('authz', '/content', { params }),
  
  getContentById: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', `/content/${id}`),
  
  bookmarkContent: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/content/${id}/bookmark`),
  
  removeBookmark: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.delete('mypick', `/content/${id}/bookmark`),
  
  likeContent: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/content/${id}/like`),
  
  unlikeContent: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.delete('mypick', `/content/${id}/like`),
  
  getBookmarks: (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<unknown>>> =>
    httpClient.get<PaginatedResponse<unknown>>('authz', '/content/bookmarks', { params: { page, limit } }),
  
  searchContent: (query: string, filters?: Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<unknown>>> =>
    httpClient.get('mypick', '/content/search', { params: { q: query, ...filters } }),
  
  // Toggle functions for easier usage
  toggleBookmark: async (id: string, isCurrentlyBookmarked: boolean): Promise<ApiResponse<unknown>> => {
    return isCurrentlyBookmarked 
      ? contentApi.removeBookmark(id)
      : contentApi.bookmarkContent(id);
  },
  
  toggleLike: async (id: string, isCurrentlyLiked: boolean): Promise<ApiResponse<unknown>> => {
    return isCurrentlyLiked 
      ? contentApi.unlikeContent(id)
      : contentApi.likeContent(id);
  },
};

// =============================================================================
// NOTIFICATION API (keep mock for now - no server implementation)
// =============================================================================

// 알림은 아직 서버에 구현되지 않았으므로 mock 유지
import { mockNotificationApi } from './mockApi';

export const notificationApi = mockNotificationApi;

// =============================================================================
// ADMIN API (my-pick-server)
// =============================================================================

export const adminApi = {
  getDashboardStats: (): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', '/admin/dashboard'),
  
  getUsers: (params?: Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<unknown>>> => 
    httpClient.get<PaginatedResponse<unknown>>('authz', '/admin/users', { params }),
  
  getUser: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.get('mypick', `/admin/users/${id}`),
  
  updateUser: (id: string, data: Record<string, unknown>): Promise<ApiResponse<unknown>> => 
    httpClient.put('mypick', `/admin/users/${id}`, data),
  
  deleteUser: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.delete('mypick', `/admin/users/${id}`),
  
  getCreators: (params?: Record<string, unknown>): Promise<ApiResponse<PaginatedResponse<unknown>>> => 
    httpClient.get<PaginatedResponse<unknown>>('authz', '/admin/creators', { params }),
  
  approveCreator: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/admin/creators/${id}/approve`),
  
  rejectCreator: (id: string): Promise<ApiResponse<unknown>> => 
    httpClient.post('mypick', `/admin/creators/${id}/reject`),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// 에러 처리 유틸리티 함수들
export const errorUtils = {
  // krgeobuk 서버 에러인지 확인
  isKrgeobukError(error: unknown): boolean {
    const typedError = error as { response?: { data?: { code?: unknown } } };
    return !!typedError.response?.data?.code && typeof typedError.response.data.code === 'string';
  },
  
  // 에러 코드 추출
  getErrorCode(error: unknown): string | null {
    const typedError = error as { response?: { data?: { code?: string } } };
    return typedError.response?.data?.code || null;
  },
  
  // 사용자 친화적 에러 메시지 추출
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
  
  // 재시도 가능한 에러인지 확인
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
  
  // 인증 관련 에러인지 확인
  isAuthError(error: unknown): boolean {
    const typedError = error as { response?: { status?: number } };
    const status = typedError.response?.status;
    const code = this.getErrorCode(error);
    
    return status === 401 || 
           code === 'AUTH_TOKEN_EXPIRED' || 
           code === 'JWT_EXPIRED' ||
           (code?.startsWith('AUTH_') || false);
  }
};

// 토큰 관리 함수
export const tokenManager = {
  setAccessToken: (token: string): void => {
    httpClient.getTokenManager().setAccessToken(token);
  },
  
  clearAccessToken: (): void => {
    httpClient.getTokenManager().clearAccessToken();
  },
  
  isAuthenticated: (): boolean => {
    return !!httpClient.getTokenManager().getAccessToken();
  },
  
  getAccessToken: (): string | null => {
    return httpClient.getTokenManager().getAccessToken();
  },

  isValidToken: (token: string): boolean => {
    try {
      // JWT 토큰 유효성 검사 (만료 시간 확인)
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        return false;
      }
      const payload = JSON.parse(atob(tokenParts[1] || '')) as { exp?: number };
      const now = Date.now() / 1000;
      return typeof payload.exp === 'number' && payload.exp > now;
    } catch {
      return false;
    }
  }
};

// 보안 관리 함수
export const securityManager = {
  refreshSession: (): void => {
    httpClient.refreshSession();
  },
  
  updateSecurityPolicy: (policy: Partial<SecurityPolicy>): void => {
    httpClient.updateSecurityPolicy(policy);
  },
  
  getAvailableServers: (): string[] => {
    return httpClient.getAvailableServers();
  },
  
  cleanup: (): void => {
    httpClient.cleanup();
  }
};

// 기본 export
export default httpClient;