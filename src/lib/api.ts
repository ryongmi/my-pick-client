import { HttpClient } from '@krgeobuk/http-client';
import type { 
  MultiServerConfig, 
  TokenRefreshConfig, 
  SecurityPolicy 
} from '@krgeobuk/http-client/types';
import type { ApiResponse, PaginatedResponse } from '@/types';

// 환경 변수 설정
const getEnvConfig = (): MultiServerConfig => ({
  auth: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:8000',
    timeout: 10000,
    withCredentials: true,
  },
  mypick: {
    baseURL: process.env.NEXT_PUBLIC_MAIN_API_URL || 'http://localhost:8300',
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
  login: (credentials: { email: string; password: string }) =>
    httpClient.post<{ user: any; token: string }>('auth', '/auth/login', credentials),
  
  register: (data: { name: string; email: string; password: string }) =>
    httpClient.post<{ user: any }>('auth', '/auth/register', data),
  
  logout: () => 
    httpClient.post('auth', '/auth/logout'),
  
  refreshToken: () => 
    httpClient.post<{ accessToken: string }>('auth', '/auth/refresh'),
  
  updateProfile: (data: any) => 
    httpClient.put('auth', '/auth/profile', data),
};

// =============================================================================
// USER API (auth-server)
// =============================================================================

export const userApi = {
  getProfile: () => 
    httpClient.get('auth', '/users/profile'),
  
  updateProfile: (data: any) => 
    httpClient.put('auth', '/users/profile', data),
  
  getSettings: () => 
    httpClient.get('auth', '/users/settings'),
  
  updateSettings: (settings: any) => 
    httpClient.put('auth', '/users/settings', settings),
  
  // 사용자 구독 관리
  getSubscriptions: (userId: string) => 
    httpClient.get('mypick', `/users/${userId}/subscriptions`),
};

// =============================================================================
// CREATOR API (my-pick-server)
// =============================================================================

export const creatorApi = {
  getCreators: (params?: any) => 
    httpClient.get<PaginatedResponse<any>>('mypick', '/creators', { params }),
  
  getCreator: (id: string) => 
    httpClient.get('mypick', `/creators/${id}`),
  
  // 구독 API는 서버 구조에 맞게 수정 (userId가 필요)
  followCreator: (creatorId: string, userId: string) => 
    httpClient.post('mypick', `/users/${userId}/subscriptions/${creatorId}`),
  
  unfollowCreator: (creatorId: string, userId: string) => 
    httpClient.delete('mypick', `/users/${userId}/subscriptions/${creatorId}`),
  
  checkSubscription: (creatorId: string, userId: string) => 
    httpClient.get('mypick', `/users/${userId}/subscriptions/${creatorId}/exists`),
  
  getCreatorSubscribers: (creatorId: string) => 
    httpClient.get('mypick', `/creators/${creatorId}/subscribers`),
  
  addCreator: (data: any) => 
    httpClient.post('mypick', '/creators', data),
  
  updateCreator: (id: string, data: any) => 
    httpClient.put('mypick', `/creators/${id}`, data),
  
  deleteCreator: (id: string) => 
    httpClient.delete('mypick', `/creators/${id}`),
  
  getCreatorStats: (id: string) => 
    httpClient.get('mypick', `/creators/${id}/stats`),
  
  syncCreator: (id: string) => 
    httpClient.post('mypick', `/creators/${id}/sync`),
  
  // Toggle function for easier usage
  toggleFollow: async (creatorId: string, userId: string, isCurrentlyFollowing: boolean) => {
    return isCurrentlyFollowing 
      ? creatorApi.unfollowCreator(creatorId, userId)
      : creatorApi.followCreator(creatorId, userId);
  },
};

// =============================================================================
// CONTENT API (my-pick-server)
// =============================================================================

export const contentApi = {
  getContent: (params?: any) => 
    httpClient.get<PaginatedResponse<any>>('mypick', '/content', { params }),
  
  getContentById: (id: string) => 
    httpClient.get('mypick', `/content/${id}`),
  
  bookmarkContent: (id: string) => 
    httpClient.post('mypick', `/content/${id}/bookmark`),
  
  removeBookmark: (id: string) => 
    httpClient.delete('mypick', `/content/${id}/bookmark`),
  
  likeContent: (id: string) => 
    httpClient.post('mypick', `/content/${id}/like`),
  
  unlikeContent: (id: string) => 
    httpClient.delete('mypick', `/content/${id}/like`),
  
  getBookmarks: (page = 1, limit = 20) =>
    httpClient.get<PaginatedResponse<any>>('mypick', '/content/bookmarks', { params: { page, limit } }),
  
  searchContent: (query: string, filters?: any) =>
    httpClient.get('mypick', '/content/search', { params: { q: query, ...filters } }),
  
  // Toggle functions for easier usage
  toggleBookmark: async (id: string, isCurrentlyBookmarked: boolean) => {
    return isCurrentlyBookmarked 
      ? contentApi.removeBookmark(id)
      : contentApi.bookmarkContent(id);
  },
  
  toggleLike: async (id: string, isCurrentlyLiked: boolean) => {
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
  getDashboardStats: () => 
    httpClient.get('mypick', '/admin/dashboard'),
  
  getUsers: (params?: any) => 
    httpClient.get<PaginatedResponse<any>>('mypick', '/admin/users', { params }),
  
  getUser: (id: string) => 
    httpClient.get('mypick', `/admin/users/${id}`),
  
  updateUser: (id: string, data: any) => 
    httpClient.put('mypick', `/admin/users/${id}`, data),
  
  deleteUser: (id: string) => 
    httpClient.delete('mypick', `/admin/users/${id}`),
  
  getCreators: (params?: any) => 
    httpClient.get<PaginatedResponse<any>>('mypick', '/admin/creators', { params }),
  
  approveCreator: (id: string) => 
    httpClient.post('mypick', `/admin/creators/${id}/approve`),
  
  rejectCreator: (id: string) => 
    httpClient.post('mypick', `/admin/creators/${id}/reject`),
};

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

// 에러 처리 유틸리티 함수들
export const errorUtils = {
  // krgeobuk 서버 에러인지 확인
  isKrgeobukError(error: any): boolean {
    return error.response?.data?.code && typeof error.response.data.code === 'string';
  },
  
  // 에러 코드 추출
  getErrorCode(error: any): string | null {
    return error.response?.data?.code || null;
  },
  
  // 사용자 친화적 에러 메시지 추출
  getUserMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return '알 수 없는 오류가 발생했습니다.';
  },
  
  // 재시도 가능한 에러인지 확인
  isRetryableError(error: any): boolean {
    const status = error.response?.status;
    const code = this.getErrorCode(error);
    
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
  isAuthError(error: any): boolean {
    const status = error.response?.status;
    const code = this.getErrorCode(error);
    
    return status === 401 || 
           code === 'AUTH_TOKEN_EXPIRED' || 
           code === 'JWT_EXPIRED' ||
           code?.startsWith('AUTH_');
  }
};

// 토큰 관리 함수
export const tokenManager = {
  setAuthToken: (token: string): void => {
    httpClient.getTokenManager().setAccessToken(token);
  },
  
  clearAuthToken: (): void => {
    httpClient.getTokenManager().clearTokens();
  },
  
  isAuthenticated: (): boolean => {
    return httpClient.getTokenManager().hasValidAccessToken();
  },
  
  getAccessToken: (): string | null => {
    return httpClient.getTokenManager().getAccessToken();
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
  
  getAvailableServers: () => {
    return httpClient.getAvailableServers();
  },
  
  cleanup: (): void => {
    httpClient.cleanup();
  }
};

// 기본 export
export default httpClient;