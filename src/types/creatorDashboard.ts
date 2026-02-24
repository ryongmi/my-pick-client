import type { Creator, Content } from './index';
import { LimitType } from '@krgeobuk/core/enum';

/**
 * 콘텐츠 상태 Enum
 * 백엔드 ContentStatus와 동일하게 유지
 */
export enum ContentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  UNDER_REVIEW = 'under_review',
  FLAGGED = 'flagged',
  REMOVED = 'removed',
}

/**
 * LimitType re-export
 */
export { LimitType };

/**
 * 콘텐츠 상태 표시 레이블
 */
export const ContentStatusLabel: Record<ContentStatus, string> = {
  [ContentStatus.ACTIVE]: '공개',
  [ContentStatus.INACTIVE]: '비공개',
  [ContentStatus.UNDER_REVIEW]: '검토 중',
  [ContentStatus.FLAGGED]: '신고됨',
  [ContentStatus.REMOVED]: '삭제됨',
};

/**
 * 크리에이터 대시보드 통계
 */
export interface DashboardStats {
  totalContents: number;
  totalViews: number;
  totalLikes: number;
  platformCount: number;
}

/**
 * 크리에이터 대시보드 응답 (GET /creators/me/dashboard)
 */
export interface CreatorDashboardResponse {
  creator: Creator;
  stats: DashboardStats;
}

/**
 * 콘텐츠 필터 옵션
 */
export interface ContentFilters {
  platform: string; // 'all' | 'youtube' | 'twitter'
  status: ContentStatus | 'all';
  searchQuery: string;
  sortBy: 'publishedAt' | 'views' | 'likes';
  sortOrder: 'asc' | 'desc';
}

/**
 * 크리에이터 대시보드 Redux State
 */
export interface CreatorDashboardState {
  // 크리에이터 정보
  myCreatorInfo: Creator | null;

  // 콘텐츠 목록
  contents: Content[];
  totalContents: number;
  totalPages: number;
  isLoadingContents: boolean;
  contentsError: string | null;

  // 통계
  stats: DashboardStats | null;
  isLoadingStats: boolean;
  statsError: string | null;

  // 플랫폼 관리
  platforms: CreatorPlatform[];
  isLoadingPlatforms: boolean;
  platformsError: string | null;
  isAddPlatformModalOpen: boolean;
  isEditPlatformModalOpen: boolean;
  editingPlatform: CreatorPlatform | null;

  // 필터 및 정렬
  filters: ContentFilters;

  // 선택된 콘텐츠 (일괄 작업용)
  selectedContentIds: string[];

  // 전역 로딩 및 에러
  isLoading: boolean;
  error: string | null;

  // 페이지네이션
  page: number;
  limit: LimitType;
  hasMore: boolean;
}

/**
 * 콘텐츠 상태 변경 요청 (PATCH /content/:id/status)
 */
export interface UpdateContentStatusRequest {
  status: ContentStatus;
}

/**
 * 콘텐츠 일괄 상태 변경 요청 (PATCH /content/bulk-update-status)
 */
export interface BulkUpdateContentStatusRequest {
  contentIds: string[];
  status: ContentStatus;
}

/**
 * 크리에이터 플랫폼 (GET /creators/:id/platforms 응답)
 * 백엔드 CreatorPlatformEntity와 동일
 */
export interface CreatorPlatform {
  id: string;
  creatorId: string;
  platformType: 'youtube' | 'twitter';
  platformId: string;
  platformUsername?: string;
  platformUrl?: string;
  displayName?: string;
  isActive: boolean;

  // 통계 정보
  followerCount?: number;
  contentCount?: number;
  totalViews?: number;

  // 동기화 정보
  lastSyncAt?: string;
  syncStatus?: 'active' | 'error' | 'disabled';
  syncProgress?: {
    total: number;
    synced: number;
    failed: number;
    lastError?: string;
  };

  createdAt: string;
  updatedAt: string;
}

/**
 * 플랫폼 추가 요청 (POST /creators/me/platforms)
 */
export interface CreatePlatformRequest {
  platformType: 'youtube' | 'twitter';
  platformId: string;
  platformUsername?: string;
  platformUrl?: string;
}

/**
 * 플랫폼 수정 요청 (PATCH /creators/me/platforms/:platformId)
 */
export interface UpdatePlatformRequest {
  platformUsername?: string;
  platformUrl?: string;
}

/**
 * 플랫폼 관리 상태 (Redux)
 */
export interface PlatformManagementState {
  platforms: CreatorPlatform[];
  isLoadingPlatforms: boolean;
  platformsError: string | null;

  // 모달 상태
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  editingPlatform: CreatorPlatform | null;
}
