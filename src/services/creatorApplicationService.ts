import { mypickApi } from '@/lib/httpClient';
import { BaseService } from './base';

/**
 * 크리에이터 신청 관리 Service
 *
 * 크리에이터 신청 제출, 상태 조회 등을 담당
 */
export class CreatorApplicationService extends BaseService {
  /**
   * 내 신청 상태 조회
   */
  async getMyApplicationStatus(): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>('/creator-registrations/me');

      // 응답이 { status: 'none' }인 경우 null 반환
      if (response.data && typeof response.data === 'object' && 'status' in response.data) {
        const data = response.data as { status: string };
        if (data.status === 'none') {
          return null;
        }
      }

      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 크리에이터 신청 제출
   */
  async submitApplication(data: {
    platform: 'youtube' | 'twitter';
    channelId: string;
    channelUrl: string;
    registrationMessage?: string;
  }): Promise<{ registrationId: string }> {
    try {
      const response = await mypickApi.post<{ registrationId: string }>(
        '/creator-registrations',
        data
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * 신청 상세 조회
   */
  async getApplication(id: string): Promise<unknown> {
    try {
      const response = await mypickApi.get<unknown>(`/creator-registrations/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

// 싱글톤 인스턴스
export const creatorApplicationService = new CreatorApplicationService();
