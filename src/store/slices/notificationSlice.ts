import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '@/types';
import { notificationApi } from '@/lib/api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // 페이지네이션
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  
  // 로딩 상태
  isLoading: boolean;
  isMarking: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 설정
  settings: {
    email: boolean;
    push: boolean;
    newContent: boolean;
    weekly: boolean;
  };
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false,
  },
  isLoading: false,
  isMarking: false,
  error: null,
  settings: {
    email: true,
    push: true,
    newContent: true,
    weekly: true,
  },
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getNotifications(params.page, params.limit);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.data.count;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      await notificationApi.markAsRead(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotificationSettings = createAsyncThunk(
  'notification/updateSettings',
  async (settings: any, { rejectWithValue }) => {
    try {
      await notificationApi.updateSettings(settings);
      return settings;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },
    
    // 새 알림 추가 (실시간)
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount++;
      }
    },
    
    // 알림 읽음 표시 (낙관적 업데이트)
    markAsReadOptimistic: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // 모든 알림 읽음 표시 (낙관적 업데이트)
    markAllAsReadOptimistic: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    
    // 알림 제거
    removeNotification: (state, action: PayloadAction<string>) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload);
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(notificationIndex, 1);
      }
    },
    
    // 읽지 않은 개수 설정
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    
    // 알림 설정 업데이트 (로컬)
    updateSettings: (state, action: PayloadAction<Partial<NotificationState['settings']>>) => {
      state.settings = { ...state.settings, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    // Fetch notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.data;
        state.pagination = action.payload.pagination;
        // 읽지 않은 알림 개수 계산
        state.unreadCount = action.payload.data.filter((n: Notification) => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch unread count
    builder
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });

    // Mark as read
    builder
      .addCase(markAsRead.pending, (state) => {
        state.isMarking = true;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.isMarking = false;
        const notificationId = action.payload;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAsRead.rejected, (state, action) => {
        state.isMarking = false;
        state.error = action.payload as string;
        // 낙관적 업데이트 롤백
        const notificationId = action.meta.arg;
        const notification = state.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = false;
          state.unreadCount++;
        }
      });

    // Mark all as read
    builder
      .addCase(markAllAsRead.pending, (state) => {
        state.isMarking = true;
      })
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.isMarking = false;
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      .addCase(markAllAsRead.rejected, (state, action) => {
        state.isMarking = false;
        state.error = action.payload as string;
      });

    // Update notification settings
    builder
      .addCase(updateNotificationSettings.fulfilled, (state, action) => {
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateNotificationSettings.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  addNotification,
  markAsReadOptimistic,
  markAllAsReadOptimistic,
  removeNotification,
  setUnreadCount,
  updateSettings,
} = notificationSlice.actions;

export default notificationSlice.reducer;
