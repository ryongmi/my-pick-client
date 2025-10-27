import { authApi, tokenManager } from '@/lib/httpClient';
import type { User, ApiResponse } from '@/types';
import { BaseService } from './base';

/**
 * 인증 관련 Service
 *
 * 사용자 인증, 로그아웃, 토큰 관리 등을 담당
 */
export class AuthService extends BaseService {
  /**
   * 로그아웃
   */
  async logout(): Promise<void> {
    try {
      await authApi.post('/auth/logout');
      tokenManager.clearAccessToken();
    } catch (error) {
      // 로그아웃 실패해도 클라이언트 토큰은 제거
      tokenManager.clearAccessToken();
      this.handleError(error);
    }
  }

  /**
   * 사용자 정보 조회
   */
  async getUserProfile(): Promise<User> {
    try {
      const response = await authApi.get<ApiResponse<User>>('/users/me');
      return response.data.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 클라이언트 초기화 (RefreshToken으로 AccessToken 갱신 및 사용자 정보 조회)
   * 페이지 로드 시 한 번만 호출하여 인증 상태 복원
   */
  async initialize(): Promise<{ user: User | null }> {
    try {
      // auth-server의 /auth/initialize 엔드포인트 호출
      // RefreshToken(HttpOnly Cookie)을 사용하여 새로운 AccessToken 발급
      const response = await authApi.post<ApiResponse<{ accessToken: string; user: User }>>(
        '/auth/initialize'
      );

      const { accessToken, user } = response.data.data;

      // AccessToken 저장
      tokenManager.setAccessToken(accessToken);

      return { user };
    } catch (error) {
      // 초기화 실패 (RefreshToken 없음 또는 만료)
      tokenManager.clearAccessToken();
      return { user: null };
    }
  }

  /**
   * 현재 로그인 상태 확인 (토큰 존재 여부)
   */
  isLoggedIn(): boolean {
    const token = tokenManager.getAccessToken();
    return !!token && tokenManager.isValidToken(token);
  }

  /**
   * 토큰 갱신 (shared-lib에서 자동 처리되므로 백업용)
   */
  async refreshToken(): Promise<string> {
    try {
      // shared-lib의 TokenManager를 통한 자동 갱신
      return await tokenManager.refreshToken();
    } catch (error) {
      // 갱신 실패 시 로그아웃 처리
      tokenManager.clearAccessToken();
      this.handleError(error);
    }
  }
}

// 싱글톤 인스턴스
export const authService = new AuthService();
