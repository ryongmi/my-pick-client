import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@/types';
import { authService } from '@/services';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// 로그아웃 비동기 액션
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '로그아웃에 실패했습니다.'
      );
    }
  }
);

// 사용자 정보 조회 비동기 액션
export const fetchUserProfile = createAsyncThunk(
  'auth/fetchUserProfile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getUserProfile();
      return user;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '사용자 정보를 불러올 수 없습니다.'
      );
    }
  }
);

// 앱 초기화 비동기 액션 (토큰 확인 및 사용자 정보 조회)
export const initializeAuth = createAsyncThunk(
  'auth/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const { user } = await authService.initialize();
      return { user };
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '초기화에 실패했습니다.'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 사용자 정보 설정
    setUser: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    // 사용자 정보 초기화 (로그아웃)
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    // 로딩 상태 설정
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // 에러 상태 설정
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // 초기화 완료 상태 설정
    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
  extraReducers: (builder) => {
    // 로그아웃
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // 로그아웃 실패해도 상태는 초기화
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // 사용자 프로필 조회
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });

    // 초기화
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
        state.error = null;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
