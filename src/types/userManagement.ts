// MyPick 사용자 관리 특화 타입 정의

import { User } from './index';

// MyPick 특화 사용자 타입
export interface MyPickUser extends User {
  // 서비스 상태
  serviceStatus: 'active' | 'inactive' | 'suspended';
  lastLoginAt: string | null;
  
  // 사용자 타입
  userType: 'user' | 'creator';
  
  // YouTube 연동 정보
  youtubeConnection: {
    isConnected: boolean;
    channelId?: string;
    channelName?: string;
    channelUrl?: string;
    subscriberCount?: number;
    connectedAt?: string;
    lastSyncAt?: string;
    tokenExpiry?: string;
    hasError?: boolean;
    errorMessage?: string;
  };
  
  // 콘텐츠 통계
  contentStats: {
    videoCount: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    averageViews: number;
    lastUploadAt?: string;
  };
  
  // API 사용량
  apiUsage: {
    currentMonth: number;
    dailyLimit: number;
    monthlyLimit: number;
    lastUsedAt?: string;
    quotaExceeded: boolean;
  };
  
  // 크리에이터 신청 정보 (해당시)
  creatorApplication?: CreatorApplication;
  
  // 선호 설정
  preferences: {
    categories: string[];
    language: string;
    notifications: {
      email: boolean;
      push: boolean;
      marketing: boolean;
    };
  };
}

// 크리에이터 신청 정보
export interface CreatorApplication {
  id: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  
  // 신청 정보
  applicationData: {
    channelName: string;
    channelId: string;
    channelUrl: string;
    subscriberCount: number;
    contentCategory: string | string[]; // 기존 호환성을 위해 둘 다 허용
    description: string;
    sampleVideos: string[];
    businessEmail?: string;
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      website?: string;
    };
  };

  // 신청자 정보 (조인된 데이터)
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

// 사용자 활동 로그
export interface UserActivityLog {
  id: string;
  userId: string;
  type: 'login' | 'logout' | 'upload' | 'api_call' | 'settings_change' | 'error';
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

// API 사용량 상세
export interface ApiUsageDetail {
  id: string;
  userId: string;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  quotaUsed: number;
  timestamp: string;
  errorMessage?: string;
}

// 사용자 관리 필터
export interface UserManagementFilter {
  search: string;
  userType: 'all' | 'user' | 'creator';
  serviceStatus: 'all' | 'active' | 'inactive' | 'suspended';
  youtubeConnected: 'all' | 'connected' | 'disconnected';
  creatorStatus: 'all' | 'pending' | 'approved' | 'rejected';
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy: 'name' | 'email' | 'createdAt' | 'lastLoginAt' | 'videoCount';
  sortOrder: 'asc' | 'desc';
}

// 크리에이터 승인 내역 필터
export interface CreatorApprovalHistoryFilter {
  search: string; // 채널명, 신청자명으로 검색
  status: 'all' | 'approved' | 'rejected';
  reviewedBy: string; // 검토자별 필터
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy: 'reviewedAt' | 'appliedAt' | 'channelName' | 'subscriberCount';
  sortOrder: 'asc' | 'desc';
}

// 사용자 통계
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  
  creators: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  
  youtubeConnections: {
    connected: number;
    disconnected: number;
    withErrors: number;
  };
  
  contentStats: {
    totalVideos: number;
    totalViews: number;
    averageViewsPerVideo: number;
    topCategories: Array<{
      category: string;
      count: number;
    }>;
  };
  
  apiUsage: {
    totalCallsThisMonth: number;
    averageCallsPerUser: number;
    quotaExceededUsers: number;
    topApiEndpoints: Array<{
      endpoint: string;
      calls: number;
    }>;
  };
}

// 일괄 작업 타입
export interface BulkAction {
  type: 'activate' | 'deactivate' | 'suspend' | 'unsuspend' | 'delete' | 'export';
  userIds: string[];
  reason?: string;
  performedBy: string;
  performedAt: string;
}

// 일괄 작업 결과
export interface BulkActionResult {
  actionId: string;
  type: BulkAction['type'];
  totalUsers: number;
  successCount: number;
  failureCount: number;
  failures: Array<{
    userId: string;
    error: string;
  }>;
  completedAt: string;
}

// 사용자 관리 대시보드 데이터
export interface UserManagementDashboard {
  stats: UserStats;
  recentActivities: UserActivityLog[];
  pendingCreatorApplications: CreatorApplication[];
  apiUsageAlerts: Array<{
    userId: string;
    userName: string;
    currentUsage: number;
    limit: number;
    severity: 'warning' | 'critical';
  }>;
  systemHealth: {
    youtubeApiStatus: 'healthy' | 'degraded' | 'down';
    databaseStatus: 'healthy' | 'slow' | 'down';
    averageResponseTime: number;
    errorRate: number;
  };
}

// 사용자 상세 정보 (모달용)
export interface UserDetailInfo {
  user: MyPickUser;
  activityLog: UserActivityLog[];
  apiUsageHistory: Array<{
    date: string;
    calls: number;
    quota: number;
  }>;
  contentHistory: Array<{
    id: string;
    title: string;
    uploadedAt: string;
    views: number;
    likes: number;
    comments: number;
  }>;
}

// Redux 상태 타입
export interface UserManagementState {
  // 사용자 목록
  users: MyPickUser[];
  selectedUsers: string[];
  
  // 페이지네이션
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  
  // 필터링
  filters: UserManagementFilter;
  
  // 상세 정보
  selectedUser: MyPickUser | null;
  userDetail: UserDetailInfo | null;
  
  // 크리에이터 신청
  creatorApplications: CreatorApplication[];
  pendingApplicationsCount: number;
  
  // 크리에이터 승인 내역
  approvalHistory: CreatorApplication[];
  approvalHistoryPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  approvalHistoryFilters: CreatorApprovalHistoryFilter;
  
  // 통계
  stats: UserStats | null;
  dashboard: UserManagementDashboard | null;
  
  // UI 상태
  isLoading: boolean;
  isLoadingDetail: boolean;
  isProcessingBulkAction: boolean;
  isLoadingApprovalHistory: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 모달 상태
  modals: {
    userDetail: boolean;
    creatorApproval: boolean;
    bulkAction: boolean;
    apiLimitSettings: boolean;
  };
  
  // 현재 활성 탭
  activeTab: 'users' | 'approvalHistory';
}

// API 요청/응답 타입
export interface GetUsersRequest {
  page?: number;
  limit?: number;
  filters?: Partial<UserManagementFilter>;
}

export interface GetUsersResponse {
  users: MyPickUser[];
  pagination: UserManagementState['pagination'];
  stats: UserStats;
}

export interface UpdateUserRequest {
  userId: string;
  updates: Partial<Pick<MyPickUser, 'serviceStatus' | 'userType' | 'preferences'>>;
}

export interface CreatorApplicationAction {
  applicationId: string;
  action: 'approve' | 'reject';
  reason?: string;
  reviewedBy: string;
}

// 크리에이터 승인 내역 조회 요청
export interface GetApprovalHistoryRequest {
  page?: number;
  limit?: number;
  filters?: Partial<CreatorApprovalHistoryFilter>;
}

// 크리에이터 승인 내역 조회 응답
export interface GetApprovalHistoryResponse {
  applications: CreatorApplication[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 내보내기 타입
export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  fields: Array<keyof MyPickUser>;
  filters?: Partial<UserManagementFilter>;
}

export interface ExportResult {
  fileName: string;
  downloadUrl: string;
  recordCount: number;
  generatedAt: string;
}