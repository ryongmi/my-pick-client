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

export interface Creator {
  id: string;
  name: string;
  displayName: string;
  avatar: string;
  platforms: Platform[];
  description?: string;
  isVerified: boolean;
  followerCount: number;
  contentCount: number;
  totalViews: number;
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  type: 'youtube' | 'twitter' | 'instagram' | 'tiktok';
  platformId: string;
  username: string;
  url: string;
  isActive: boolean;
  followerCount?: number;
  lastSync?: string;
}

export interface Content {
  id: string;
  creator: Creator;
  platform: Platform['type'];
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  publishedAt: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  duration?: string; // YouTube용
  isBookmarked?: boolean;
  isLiked?: boolean;
  metadata?: ContentMetadata;
}

export interface ContentMetadata {
  tags?: string[];
  category?: string;
  language?: string;
  isLive?: boolean;
  isPremium?: boolean;
  ageRestricted?: boolean;
}

// YouTube 특화 타입
export interface YouTubeVideo extends Omit<Content, 'platform'> {
  platform: 'youtube';
  channelId: string;
  categoryId?: string;
  duration: string;
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

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

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

// 에러 타입
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// 이벤트 타입
export interface AppEvent {
  type: string;
  payload: any;
  timestamp: string;
}
