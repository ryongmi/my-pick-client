// Mock API 클라이언트 - 알림 시스템과 일부 인증 기능만 유지
import { 
  mockLogin, 
  mockRegister, 
  mockUpdateProfile 
} from '@/data/users';
import { 
  mockGetNotifications, 
  mockGetUnreadCount, 
  mockMarkAsRead, 
  mockMarkAllAsRead, 
  mockUpdateNotificationSettings 
} from '@/data/notifications';

// Mock API 응답 포맷
const createMockResponse = <T>(data: T, success = true, message?: string) => ({
  success,
  data,
  message,
});

// Mock API 클라이언트 (알림 시스템 전용)
export const mockApiClient = {
  // 기본 HTTP 메서드 시뮬레이션
  async get<T>(url: string, config?: any): Promise<{ data: any }> {
    console.log(`[MOCK API] GET ${url}`, config?.params);
    
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
    
    throw new Error(`Mock API: PUT ${url} not implemented`);
  },

  async delete<T>(url: string): Promise<{ data: any }> {
    console.log(`[MOCK API] DELETE ${url}`);
    throw new Error(`Mock API: DELETE ${url} not implemented`);
  },

  async getPaginated<T>(url: string, params?: any): Promise<any> {
    console.log(`[MOCK API] GET PAGINATED ${url}`, params);
    
    if (url === '/notifications') {
      return await mockGetNotifications(params?.page, params?.limit);
    }
    
    throw new Error(`Mock API: GET PAGINATED ${url} not implemented`);
  },
};

// Mock 인증 API (인증 관련 기능은 추후 작업)
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

// Mock 알림 API (서버에 알림 모듈이 없으므로 유지)
export const mockNotificationApi = {
  getNotifications: (page = 1, limit = 20) =>
    mockApiClient.getPaginated('/notifications', { page, limit }),
  markAsRead: (id: string) => mockApiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => mockApiClient.put('/notifications/read-all'),
  getUnreadCount: () => mockApiClient.get('/notifications/unread-count'),
  updateSettings: (settings: any) => mockApiClient.put('/notifications/settings', settings),
};