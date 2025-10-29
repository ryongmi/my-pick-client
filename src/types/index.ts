// Core 패키지 타입 import
import type { ResponseFormat, PaginatedResult } from '@krgeobuk/core/interfaces';

// UserProfile 타입 정의 (@krgeobuk/user 패키지가 설치되지 않아 임시로 정의)
// TODO: @krgeobuk/user 패키지 설치 후 import로 변경
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  isEmailVerified: boolean;
  avatar?: string;
  oauthAccount: {
    provider: 'google' | 'naver' | 'kakao';
    providerId: string;
    email: string;
    name: string;
    picture?: string;
  };
  roles?: Array<{
    roleId: string;
    roleName: string;
    assignedAt: Date;
  }>;
  permissions?: Array<{
    permissionId: string;
    permissionName: string;
    resource: string;
    action: string;
  }>;
  services?: Array<{
    serviceId: string;
    serviceName: string;
    hasAccess: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

// UserProfile을 User로 재export (하위 호환성)
export type User = UserProfile;

// 플랫폼 정보 타입 - 서버 PlatformInfo DTO에 맞춤
export interface PlatformInfo {
  platformType: 'youtube' | 'twitter';
  platformId: string;
  platformUsername?: string;
  platformUrl?: string;
}

// Creator 타입 - 서버 CreatorSearchResultDto에 맞춤
export interface Creator {
  id: string;
  userId?: string;
  name: string;
  description?: string;
  profileImageUrl?: string;
  isActive: boolean;

  // 통계 정보
  subscriberCount?: number;
  videoCount?: number;
  totalViews?: number;

  // 플랫폼 정보
  platformCount?: number; // 하위 호환성 유지
  platforms?: PlatformInfo[]; // 실제 플랫폼 데이터

  createdAt: string;
  updatedAt?: string;
}

// 크리에이터 상세 정보 (플랫폼 상세 포함)
export interface CreatorWithPlatforms extends Omit<Creator, 'platforms'> {
  platforms: Platform[]; // 더 상세한 Platform 타입 사용
}

// Platform 타입 - 서버 구조에 맞게 확장
export interface Platform {
  id?: string; // 서버에서 생성되는 ID
  type: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  platformId: string;
  username?: string;
  url: string;
  displayName?: string; // 서버 필드 추가
  isActive: boolean;
  followerCount?: number;
  contentCount?: number; // 서버 필드 추가
  totalViews?: number; // 서버 필드 추가
  lastSync?: string;
  lastSyncAt?: Date; // 서버 필드명
  syncStatus?: 'active' | 'error' | 'disabled'; // 서버 필드 추가
  // 영상 동기화 관련 필드
  videoSyncStatus?: 'never_synced' | 'in_progress' | 'completed' | 'failed';
  lastVideoSyncAt?: Date;
  totalVideoCount?: number;
  syncedVideoCount?: number;
  failedVideoCount?: number;
  lastSyncError?: string;
}

// 백엔드 Content 통계 정보 타입
export interface ContentStatistics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  updatedAt: string;
}

// 백엔드 Content 동기화 정보 타입
export interface ContentSyncInfo {
  lastSyncedAt?: string;
  expiresAt?: string;
  isAuthorizedData?: boolean;
  syncError?: string;
  syncRetryCount?: number;
  nextSyncAt?: string;
  syncStatus: 'pending' | 'syncing' | 'completed' | 'failed';
}

// Content 타입 - 백엔드 my-pick-server에 맞춤
export interface Content {
  id: string;
  type: 'youtube_video' | 'twitter_post' | 'instagram_post';
  title: string;
  description?: string;
  thumbnail: string;
  url: string;
  platform: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  platformId: string;
  duration?: number; // 초 단위
  publishedAt: string;
  creatorId: string;

  // 백엔드 메타데이터
  language?: string;
  isLive: boolean;
  quality?: 'sd' | 'hd' | '4k';
  ageRestriction: boolean;
  status: 'active' | 'inactive' | 'under_review' | 'flagged' | 'removed';

  // JSON 필드 (백엔드에서 통합 관리)
  statistics?: ContentStatistics;
  syncInfo?: ContentSyncInfo;

  // 추가 정보 (클라이언트 전용 - 조인 결과)
  creator?: Creator;

  // 사용자 상호작용 정보 (TODO: UserInteraction 모듈 구현 후 추가)
  isBookmarked?: boolean;
  isLiked?: boolean;

  // 편의를 위한 계산 필드 (statistics에서 추출)
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;

  // 타임스탬프
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

// ContentMetadata - 서버 구조에 맞게 확장
export interface ContentMetadata {
  tags: string[]; // 서버에서 필수 필드
  category: string; // 서버에서 필수 필드
  language: string; // 서버에서 필수 필드
  isLive: boolean; // 서버에서 필수 필드
  quality?: 'sd' | 'hd' | '4k'; // 서버 필드
  ageRestriction?: boolean; // 서버 필드명 수정
  isPremium?: boolean;
}

// YouTube 특화 타입
export interface YouTubeVideo extends Omit<Content, 'platform'> {
  platform: 'youtube';
  channelId: string;
  categoryId?: string;
  duration?: number; // Content 타입과 일치시킴
  definition: 'hd' | 'sd';
  caption: boolean;
  licensedContent: boolean;
}

// Twitter 특화 타입
export interface TwitterPost extends Omit<Content, 'platform'> {
  platform: 'twitter';
  tweetId: string;
  retweetCount: number;
  replyCount: number;
  isRetweet: boolean;
  originalTweet?: TwitterPost;
  mentions?: string[];
  hashtags?: string[];
  media?: TwitterMedia[];
}

export interface TwitterMedia {
  type: 'photo' | 'video' | 'gif';
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

// 필터 및 검색
export interface ContentFilter {
  creators: string[];
  platforms: Platform['type'][];
  dateRange?: {
    start: Date;
    end: Date;
  };
  sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
  searchQuery?: string;
}

export interface SearchResult {
  contents: Content[];
  creators: Creator[];
  totalCount: number;
  hasMore: boolean;
}

// UI 상태
export interface UIState {
  sidebarOpen: boolean;
  currentView: 'user' | 'admin' | 'profile';
  activeModal?: string;
  loading: boolean;
  notifications: Notification[];
  theme: 'light' | 'dark';
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// 타입 별칭 - 기존 코드 호환성 유지
export type ApiResponse<T> = ResponseFormat<T>;

// PaginatedResponse - Core 패키지의 PaginatedResult 기반으로 통합
export interface PaginatedResponse<T> extends PaginatedResult<T> {
  success?: boolean;
  message?: string;
}

// Core 패키지 타입 재export (직접 사용을 위해)
export type { ResponseFormat, PaginatedResult };


// 폼 타입
export interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface CreatorAddForm {
  name: string;
  platforms: {
    type: Platform['type'];
    username: string;
    url: string;
  }[];
  description?: string;
}

// 통계 타입
export interface DashboardStats {
  totalUsers: number;
  totalCreators: number;
  totalContent: number;
  apiUsage: number;
  userGrowth: number;
  creatorGrowth: number;
  contentGrowth: number;
}

export interface CreatorStats {
  followersCount: number;
  contentCount: number;
  totalViews: number;
  engagementRate: number;
  growthRate: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'content_published' | 'follower_milestone' | 'engagement_spike';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// 설정 타입
export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    weekly: boolean;
    newContent: boolean;
  };
  privacy: {
    profilePublic: boolean;
    showActivity: boolean;
    allowMessages: boolean;
  };
  display: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}

// 사용자 구독 관련 타입 (서버 중간테이블)
export interface UserSubscription {
  userId: string;
  creatorId: string;
  notificationEnabled: boolean;
  subscribedAt: Date;
}

// 사용자 상호작용 타입 (서버 중간테이블)
export interface UserInteraction {
  userId: string;
  contentId: string;
  isBookmarked: boolean;
  isLiked: boolean;
  watchedAt?: Date;
  watchDuration?: number;
  rating?: number;
}

// 에러 타입 - krgeobuk 서버 에러 형식
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: string;
  // krgeobuk 서버 추가 필드
  statusCode?: number;
  path?: string;
}

// 이벤트 타입
export interface AppEvent {
  type: string;
  payload: unknown;
  timestamp: string;
}
