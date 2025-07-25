import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { DashboardStats, User, Creator } from '@/types';
// import { adminApi } from '@/lib/api';
import { mockAdminApi } from '@/lib/mockApi';

interface AdminState {
  // 대시보드 통계
  dashboardStats: DashboardStats | null;
  
  // 사용자 관리
  users: User[];
  usersPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  selectedUser: User | null;
  
  // 크리에이터 관리
  adminCreators: Creator[];
  creatorsPagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  pendingCreators: Creator[];
  
  // 로딩 상태
  isLoadingStats: boolean;
  isLoadingUsers: boolean;
  isLoadingCreators: boolean;
  isProcessing: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 필터
  userFilters: {
    search: string;
    role: string;
    status: string;
  };
  creatorFilters: {
    search: string;
    platform: string;
    status: string;
  };
  
  // 현재 관리자 페이지
  currentAdminPage: 'dashboard' | 'users' | 'creators' | 'platforms' | 'content' | 'api' | 'analytics' | 'settings';
}

const initialState: AdminState = {
  dashboardStats: null,
  users: [],
  usersPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  selectedUser: null,
  adminCreators: [],
  creatorsPagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  pendingCreators: [],
  isLoadingStats: false,
  isLoadingUsers: false,
  isLoadingCreators: false,
  isProcessing: false,
  error: null,
  userFilters: {
    search: '',
    role: 'all',
    status: 'all',
  },
  creatorFilters: {
    search: '',
    platform: 'all',
    status: 'all',
  },
  currentAdminPage: 'dashboard',
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await adminApi.getDashboardStats();
      const response = await mockAdminApi.getDashboardStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  } = {}, { rejectWithValue }) => {
    try {
      // const response = await adminApi.getUsers(params);
      const response = await mockAdminApi.getUsers(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveCreator = createAsyncThunk(
  'admin/approveCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      // await adminApi.approveCreator(id);
      await mockAdminApi.approveCreator(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const rejectCreator = createAsyncThunk(
  'admin/rejectCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      // await adminApi.rejectCreator(id);
      await mockAdminApi.rejectCreator(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentAdminPage: (state, action: PayloadAction<AdminState['currentAdminPage']>) => {
      state.currentAdminPage = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    setUserFilters: (state, action: PayloadAction<Partial<AdminState['userFilters']>>) => {
      state.userFilters = { ...state.userFilters, ...action.payload };
    },
    setCreatorFilters: (state, action: PayloadAction<Partial<AdminState['creatorFilters']>>) => {
      state.creatorFilters = { ...state.creatorFilters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.isLoadingStats = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload.data;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentAdminPage,
  setSelectedUser,
  setUserFilters,
  setCreatorFilters,
} = adminSlice.actions;

export default adminSlice.reducer;
