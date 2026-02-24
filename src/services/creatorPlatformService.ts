import { mypickApi } from '@/lib/httpClient';
import type {
  CreatorPlatform,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@/types/creatorDashboard';
import type { Creator, Platform, PlatformInfo } from '@/types';

/**
 * 크리에이터 플랫폼 관리 서비스
 * 크리에이터 본인의 플랫폼 계정 관리 (추가, 수정, 삭제)
 */
class CreatorPlatformService {
  /**
   * Platform 또는 PlatformInfo 타입을 CreatorPlatform 타입으로 변환
   */
  private mapPlatformToCreatorPlatform(
    platform: Platform | PlatformInfo,
    creatorId: string
  ): CreatorPlatform {
    // Platform 타입인지 확인
    const isPlatform = 'type' in platform;

    // PlatformInfo 타입
    if (!isPlatform) {
      const result: CreatorPlatform = {
        id: '', // PlatformInfo에는 id가 없음
        creatorId,
        platformType: platform.platformType,
        platformId: platform.platformId,
        isActive: true, // 기본값
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      if (platform.platformUsername) result.platformUsername = platform.platformUsername;
      if (platform.platformUrl) result.platformUrl = platform.platformUrl;
      return result;
    }

    // Platform 타입
    const result: CreatorPlatform = {
      id: platform.id || '',
      creatorId,
      platformType: platform.type as 'youtube' | 'twitter',
      platformId: platform.platformId,
      isActive: platform.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 선택적 필드들 추가
    if (platform.username) result.platformUsername = platform.username;
    if (platform.url) result.platformUrl = platform.url;
    if (platform.displayName) result.displayName = platform.displayName;

    // 통계 정보 - statistics 객체 우선, 없으면 직접 필드 사용
    if (platform.statistics) {
      // statistics 객체에서 데이터 추출
      if (platform.statistics.followerCount !== undefined) {
        result.followerCount = platform.statistics.followerCount;
      } else if (platform.statistics.subscriberCount !== undefined) {
        result.followerCount = platform.statistics.subscriberCount;
      }
      if (platform.statistics.contentCount !== undefined) {
        result.contentCount = platform.statistics.contentCount;
      }
      if (platform.statistics.totalViews !== undefined) {
        result.totalViews = platform.statistics.totalViews;
      }
    } else {
      // 하위 호환성: 직접 필드 사용
      if (platform.followerCount !== undefined) result.followerCount = platform.followerCount;
      if (platform.contentCount !== undefined) result.contentCount = platform.contentCount;
      if (platform.totalViews !== undefined) result.totalViews = platform.totalViews;
    }

    // 동기화 정보
    if (platform.lastSyncAt) result.lastSyncAt = new Date(platform.lastSyncAt).toISOString();
    if (platform.syncStatus) result.syncStatus = platform.syncStatus;

    // syncProgress - 중첩 객체 우선, 없으면 개별 필드에서 계산
    if (platform.syncProgress) {
      // API 응답에 syncProgress 객체가 있는 경우
      result.syncProgress = platform.syncProgress;
    } else if (
      platform.totalVideoCount !== undefined &&
      platform.syncedVideoCount !== undefined &&
      platform.failedVideoCount !== undefined
    ) {
      // 하위 호환성: 개별 필드에서 syncProgress 생성
      const syncProgressData: CreatorPlatform['syncProgress'] = {
        total: platform.totalVideoCount,
        synced: platform.syncedVideoCount,
        failed: platform.failedVideoCount,
      };
      if (platform.lastSyncError) syncProgressData.lastError = platform.lastSyncError;
      result.syncProgress = syncProgressData;
    }

    return result;
  }

  /**
   * 내 플랫폼 목록 조회
   * GET /creators/me - 응답에 이미 플랫폼 정보가 포함되어 있음
   */
  async getMyPlatforms(): Promise<CreatorPlatform[]> {
    // /creators/me API 응답에 플랫폼 정보가 포함되어 있음
    const response = await mypickApi.get<Creator>('/creators/me');
    const creator = response.data;

    // platforms 배열이 있으면 변환하여 반환
    if (creator.platforms && creator.platforms.length > 0) {
      return creator.platforms.map((platform) =>
        this.mapPlatformToCreatorPlatform(platform, creator.id)
      );
    }

    return [];
  }

  /**
   * 플랫폼 추가
   * POST /creators/me/platforms
   */
  async addPlatform(data: CreatePlatformRequest): Promise<void> {
    await mypickApi.post<void>('/creators/me/platforms', data);
  }

  /**
   * 플랫폼 수정
   * PATCH /creators/me/platforms/:platformId
   */
  async updatePlatform(platformId: string, data: UpdatePlatformRequest): Promise<void> {
    await mypickApi.patch<void>(`/creators/me/platforms/${platformId}`, data);
  }

  /**
   * 플랫폼 삭제 (비활성화)
   * DELETE /creators/me/platforms/:platformId
   */
  async deletePlatform(platformId: string): Promise<void> {
    await mypickApi.delete<void>(`/creators/me/platforms/${platformId}`);
  }
}

// 싱글톤 인스턴스 export
export const creatorPlatformService = new CreatorPlatformService();
