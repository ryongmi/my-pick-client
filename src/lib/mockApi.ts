// Mock API 클라이언트 - 백엔드 없이 테스트용
import { 
  mockLogin, 
  mockRegister, 
  mockUpdateProfile 
} from '@/data/users';
import { 
  mockGetCreators, 
  mockGetCreator, 
  mockFollowCreator, 
  mockUnfollowCreator 
} from '@/data/creators';
import { 
  mockGetContent, 
  mockBookmarkContent, 
  mockRemoveBookmark, 
  mockLikeContent, 
  mockUnlikeContent, 
  mockGetBookmarks 
} from '@/data/content';
import { 
  mockGetNotifications, 
  mockGetUnreadCount, 
  mockMarkAsRead, 
  mockMarkAllAsRead, 
  mockUpdateNotificationSettings 
} from '@/data/notifications';
import { 
  mockGetDashboardStats, 
  mockGetAdminUsers, 
  mockGetAdminCreators, 
  mockApproveCreator, 
  mockRejectCreator, 
  mockUpdateUser, 
  mockDeleteUser 
} from '@/data/admin';
import {
  mockGetUsers,
  mockGetUserDetail,
  mockUpdateUser as mockUpdateMyPickUser,
  mockGetCreatorApplications,
  mockProcessCreatorApplication,
  mockExecuteBulkAction,
  mockGetUserStats,
  mockGetDashboard
} from '@/data/userManagement';

// Mock API 응답 포맷
const createMockResponse = <T>(data: T, success = true, message?: string) => ({
  success,
  data,
  message,
});

// Mock API 클라이언트
export const mockApiClient = {
  // 기본 HTTP 메서드 시뮬레이션
  async get<T>(url: string, config?: any): Promise<{ data: any }> {
    console.log(`[MOCK API] GET ${url}`, config?.params);
    
    // URL에 따른 라우팅
    if (url === '/users/profile') {
      return { data: createMockResponse({ id: '1', name: '김철수', email: 'user@example.com' }) };
    }
    
    if (url.includes('/creators/') && url.includes('/stats')) {
      const creatorId = url.split('/')[2];
      return { 
        data: createMockResponse({
          followersCount: 1500000,
          contentCount: 250,
          totalViews: 50000000,
          engagementRate: 8.5,
          growthRate: 15.2,
          recentActivity: []
        }) 
      };
    }
    
    if (url.includes('/content/') && !url.includes('bookmark')) {
      return { data: createMockResponse({ id: url.split('/')[2], title: 'Sample Content' }) };
    }
    
    if (url === '/notifications/unread-count') {
      const result = await mockGetUnreadCount();
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: GET ${url} not implemented`);
  },

  async post<T>(url: string, data?: any): Promise<{ data: any }> {
    console.log(`[MOCK API] POST ${url}`, data);
    
    if (url === '/auth/login') {
      const result = await mockLogin(data.email, data.password);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/auth/register') {
      const result = await mockRegister(data.name, data.email, data.password);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/auth/logout') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: createMockResponse({ success: true }) };
    }
    
    if (url.includes('/follow')) {
      const creatorId = url.split('/')[2];
      const result = await mockFollowCreator(creatorId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/bookmark')) {
      const contentId = url.split('/')[2];
      const result = await mockBookmarkContent(contentId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/like')) {
      const contentId = url.split('/')[2];
      const result = await mockLikeContent(contentId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/approve')) {
      const creatorId = url.split('/')[3];
      const result = await mockApproveCreator(creatorId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/reject')) {
      const creatorId = url.split('/')[3];
      const result = await mockRejectCreator(creatorId);
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: POST ${url} not implemented`);
  },

  async put<T>(url: string, data?: any): Promise<{ data: any }> {
    console.log(`[MOCK API] PUT ${url}`, data);
    
    if (url === '/auth/profile') {
      const result = await mockUpdateProfile('1', data);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/notifications/') && url.includes('/read')) {
      const notificationId = url.split('/')[2];
      const result = await mockMarkAsRead(notificationId);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/notifications/read-all') {
      const result = await mockMarkAllAsRead();
      return { data: createMockResponse(result) };
    }
    
    if (url === '/notifications/settings') {
      const result = await mockUpdateNotificationSettings(data);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/admin/users/')) {
      const userId = url.split('/')[3];
      const result = await mockUpdateUser(userId, data);
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: PUT ${url} not implemented`);
  },

  async delete<T>(url: string): Promise<{ data: any }> {
    console.log(`[MOCK API] DELETE ${url}`);
    
    if (url.includes('/follow')) {
      const creatorId = url.split('/')[2];
      const result = await mockUnfollowCreator(creatorId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/bookmark')) {
      const contentId = url.split('/')[2];
      const result = await mockRemoveBookmark(contentId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/like')) {
      const contentId = url.split('/')[2];
      const result = await mockUnlikeContent(contentId);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/admin/users/')) {
      const userId = url.split('/')[3];
      const result = await mockDeleteUser(userId);
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: DELETE ${url} not implemented`);
  },

  async getPaginated<T>(url: string, params?: any): Promise<any> {
    console.log(`[MOCK API] GET PAGINATED ${url}`, params);
    
    if (url === '/creators') {
      return await mockGetCreators(params);
    }
    
    if (url === '/content') {
      return await mockGetContent(params);
    }
    
    if (url === '/content/bookmarks') {
      return await mockGetBookmarks(params?.page, params?.limit);
    }
    
    if (url === '/notifications') {
      return await mockGetNotifications(params?.page, params?.limit);
    }
    
    if (url === '/admin/dashboard') {
      const result = await mockGetDashboardStats();
      return { data: createMockResponse(result) };
    }
    
    if (url === '/admin/users') {
      return await mockGetAdminUsers(params);
    }
    
    if (url === '/admin/creators') {
      return await mockGetAdminCreators(params);
    }
    
    throw new Error(`Mock API: GET PAGINATED ${url} not implemented`);
  },
};

// Mock API 함수들
export const mockAuthApi = {
  login: (credentials: { email: string; password: string }) =>
    mockApiClient.post('/auth/login', credentials),
  
  register: (data: { name: string; email: string; password: string }) =>
    mockApiClient.post('/auth/register', data),
  
  logout: () => mockApiClient.post('/auth/logout'),
  
  refreshToken: () => {
    // Mock refresh token - 단순히 성공 응답 반환
    return Promise.resolve({
      data: {
        success: true,
        data: {
          token: 'mock-refreshed-token',
          user: {
            id: '1',
            name: '김철수',
            email: 'user@example.com',
            role: 'user'
          }
        }
      }
    });
  },
  
  updateProfile: (data: any) => mockApiClient.put('/auth/profile', data),
};

export const mockUserApi = {
  getProfile: () => mockApiClient.get('/users/profile'),
  updateProfile: (data: any) => mockApiClient.put('/users/profile', data),
  getSettings: () => mockApiClient.get('/users/settings'),
  updateSettings: (settings: any) => mockApiClient.put('/users/settings', settings),
};

export const mockCreatorApi = {
  getCreators: (params?: any) => mockApiClient.getPaginated('/creators', params),
  getCreator: (id: string) => mockApiClient.get(`/creators/${id}`),
  followCreator: (id: string) => mockApiClient.post(`/creators/${id}/follow`),
  unfollowCreator: (id: string) => mockApiClient.delete(`/creators/${id}/follow`),
  getCreatorStats: (id: string) => mockApiClient.get(`/creators/${id}/stats`),
};

export const mockContentApi = {
  getContent: (params?: any) => mockApiClient.getPaginated('/content', params),
  getContentById: (id: string) => mockApiClient.get(`/content/${id}`),
  bookmarkContent: (id: string) => mockApiClient.post(`/content/${id}/bookmark`),
  removeBookmark: (id: string) => mockApiClient.delete(`/content/${id}/bookmark`),
  likeContent: (id: string) => mockApiClient.post(`/content/${id}/like`),
  unlikeContent: (id: string) => mockApiClient.delete(`/content/${id}/like`),
  getBookmarks: (page = 1, limit = 20) =>
    mockApiClient.getPaginated('/content/bookmarks', { page, limit }),
};

export const mockNotificationApi = {
  getNotifications: (page = 1, limit = 20) =>
    mockApiClient.getPaginated('/notifications', { page, limit }),
  markAsRead: (id: string) => mockApiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => mockApiClient.put('/notifications/read-all'),
  getUnreadCount: () => mockApiClient.get('/notifications/unread-count'),
  updateSettings: (settings: any) => mockApiClient.put('/notifications/settings', settings),
};

export const mockAdminApi = {
  getDashboardStats: () => mockApiClient.getPaginated('/admin/dashboard'),
  getUsers: (params?: any) => mockApiClient.getPaginated('/admin/users', params),
  getUser: (id: string) => mockApiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => mockApiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => mockApiClient.delete(`/admin/users/${id}`),
  getCreators: (params?: any) => mockApiClient.getPaginated('/admin/creators', params),
  approveCreator: (id: string) => mockApiClient.post(`/admin/creators/${id}/approve`),
  rejectCreator: (id: string) => mockApiClient.post(`/admin/creators/${id}/reject`),
};

// MyPick 사용자 관리 전용 API
export const mockUserManagementApi = {
  // 사용자 목록 조회
  getUsers: async (params?: any) => {
    console.log('[MOCK USER MANAGEMENT API] getUsers', params);
    return await mockGetUsers(params);
  },

  // 사용자 상세 정보 조회
  getUserDetail: async (userId: string) => {
    console.log('[MOCK USER MANAGEMENT API] getUserDetail', userId);
    return await mockGetUserDetail(userId);
  },

  // 사용자 정보 업데이트
  updateUser: async (params: any) => {
    console.log('[MOCK USER MANAGEMENT API] updateUser', params);
    return await mockUpdateMyPickUser(params);
  },

  // 크리에이터 신청 목록 조회
  getCreatorApplications: async () => {
    console.log('[MOCK USER MANAGEMENT API] getCreatorApplications');
    return await mockGetCreatorApplications();
  },

  // 크리에이터 신청 처리 (승인/거부)
  processCreatorApplication: async (params: any) => {
    console.log('[MOCK USER MANAGEMENT API] processCreatorApplication', params);
    return await mockProcessCreatorApplication(params);
  },

  // 일괄 작업 실행
  executeBulkAction: async (action: any) => {
    console.log('[MOCK USER MANAGEMENT API] executeBulkAction', action);
    return await mockExecuteBulkAction(action);
  },

  // 사용자 통계 조회
  getUserStats: async () => {
    console.log('[MOCK USER MANAGEMENT API] getUserStats');
    return await mockGetUserStats();
  },

  // 대시보드 데이터 조회
  getDashboard: async () => {
    console.log('[MOCK USER MANAGEMENT API] getDashboard');
    return await mockGetDashboard();
  },
};
