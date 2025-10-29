import {  mypickApi } from '@/lib/httpClient';
import type { PaginatedResponse } from '@/types';
import { BaseService } from './base';

/**
 * 크리에이터 관리 Service
 *
 * 크리에이터 조회, 구독, 통계 등을 담당
 */
export class CreatorService extends BaseService {
  /**
   * 크리에이터 목록 조회 (페이지네이션)
   */
  async getCreators(params?: Record<string, unknown>): Promise<PaginatedResponse<unknown>> {
    try {
      const response = await mypickApi.get<PaginatedResponse<unknown>>('/creators', {
        params,
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 상세 조회
   */
  async getCreator(id: string): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>(`/creators/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 구독
   */
  async followCreator(creatorId: string): Promise<void> {
    try {
      await mypickApi.post(`/me/subscriptions/${creatorId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 구독 취소
   */
  async unfollowCreator(creatorId: string): Promise<void> {
    try {
      await mypickApi.delete(`/me/subscriptions/${creatorId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 구독 상태 확인
   */
  async checkSubscription(creatorId: string): Promise<{ subscribed: boolean }> {
    try {
      const response = await mypickApi.get<{ subscribed: boolean }>(
        `/me/subscriptions/${creatorId}/exists`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 구독자 목록 조회
   */
  async getCreatorSubscribers(creatorId: string): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>(
        `/creators/${creatorId}/subscribers`
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 추가 (관리자)
   */
  async addCreator(data: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await mypickApi.post<unknown>('/creators', data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 수정 (관리자)
   */
  async updateCreator(id: string, data: Record<string, unknown>): Promise<unknown> {
    try {
      const response = await mypickApi.put<unknown>(`/creators/${id}`, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 삭제 (관리자)
   */
  async deleteCreator(id: string): Promise<void> {
    try {
      await mypickApi.delete(`/creators/${id}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 통계 조회
   */
  async getCreatorStats(id: string): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>(`/creators/${id}/stats`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 정보 동기화
   */
  async syncCreator(id: string): Promise<void> {
    try {
      await mypickApi.post(`/creators/${id}/sync`);
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 구독 토글 (편의 메서드)
   */
  async toggleFollow(creatorId: string, isCurrentlyFollowing: boolean): Promise<void> {
    if (isCurrentlyFollowing) {
      await this.unfollowCreator(creatorId);
    } else {
      await this.followCreator(creatorId);
    }
  }
}

// 싱글톤 인스턴스
export const creatorService = new CreatorService();
