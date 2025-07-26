// MyPick 사용자 관리 Mock 데이터

import { 
  MyPickUser, 
  CreatorApplication, 
  UserStats, 
  UserActivityLog, 
  UserDetailInfo,
  UserManagementDashboard,
  BulkAction,
  BulkActionResult,
  GetUsersRequest,
  GetUsersResponse,
  UpdateUserRequest,
  CreatorApplicationAction,
  GetApprovalHistoryRequest,
  GetApprovalHistoryResponse
} from '@/types/userManagement';

// Mock 사용자 데이터
export const mockMyPickUsers: MyPickUser[] = [
  {
    id: '1',
    name: '김철수',
    email: 'kimcs@example.com',
    avatar: '/avatars/user1.jpg',
    role: 'admin',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-07-20T14:30:00Z',
    serviceStatus: 'active',
    lastLoginAt: '2024-07-25T08:15:00Z',
    userType: 'creator',
    youtubeConnection: {
      isConnected: true,
      channelId: 'UC123456789',
      channelName: '김철수의 Tech Talk',
      channelUrl: 'https://youtube.com/c/kimcs-tech',
      subscriberCount: 25000,
      connectedAt: '2024-01-20T10:00:00Z',
      lastSyncAt: '2024-07-25T06:00:00Z',
      tokenExpiry: '2024-08-25T10:00:00Z',
      hasError: false,
    },
    contentStats: {
      videoCount: 45,
      totalViews: 1250000,
      totalLikes: 85000,
      totalComments: 12000,
      averageViews: 27777,
      lastUploadAt: '2024-07-23T15:30:00Z',
    },
    apiUsage: {
      currentMonth: 850,
      dailyLimit: 100,
      monthlyLimit: 10000,
      lastUsedAt: '2024-07-25T07:45:00Z',
      quotaExceeded: false,
    },
    creatorApplication: {
      id: 'app1',
      userId: '1',
      status: 'approved',
      appliedAt: '2024-01-15T09:00:00Z',
      reviewedAt: '2024-01-16T11:00:00Z',
      reviewedBy: 'admin',
      applicationData: {
        channelName: '김철수의 Tech Talk',
        channelId: 'UC123456789',
        channelUrl: 'https://youtube.com/c/kimcs-tech',
        subscriberCount: 15000,
        contentCategory: 'Technology',
        description: '개발자를 위한 기술 정보와 튜토리얼을 제공합니다.',
        sampleVideos: ['v1', 'v2', 'v3'],
        businessEmail: 'business@kimcs.com',
        socialLinks: {
          instagram: '@kimcs_tech',
          twitter: '@kimcs_dev',
          website: 'https://kimcs.dev'
        }
      }
    },
    preferences: {
      categories: ['Technology', 'Programming', 'AI'],
      language: 'ko',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '2',
    name: '이영희',
    email: 'leeyh@example.com',
    avatar: '/avatars/user2.jpg',
    role: 'user',
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-07-24T16:45:00Z',
    serviceStatus: 'active',
    lastLoginAt: '2024-07-24T20:30:00Z',
    userType: 'user',
    youtubeConnection: {
      isConnected: false,
      hasError: false,
    },
    contentStats: {
      videoCount: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      averageViews: 0,
    },
    apiUsage: {
      currentMonth: 45,
      dailyLimit: 50,
      monthlyLimit: 1000,
      lastUsedAt: '2024-07-24T18:20:00Z',
      quotaExceeded: false,
    },
    preferences: {
      categories: ['Entertainment', 'Music', 'Travel'],
      language: 'ko',
      notifications: {
        email: true,
        push: false,
        marketing: true,
      },
    },
  },
  {
    id: '3',
    name: '박민수',
    email: 'parkms@example.com',
    avatar: '/avatars/user3.jpg',
    role: 'premium',
    createdAt: '2024-03-05T11:15:00Z',
    updatedAt: '2024-07-25T09:00:00Z',
    serviceStatus: 'active',
    lastLoginAt: '2024-07-25T09:00:00Z',
    userType: 'creator',
    youtubeConnection: {
      isConnected: true,
      channelId: 'UC987654321',
      channelName: '박민수의 요리채널',
      channelUrl: 'https://youtube.com/c/parkms-cooking',
      subscriberCount: 8500,
      connectedAt: '2024-03-10T15:00:00Z',
      lastSyncAt: '2024-07-25T05:30:00Z',
      tokenExpiry: '2024-09-10T15:00:00Z',
      hasError: false,
    },
    contentStats: {
      videoCount: 28,
      totalViews: 580000,
      totalLikes: 45000,
      totalComments: 8500,
      averageViews: 20714,
      lastUploadAt: '2024-07-20T12:00:00Z',
    },
    apiUsage: {
      currentMonth: 320,
      dailyLimit: 80,
      monthlyLimit: 5000,
      lastUsedAt: '2024-07-25T08:30:00Z',
      quotaExceeded: false,
    },
    creatorApplication: {
      id: 'app3',
      userId: '3',
      status: 'approved',
      appliedAt: '2024-03-05T11:15:00Z',
      reviewedAt: '2024-03-06T09:30:00Z',
      reviewedBy: 'admin',
      applicationData: {
        channelName: '박민수의 요리채널',
        channelId: 'UC987654321',
        channelUrl: 'https://youtube.com/c/parkms-cooking',
        subscriberCount: 5000,
        contentCategory: 'Food & Cooking',
        description: '집에서 쉽게 만들 수 있는 요리 레시피를 소개합니다.',
        sampleVideos: ['v4', 'v5', 'v6'],
        businessEmail: 'cook@parkms.com',
      }
    },
    preferences: {
      categories: ['Food', 'Cooking', 'Lifestyle'],
      language: 'ko',
      notifications: {
        email: true,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '4',
    name: '정수현',
    email: 'jungsh@example.com',
    avatar: '/avatars/user4.jpg',
    role: 'user',
    createdAt: '2024-04-12T16:30:00Z',
    updatedAt: '2024-07-22T10:15:00Z',
    serviceStatus: 'suspended',
    lastLoginAt: '2024-07-20T14:45:00Z',
    userType: 'user',
    youtubeConnection: {
      isConnected: true,
      channelId: 'UC456789123',
      channelName: '정수현의 게임방송',
      channelUrl: 'https://youtube.com/c/jungsh-gaming',
      subscriberCount: 1200,
      connectedAt: '2024-04-15T12:00:00Z',
      lastSyncAt: '2024-07-20T14:30:00Z',
      tokenExpiry: '2024-10-15T12:00:00Z',
      hasError: true,
      errorMessage: 'API 할당량 초과',
    },
    contentStats: {
      videoCount: 12,
      totalViews: 25000,
      totalLikes: 1800,
      totalComments: 350,
      averageViews: 2083,
      lastUploadAt: '2024-07-18T19:00:00Z',
    },
    apiUsage: {
      currentMonth: 5500,
      dailyLimit: 100,
      monthlyLimit: 5000,
      lastUsedAt: '2024-07-20T14:30:00Z',
      quotaExceeded: true,
    },
    preferences: {
      categories: ['Gaming', 'Entertainment', 'Sports'],
      language: 'ko',
      notifications: {
        email: false,
        push: true,
        marketing: false,
      },
    },
  },
  {
    id: '5',
    name: '최지은',
    email: 'choije@example.com',
    avatar: '/avatars/user5.jpg',
    role: 'user',
    createdAt: '2024-06-20T13:45:00Z',
    updatedAt: '2024-07-25T07:20:00Z',
    serviceStatus: 'inactive',
    lastLoginAt: '2024-07-10T16:20:00Z',
    userType: 'creator',
    youtubeConnection: {
      isConnected: false,
      hasError: false,
    },
    contentStats: {
      videoCount: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      averageViews: 0,
    },
    apiUsage: {
      currentMonth: 0,
      dailyLimit: 50,
      monthlyLimit: 1000,
      lastUsedAt: '2024-07-20T10:15:00Z',
      quotaExceeded: false,
    },
    creatorApplication: {
      id: 'app5',
      userId: '5',
      status: 'pending',
      appliedAt: '2024-07-15T10:30:00Z',
      applicationData: {
        channelName: '최지은의 뷰티채널',
        channelId: 'UC111222333',
        channelUrl: 'https://youtube.com/c/choije-beauty',
        subscriberCount: 3500,
        contentCategory: 'Beauty & Fashion',
        description: '최신 뷰티 트렌드와 메이크업 팁을 공유합니다.',
        sampleVideos: ['v7', 'v8', 'v9'],
        businessEmail: 'beauty@choije.com',
        socialLinks: {
          instagram: '@choije_beauty',
        }
      }
    },
    preferences: {
      categories: ['Beauty', 'Fashion', 'Lifestyle'],
      language: 'ko',
      notifications: {
        email: true,
        push: false,
        marketing: true,
      },
    },
  },
];

// Mock 크리에이터 신청 데이터
export const mockCreatorApplications: CreatorApplication[] = [
  // 승인된 신청들
  {
    id: 'app1',
    userId: '1',
    status: 'approved',
    appliedAt: '2024-01-10T09:00:00Z',
    reviewedAt: '2024-01-12T14:30:00Z',
    reviewedBy: '관리자',
    applicationData: {
      channelName: '김철수의 Tech Talk',
      channelId: 'UC123456789',
      channelUrl: 'https://youtube.com/c/kimcs-tech',
      subscriberCount: 25000,
      contentCategory: 'Technology & Programming',
      description: '최신 기술 트렌드와 프로그래밍 팁을 공유합니다.',
      sampleVideos: ['v1', 'v2', 'v3'],
      businessEmail: 'business@kimcs.com',
      socialLinks: {
        website: 'https://kimcs.dev',
        twitter: '@kimcs_dev',
      }
    },
    user: {
      id: '1',
      name: '김철수',
      email: 'kimcs@example.com',
      avatar: '/avatars/user1.jpg',
    }
  },
  {
    id: 'app2',
    userId: '2',
    status: 'approved',
    appliedAt: '2024-02-15T11:20:00Z',
    reviewedAt: '2024-02-16T16:45:00Z',
    reviewedBy: '관리자',
    applicationData: {
      channelName: '이영희의 요리교실',
      channelId: 'UC987654321',
      channelUrl: 'https://youtube.com/c/leeyh-cooking',
      subscriberCount: 18000,
      contentCategory: 'Food & Cooking',
      description: '간단하고 맛있는 요리 레시피를 알려드립니다.',
      sampleVideos: ['v4', 'v5', 'v6'],
      businessEmail: 'cooking@leeyh.com',
      socialLinks: {
        instagram: '@leeyh_cooking',
      }
    },
    user: {
      id: '2',
      name: '이영희',
      email: 'leeyh@example.com',
      avatar: '/avatars/user2.jpg',
    }
  },
  // 거부된 신청들
  {
    id: 'app3',
    userId: '7',
    status: 'rejected',
    appliedAt: '2024-06-10T13:15:00Z',
    reviewedAt: '2024-06-12T10:20:00Z',
    reviewedBy: '관리자',
    rejectionReason: '구독자 수 기준 미달 (최소 1,000명 이상)',
    applicationData: {
      channelName: '작은 채널',
      channelId: 'UC111111111',
      channelUrl: 'https://youtube.com/c/small-channel',
      subscriberCount: 500,
      contentCategory: 'Entertainment',
      description: '일상과 취미를 공유하는 채널입니다.',
      sampleVideos: ['v12', 'v13'],
      businessEmail: 'small@channel.com',
    },
    user: {
      id: '7',
      name: '박소영',
      email: 'park@example.com',
    }
  },
  {
    id: 'app4',
    userId: '8',
    status: 'rejected',
    appliedAt: '2024-07-01T08:30:00Z',
    reviewedAt: '2024-07-02T15:45:00Z',
    reviewedBy: '관리자',
    rejectionReason: '부적절한 콘텐츠로 인한 거부',
    applicationData: {
      channelName: '문제 채널',
      channelId: 'UC222222222',
      channelUrl: 'https://youtube.com/c/problem-channel',
      subscriberCount: 5000,
      contentCategory: 'Entertainment',
      description: '다양한 엔터테인먼트 콘텐츠',
      sampleVideos: ['v14', 'v15'],
    },
    user: {
      id: '8',
      name: '최문제',
      email: 'choi@example.com',
    }
  },
  // 대기 중인 신청들
  {
    id: 'app5',
    userId: '5',
    status: 'pending',
    appliedAt: '2024-07-15T10:30:00Z',
    applicationData: {
      channelName: '최지은의 뷰티채널',
      channelId: 'UC111222333',
      channelUrl: 'https://youtube.com/c/choije-beauty',
      subscriberCount: 3500,
      contentCategory: 'Beauty & Fashion',
      description: '최신 뷰티 트렌드와 메이크업 팁을 공유합니다.',
      sampleVideos: ['v7', 'v8', 'v9'],
      businessEmail: 'beauty@choije.com',
      socialLinks: {
        instagram: '@choije_beauty',
      }
    },
    user: {
      id: '5',
      name: '최지은',
      email: 'choije@example.com',
    }
  },
  {
    id: 'app6',
    userId: '6',
    status: 'pending',
    appliedAt: '2024-07-20T14:15:00Z',
    applicationData: {
      channelName: '한국 여행 가이드',
      channelId: 'UC222333444',
      channelUrl: 'https://youtube.com/c/korea-travel-guide',
      subscriberCount: 12000,
      contentCategory: 'Travel & Tourism',
      description: '한국의 숨은 명소와 여행 정보를 소개합니다.',
      sampleVideos: ['v10', 'v11', 'v12'],
      businessEmail: 'travel@korea.com',
      socialLinks: {
        instagram: '@korea_travel',
        website: 'https://korea-travel.guide'
      }
    },
    user: {
      id: '6',
      name: '정민수',
      email: 'jms@example.com',
    }
  },
];

// Mock 사용자 활동 로그
export const mockUserActivityLogs: UserActivityLog[] = [
  {
    id: 'log1',
    userId: '1',
    type: 'login',
    description: '사용자가 로그인했습니다.',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    timestamp: '2024-07-25T08:15:00Z',
  },
  {
    id: 'log2',
    userId: '1',
    type: 'upload',
    description: '새 영상을 업로드했습니다: "React 19 새로운 기능들"',
    metadata: { videoId: 'v123', title: 'React 19 새로운 기능들' },
    timestamp: '2024-07-23T15:30:00Z',
  },
  {
    id: 'log3',
    userId: '4',
    type: 'error',
    description: 'API 할당량 초과로 인한 오류 발생',
    metadata: { errorCode: 'QUOTA_EXCEEDED', endpoint: '/youtube/videos' },
    timestamp: '2024-07-20T14:30:00Z',
  },
];

// Mock 사용자 통계
export const mockUserStats: UserStats = {
  totalUsers: 5,
  activeUsers: 3,
  inactiveUsers: 1,
  suspendedUsers: 1,
  
  creators: {
    total: 3,
    pending: 2,
    approved: 2,
    rejected: 0,
  },
  
  youtubeConnections: {
    connected: 3,
    disconnected: 2,
    withErrors: 1,
  },
  
  contentStats: {
    totalVideos: 85,
    totalViews: 1855000,
    averageViewsPerVideo: 21823,
    topCategories: [
      { category: 'Technology', count: 45 },
      { category: 'Food & Cooking', count: 28 },
      { category: 'Gaming', count: 12 },
    ],
  },
  
  apiUsage: {
    totalCallsThisMonth: 6715,
    averageCallsPerUser: 1343,
    quotaExceededUsers: 1,
    topApiEndpoints: [
      { endpoint: '/youtube/videos', calls: 3200 },
      { endpoint: '/youtube/channels', calls: 1800 },
      { endpoint: '/youtube/search', calls: 1715 },
    ],
  },
};

// Mock API 함수들

// 사용자 목록 조회
export const mockGetUsers = async (params: GetUsersRequest = {}): Promise<GetUsersResponse> => {
  const { page = 1, limit = 20, filters = {} } = params;
  
  let filteredUsers = [...mockMyPickUsers];
  
  // 필터링 적용
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user => 
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.userType && filters.userType !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.userType === filters.userType);
  }
  
  if (filters.serviceStatus && filters.serviceStatus !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.serviceStatus === filters.serviceStatus);
  }
  
  if (filters.youtubeConnected && filters.youtubeConnected !== 'all') {
    const isConnected = filters.youtubeConnected === 'connected';
    filteredUsers = filteredUsers.filter(user => user.youtubeConnection.isConnected === isConnected);
  }
  
  if (filters.creatorStatus && filters.creatorStatus !== 'all') {
    filteredUsers = filteredUsers.filter(user => 
      user.creatorApplication?.status === filters.creatorStatus
    );
  }
  
  // 정렬 적용
  if (filters.sortBy && filters.sortOrder) {
    filteredUsers.sort((a, b) => {
      let aValue: any = a[filters.sortBy!];
      let bValue: any = b[filters.sortBy!];
      
      if (filters.sortBy === 'lastLoginAt') {
        aValue = new Date(a.lastLoginAt || 0).getTime();
        bValue = new Date(b.lastLoginAt || 0).getTime();
      } else if (filters.sortBy === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (filters.sortBy === 'videoCount') {
        aValue = a.contentStats.videoCount;
        bValue = b.contentStats.videoCount;
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      const order = filters.sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? order : aValue < bValue ? -order : 0;
    });
  }
  
  // 페이지네이션 적용
  const total = filteredUsers.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const users = filteredUsers.slice(startIndex, endIndex);
  
  // 응답 시뮬레이션 지연
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
    stats: mockUserStats,
  };
};

// 사용자 상세 정보 조회
export const mockGetUserDetail = async (userId: string): Promise<UserDetailInfo> => {
  const user = mockMyPickUsers.find(u => u.id === userId);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  const activityLog = mockUserActivityLogs.filter(log => log.userId === userId);
  
  // Mock API 사용량 히스토리 (최근 7일)
  const apiUsageHistory = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return {
      date: date.toISOString().split('T')[0],
      calls: Math.floor(Math.random() * 200) + 50,
      quota: user.apiUsage.dailyLimit,
    };
  }).reverse();
  
  // Mock 콘텐츠 히스토리
  const contentHistory = user.contentStats.videoCount > 0 ? 
    Array.from({ length: Math.min(user.contentStats.videoCount, 10) }, (_, i) => ({
      id: `video_${user.id}_${i + 1}`,
      title: `Sample Video ${i + 1}`,
      uploadedAt: new Date(Date.now() - i * 86400000 * 3).toISOString(),
      views: Math.floor(Math.random() * 50000) + 1000,
      likes: Math.floor(Math.random() * 2000) + 100,
      comments: Math.floor(Math.random() * 500) + 20,
    })) : [];
  
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return {
    user,
    activityLog,
    apiUsageHistory,
    contentHistory,
  };
};

// 사용자 정보 업데이트
export const mockUpdateUser = async (params: UpdateUserRequest): Promise<MyPickUser> => {
  const { userId, updates } = params;
  const userIndex = mockMyPickUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  mockMyPickUsers[userIndex] = {
    ...mockMyPickUsers[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockMyPickUsers[userIndex];
};

// 크리에이터 신청 목록 조회
export const mockGetCreatorApplications = async (): Promise<CreatorApplication[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockCreatorApplications];
};

// 크리에이터 신청 처리
export const mockProcessCreatorApplication = async (params: CreatorApplicationAction): Promise<CreatorApplication> => {
  const { applicationId, action, reason, reviewedBy } = params;
  const appIndex = mockCreatorApplications.findIndex(app => app.id === applicationId);
  
  if (appIndex === -1) {
    throw new Error('크리에이터 신청을 찾을 수 없습니다.');
  }
  
  const now = new Date().toISOString();
  mockCreatorApplications[appIndex] = {
    ...mockCreatorApplications[appIndex],
    status: action === 'approve' ? 'approved' : 'rejected',
    reviewedAt: now,
    reviewedBy,
    rejectionReason: action === 'reject' ? reason : undefined,
  };
  
  // 사용자 타입도 업데이트
  if (action === 'approve') {
    const userId = mockCreatorApplications[appIndex].userId;
    const userIndex = mockMyPickUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockMyPickUsers[userIndex].userType = 'creator';
      mockMyPickUsers[userIndex].updatedAt = now;
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 700));
  
  return mockCreatorApplications[appIndex];
};

// 일괄 작업 실행
export const mockExecuteBulkAction = async (action: BulkAction): Promise<BulkActionResult> => {
  const { type, userIds, reason, performedBy } = action;
  
  let successCount = 0;
  let failureCount = 0;
  const failures: Array<{ userId: string; error: string }> = [];
  
  // 실제 처리 시뮬레이션
  for (const userId of userIds) {
    const userIndex = mockMyPickUsers.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      failures.push({ userId, error: '사용자를 찾을 수 없습니다.' });
      failureCount++;
      continue;
    }
    
    try {
      const now = new Date().toISOString();
      
      switch (type) {
        case 'activate':
          mockMyPickUsers[userIndex].serviceStatus = 'active';
          break;
        case 'deactivate':
          mockMyPickUsers[userIndex].serviceStatus = 'inactive';
          break;
        case 'suspend':
          mockMyPickUsers[userIndex].serviceStatus = 'suspended';
          break;
        case 'unsuspend':
          mockMyPickUsers[userIndex].serviceStatus = 'active';
          break;
        case 'delete':
          mockMyPickUsers.splice(userIndex, 1);
          break;
      }
      
      if (type !== 'delete') {
        mockMyPickUsers[userIndex].updatedAt = now;
      }
      
      successCount++;
    } catch (error) {
      failures.push({ userId, error: '처리 중 오류가 발생했습니다.' });
      failureCount++;
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    actionId: `bulk_${Date.now()}`,
    type,
    totalUsers: userIds.length,
    successCount,
    failureCount,
    failures,
    completedAt: new Date().toISOString(),
  };
};

// 사용자 통계 조회
export const mockGetUserStats = async (): Promise<UserStats> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  return { ...mockUserStats };
};

// 대시보드 데이터 조회
export const mockGetDashboard = async (): Promise<UserManagementDashboard> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  return {
    stats: mockUserStats,
    recentActivities: mockUserActivityLogs.slice(0, 10),
    pendingCreatorApplications: mockCreatorApplications.filter(app => app.status === 'pending'),
    apiUsageAlerts: [
      {
        userId: '4',
        userName: '정수현',
        currentUsage: 5500,
        limit: 5000,
        severity: 'critical',
      },
    ],
    systemHealth: {
      youtubeApiStatus: 'healthy',
      databaseStatus: 'healthy',
      averageResponseTime: 245,
      errorRate: 0.2,
    },
  };
};

// 크리에이터 승인 내역 조회
export const mockGetApprovalHistory = async (params: GetApprovalHistoryRequest = {}): Promise<GetApprovalHistoryResponse> => {
  const { page = 1, limit = 20, filters = {} } = params;
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 승인/거부된 신청만 필터링
  let filteredApplications = mockCreatorApplications.filter(app => app.status !== 'pending');
  
  // 필터 적용
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredApplications = filteredApplications.filter(app => 
      app.applicationData.channelName.toLowerCase().includes(searchLower) ||
      app.user?.name.toLowerCase().includes(searchLower) ||
      app.user?.email.toLowerCase().includes(searchLower)
    );
  }
  
  if (filters.status && filters.status !== 'all') {
    filteredApplications = filteredApplications.filter(app => app.status === filters.status);
  }
  
  if (filters.reviewedBy) {
    filteredApplications = filteredApplications.filter(app => 
      app.reviewedBy?.toLowerCase().includes(filters.reviewedBy?.toLowerCase() || '')
    );
  }
  
  if (filters.dateRange) {
    const startDate = new Date(filters.dateRange.start);
    const endDate = new Date(filters.dateRange.end);
    filteredApplications = filteredApplications.filter(app => {
      if (!app.reviewedAt) {return false;}
      const reviewDate = new Date(app.reviewedAt);
      return reviewDate >= startDate && reviewDate <= endDate;
    });
  }
  
  // 정렬
  const sortBy = filters.sortBy || 'reviewedAt';
  const sortOrder = filters.sortOrder || 'desc';
  
  filteredApplications.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'reviewedAt':
        aValue = a.reviewedAt ? new Date(a.reviewedAt).getTime() : 0;
        bValue = b.reviewedAt ? new Date(b.reviewedAt).getTime() : 0;
        break;
      case 'appliedAt':
        aValue = new Date(a.appliedAt).getTime();
        bValue = new Date(b.appliedAt).getTime();
        break;
      case 'channelName':
        aValue = a.applicationData.channelName.toLowerCase();
        bValue = b.applicationData.channelName.toLowerCase();
        break;
      case 'subscriberCount':
        aValue = a.applicationData.subscriberCount;
        bValue = b.applicationData.subscriberCount;
        break;
      default:
        aValue = a.reviewedAt ? new Date(a.reviewedAt).getTime() : 0;
        bValue = b.reviewedAt ? new Date(b.reviewedAt).getTime() : 0;
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
  
  // 페이지네이션
  const total = filteredApplications.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const applications = filteredApplications.slice(start, end);
  
  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};