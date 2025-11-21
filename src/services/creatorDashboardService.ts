import { mypickApi } from '@/lib/httpClient';
import type { ApiResponse } from '@/types';
import type { Creator, Content } from '@/types';
import type {
  CreatorDashboardResponse,
  UpdateContentStatusRequest,
  BulkUpdateContentStatusRequest,
  ContentStatus,
} from '@/types/creatorDashboard';
import { LimitType } from '@/types/creatorDashboard';

/**
 * 크리에이터 대시보드 서비스
 * 크리에이터 본인의 콘텐츠 관리 및 통계 조회
 */
class CreatorDashboardService {
  /**
   * 현재 사용자의 크리에이터 정보 조회
   * GET /creators/me
   */
  async getMyCreatorInfo(): Promise<Creator> {
    const response = await mypickApi.get<Creator>('/creators/me');
    return response.data;
  }

  /**
   * 크리에이터 대시보드 통계 조회
   * GET /creators/me/dashboard
   */
  async getMyDashboardStats(): Promise<CreatorDashboardResponse> {
    const response = await mypickApi.get<CreatorDashboardResponse>('/creators/me/dashboard');
    return response.data;
  }

  /**
   * 크리에이터 본인의 콘텐츠 목록 조회
   * GET /content?creatorIds={myCreatorId}&page=1&limit=20&includeAllStatuses=true
   */
  async getMyContents(params: {
    creatorId: string;
    page?: number;
    limit?: number;
    platform?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<{
    items: Content[];
    pageInfo: {
      totalItems: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const queryParams = new URLSearchParams();
    queryParams.append('creatorIds', params.creatorId);
    queryParams.append('includeAllStatuses', 'true'); // 크리에이터 본인의 모든 상태 콘텐츠 조회

    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    else queryParams.append('limit', LimitType.THIRTY.toString()); // 기본값 30
    if (params.platform && params.platform !== 'all')
      queryParams.append('platforms', params.platform);
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await mypickApi.get<{
      items: Content[];
      pageInfo: {
        totalItems: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>(`/content?${queryParams.toString()}`);

    return response.data;
  }

  /**
   * 콘텐츠 상태 변경 (공개/비공개)
   * PATCH /content/:id/status
   */
  async updateContentStatus(contentId: string, status: ContentStatus): Promise<void> {
    const payload: UpdateContentStatusRequest = { status };
    await mypickApi.patch<void>(`/content/${contentId}/status`, payload);
  }

  /**
   * 콘텐츠 삭제 (소프트 삭제)
   * DELETE /content/:id
   */
  async deleteContent(contentId: string): Promise<void> {
    await mypickApi.delete<void>(`/content/${contentId}`);
  }

  /**
   * 콘텐츠 일괄 상태 변경
   * PATCH /content/bulk-update-status
   */
  async bulkUpdateContentStatus(contentIds: string[], status: ContentStatus): Promise<void> {
    const payload: BulkUpdateContentStatusRequest = { contentIds, status };
    await mypickApi.patch<void>('/content/bulk-update-status', payload);
  }
}

// 싱글톤 인스턴스 export
export const creatorDashboardService = new CreatorDashboardService();
