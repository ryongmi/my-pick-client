import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types';

interface UIState {
  // 사이드바 및 네비게이션
  sidebarOpen: boolean;
  
  // 모달 및 드롭다운
  activeModal: string | null;
  dropdowns: {
    dashboard: boolean;
    notification: boolean;
    profile: boolean;
  };
  
  // 로딩 상태
  loading: boolean;
  globalLoading: boolean;
  
  // 알림
  notifications: Notification[];
  unreadCount: number;

  // 설정
  language: string;

  // 필터 상태
  filters: {
    selectedCreators: string[];
    selectedPlatforms: string[];
    sortBy: 'newest' | 'oldest' | 'popular' | 'trending';
    searchQuery: string;
  };
  
  // 모바일 반응형
  isMobile: boolean;
  
  // 에러 상태
  errors: {
    message: string;
    type: 'error' | 'warning' | 'info' | 'success';
    id: string;
  }[];
}

const initialState: UIState = {
  sidebarOpen: true,
  activeModal: null,
  dropdowns: {
    dashboard: false,
    notification: false,
    profile: false,
  },
  loading: false,
  globalLoading: false,
  notifications: [],
  unreadCount: 0,
  language: 'ko',
  filters: {
    selectedCreators: ['all'],
    selectedPlatforms: ['all'],
    sortBy: 'newest',
    searchQuery: '',
  },
  isMobile: false,
  errors: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // 사이드바 토글
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // 모달 관리
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    
    // 드롭다운 관리
    toggleDropdown: (state, action: PayloadAction<keyof UIState['dropdowns']>) => {
      const dropdown = action.payload;
      // 다른 드롭다운들은 모두 닫고 현재 것만 토글
      Object.keys(state.dropdowns).forEach(key => {
        if (key === dropdown) {
          state.dropdowns[key] = !state.dropdowns[key];
        } else {
          state.dropdowns[key as keyof UIState['dropdowns']] = false;
        }
      });
    },
    closeAllDropdowns: (state) => {
      state.dropdowns = {
        dashboard: false,
        notification: false,
        profile: false,
      };
    },
    
    // 로딩 상태
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    // 알림 관리
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount++;
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
    },
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },

    // 설정
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },

    // 필터 관리
    setCreatorFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedCreators = action.payload;
    },
    setPlatformFilter: (state, action: PayloadAction<string[]>) => {
      state.filters.selectedPlatforms = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'newest' | 'oldest' | 'popular' | 'trending'>) => {
      state.filters.sortBy = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        selectedCreators: ['all'],
        selectedPlatforms: ['all'],
        sortBy: 'newest',
        searchQuery: '',
      };
    },
    
    // 모바일 상태
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
      // 모바일에서는 사이드바 기본적으로 닫기
      if (action.payload) {
        state.sidebarOpen = false;
      }
    },
    
    // 에러 관리
    addError: (state, action: PayloadAction<{ message: string; type: 'error' | 'warning' | 'info' | 'success' }>) => {
      const error = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.errors.push(error);
    },
    removeError: (state, action: PayloadAction<string>) => {
      state.errors = state.errors.filter(error => error.id !== action.payload);
    },
    clearAllErrors: (state) => {
      state.errors = [];
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  openModal,
  closeModal,
  toggleDropdown,
  closeAllDropdowns,
  setLoading,
  setGlobalLoading,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  setNotifications,
  setUnreadCount,
  setLanguage,
  setCreatorFilter,
  setPlatformFilter,
  setSortBy,
  setSearchQuery,
  clearFilters,
  setIsMobile,
  addError,
  removeError,
  clearAllErrors,
} = uiSlice.actions;

export default uiSlice.reducer;
