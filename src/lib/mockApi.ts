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
const createMockResponse = <T>(data: T, success = true, message?: string): { success: boolean; data: T; message?: string } => {
  const response: { success: boolean; data: T; message?: string } = {
    success,
    data
  };
  if (message !== undefined) {
    response.message = message;
  }
  return response;
};

// Mock API 클라이언트 (알림 시스템 전용)
export const mockApiClient = {
  // 기본 HTTP 메서드 시뮬레이션
  async get(url: string, config?: { params?: Record<string, unknown> }): Promise<{ data: unknown }> {
    // eslint-disable-next-line no-console
    console.log(`[MOCK API] GET ${url}`, config?.params);
    
    if (url === '/notifications/unread-count') {
      const result = await mockGetUnreadCount();
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: GET ${url} not implemented`);
  },

  async post(url: string, data?: Record<string, unknown>): Promise<{ data: unknown }> {
    // eslint-disable-next-line no-console
    console.log(`[MOCK API] POST ${url}`, data);
    
    if (url === '/auth/login' && data) {
      const email = String(data.email || '');
      const password = String(data.password || '');
      const result = await mockLogin(email, password);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/auth/register' && data) {
      const name = String(data.name || '');
      const email = String(data.email || '');
      const password = String(data.password || '');
      const result = await mockRegister(name, email, password);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/auth/logout') {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: createMockResponse({ success: true }) };
    }
    
    throw new Error(`Mock API: POST ${url} not implemented`);
  },

  async put(url: string, data?: Record<string, unknown>): Promise<{ data: unknown }> {
    // eslint-disable-next-line no-console
    console.log(`[MOCK API] PUT ${url}`, data);
    
    if (url === '/auth/profile' && data) {
      const result = await mockUpdateProfile('1', data);
      return { data: createMockResponse(result) };
    }
    
    if (url.includes('/notifications/') && url.includes('/read')) {
      const notificationId = url.split('/')[2];
      if (!notificationId) {
        throw new Error('Missing notification ID');
      }
      const result = await mockMarkAsRead(notificationId);
      return { data: createMockResponse(result) };
    }
    
    if (url === '/notifications/read-all') {
      const result = await mockMarkAllAsRead();
      return { data: createMockResponse(result) };
    }
    
    if (url === '/notifications/settings' && data) {
      const result = await mockUpdateNotificationSettings(data);
      return { data: createMockResponse(result) };
    }
    
    throw new Error(`Mock API: PUT ${url} not implemented`);
  },

  async delete(url: string): Promise<{ data: unknown }> {
    // eslint-disable-next-line no-console
    console.log(`[MOCK API] DELETE ${url}`);
    throw new Error(`Mock API: DELETE ${url} not implemented`);
  },

  async getPaginated(url: string, params?: Record<string, unknown>): Promise<unknown> {
    // eslint-disable-next-line no-console
    console.log(`[MOCK API] GET PAGINATED ${url}`, params);
    
    if (url === '/notifications') {
      return await mockGetNotifications(params?.page as number, params?.limit as number);
    }
    
    throw new Error(`Mock API: GET PAGINATED ${url} not implemented`);
  },
};

// Mock 인증 API (인증 관련 기능은 추후 작업)
export const mockAuthApi = {
  login: (credentials: { email: string; password: string }): Promise<{ data: unknown }> =>
    mockApiClient.post('/auth/login', credentials),
  
  register: (data: { name: string; email: string; password: string }): Promise<{ data: unknown }> =>
    mockApiClient.post('/auth/register', data),
  
  logout: (): Promise<{ data: unknown }> => mockApiClient.post('/auth/logout'),
  
  refreshToken: (): Promise<{ data: { success: boolean; data: { token: string; user: { id: string; name: string; email: string; role: string } } } }> => {
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
  
  updateProfile: (data: Record<string, unknown>): Promise<{ data: unknown }> => mockApiClient.put('/auth/profile', data),
};

// Mock 알림 API (서버에 알림 모듈이 없으므로 유지)
export const mockNotificationApi = {
  getNotifications: (page = 1, limit = 20): Promise<unknown> =>
    mockApiClient.getPaginated('/notifications', { page, limit }),
  markAsRead: (id: string): Promise<{ data: unknown }> => mockApiClient.put(`/notifications/${id}/read`),
  markAllAsRead: (): Promise<{ data: unknown }> => mockApiClient.put('/notifications/read-all'),
  getUnreadCount: (): Promise<{ data: unknown }> => mockApiClient.get('/notifications/unread-count'),
  updateSettings: (settings: Record<string, unknown>): Promise<{ data: unknown }> => mockApiClient.put('/notifications/settings', settings),
};