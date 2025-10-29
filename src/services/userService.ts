import { authApi, mypickApi } from '@/lib/httpClient';
import type { User } from '@/types';
import { BaseService } from './base';

/**
 * 사용자 관리 Service
 *
 * 사용자 프로필, 설정, 구독 등을 담당
 */
export class UserService extends BaseService {
  /**
   * 사용자 구독 목록 조회
   */
  async getSubscriptions(): Promise<unknown> {
    try {
      const response = await mypickApi.get('/me/subscriptions');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 사용자 설정 조회
   */
  async getSettings(): Promise<unknown> {
    try {
      const response = await authApi.get('/users/settings');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 사용자 설정 업데이트
   */
  async updateSettings(settings: Record<string, unknown>): Promise<void> {
    try {
      await authApi.put('/users/settings', settings);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 프로필 업데이트
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await authApi.put<User>('/users/profile', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 사용자 프로필 조회
   */
  async getProfile(): Promise<User> {
    try {
      const response = await authApi.get<User>('/users/profile');
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// 싱글톤 인스턴스
export const userService = new UserService();
