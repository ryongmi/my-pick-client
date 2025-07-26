import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, PaginatedResponse } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 요청 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          this.removeToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') {return null;}
    return localStorage.getItem('authToken');
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') {return;}
    localStorage.setItem('authToken', token);
  }

  private removeToken(): void {
    if (typeof window === 'undefined') {return;}
    localStorage.removeItem('authToken');
  }

  // 기본 HTTP 메서드
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.post(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.put(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.delete(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getPaginated<T>(
    url: string,
    params?: Record<string, any>
  ): Promise<PaginatedResponse<T>> {
    try {
      const response = await this.client.get(url, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      const message = error.response.data?.message || error.response.statusText || '서버 오류가 발생했습니다.';
      return new Error(message);
    } else if (error.request) {
      return new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
    } else {
      return new Error(error.message || '알 수 없는 오류가 발생했습니다.');
    }
  }

  setAuthToken(token: string): void {
    this.setToken(token);
  }

  clearAuthToken(): void {
    this.removeToken();
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const apiClient = new ApiClient();

// API 엔드포인트별 함수들
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    apiClient.post('/auth/login', credentials),
  
  register: (data: { name: string; email: string; password: string }) =>
    apiClient.post('/auth/register', data),
  
  logout: () => apiClient.post('/auth/logout'),
  
  refreshToken: () => apiClient.post('/auth/refresh'),
  
  updateProfile: (data: any) => apiClient.put('/auth/profile', data),
};

export const userApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data: any) => apiClient.put('/users/profile', data),
  getSettings: () => apiClient.get('/users/settings'),
  updateSettings: (settings: any) => apiClient.put('/users/settings', settings),
};

export const creatorApi = {
  getCreators: (params?: any) => apiClient.getPaginated('/creators', params),
  getCreator: (id: string) => apiClient.get(`/creators/${id}`),
  followCreator: (id: string) => apiClient.post(`/creators/${id}/follow`),
  unfollowCreator: (id: string) => apiClient.delete(`/creators/${id}/follow`),
  addCreator: (data: any) => apiClient.post('/creators', data),
  updateCreator: (id: string, data: any) => apiClient.put(`/creators/${id}`, data),
  deleteCreator: (id: string) => apiClient.delete(`/creators/${id}`),
  getCreatorStats: (id: string) => apiClient.get(`/creators/${id}/stats`),
  syncCreator: (id: string) => apiClient.post(`/creators/${id}/sync`),
};

export const contentApi = {
  getContent: (params?: any) => apiClient.getPaginated('/content', params),
  getContentById: (id: string) => apiClient.get(`/content/${id}`),
  bookmarkContent: (id: string) => apiClient.post(`/content/${id}/bookmark`),
  removeBookmark: (id: string) => apiClient.delete(`/content/${id}/bookmark`),
  likeContent: (id: string) => apiClient.post(`/content/${id}/like`),
  unlikeContent: (id: string) => apiClient.delete(`/content/${id}/like`),
  getBookmarks: (page = 1, limit = 20) =>
    apiClient.getPaginated('/content/bookmarks', { page, limit }),
  searchContent: (query: string, filters?: any) =>
    apiClient.get('/content/search', { params: { q: query, ...filters } }),
};

export const notificationApi = {
  getNotifications: (page = 1, limit = 20) =>
    apiClient.getPaginated('/notifications', { page, limit }),
  markAsRead: (id: string) => apiClient.put(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.put('/notifications/read-all'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  updateSettings: (settings: any) => apiClient.put('/notifications/settings', settings),
};

export const adminApi = {
  getDashboardStats: () => apiClient.get('/admin/dashboard'),
  getUsers: (params?: any) => apiClient.getPaginated('/admin/users', params),
  getUser: (id: string) => apiClient.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) => apiClient.put(`/admin/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/admin/users/${id}`),
  getCreators: (params?: any) => apiClient.getPaginated('/admin/creators', params),
  approveCreator: (id: string) => apiClient.post(`/admin/creators/${id}/approve`),
  rejectCreator: (id: string) => apiClient.post(`/admin/creators/${id}/reject`),
};
