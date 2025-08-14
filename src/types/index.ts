// Core 패키지 타입 import
import type { ResponseFormat, PaginatedResult } from '@krgeobuk/core/interfaces';

// 기본 타입 정의
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'premium';
  createdAt: string;
  updatedAt: string;
}

// Creator 타입 - 서버 구조에 맞게 수정
export interface Creator {
  id: string;
  userId?: string; // 서버 필드 (선택적)
  name: string;
  displayName: string;
  avatar?: string; // 선택적으로 변경
  platforms?: Platform[]; // 서버에서는 별도 엔티티로 관리
  description?: string;
  isVerified: boolean;
  category: string; // 서버 필드 추가
  tags?: string[]; // 서버 필드 추가
  followerCount?: number; // 계산 필드로 변경
  contentCount?: number; // 계산 필드로 변경
  totalViews?: number; // 계산 필드로 변경
  createdAt: string;
  updatedAt: string;
}

// 크리에이터 상세 정보 (플랫폼 포함)
export interface CreatorWithPlatforms extends Creator {
  platforms: Platform[];
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

// Content 타입 - 서버 구조에 맞게 수정
export interface Content {
  id: string;
  type: 'youtube_video' | 'twitter_post' | 'instagram_post'; // 서버 필드
  creator?: Creator; // 서버에서는 creatorId로 연결
  creatorId: string; // 서버 필드
  platform: Platform['type'];
  platformId: string; // 서버 필드
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  publishedAt: string;
  duration?: number; // 서버에서는 초 단위 number
  // 통계 정보는 별도 엔티티로 분리됨
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  shares?: number; // 서버 필드
  engagementRate?: number; // 서버 필드
  // 사용자 상호작용 정보
  isBookmarked?: boolean;
  isLiked?: boolean;
  watchedAt?: Date;
  watchDuration?: number;
  rating?: number;
  metadata?: ContentMetadata;
  createdAt?: string;
  updatedAt?: string;
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
  metadata?: Record<string, any>;
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
  details?: any;
  timestamp: string;
  // krgeobuk 서버 추가 필드
  statusCode?: number;
  path?: string;
}

// 이벤트 타입
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
}
