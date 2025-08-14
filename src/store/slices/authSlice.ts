import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
// HttpClient 기반 API 사용
import { authApi, errorUtils, tokenManager } from '@/lib/api';

interface AuthError {
  message: string;
  code?: string;
  isAuthError?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  rememberMe: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  rememberMe: false,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string; rememberMe: boolean }, { rejectWithValue }) => {
    try {
      // HttpClient를 통한 API 호출
      const response = await authApi.login(credentials);
      
      // 토큰 매니저에 토큰 설정
      const responseData = response.data as any;
      if (responseData?.token) {
        tokenManager.setAuthToken(responseData.token);
      }
      
      // 서버 응답 처리 (krgeobuk 서버 표준 형식)
      const result = { 
        ...response.data, 
        rememberMe: credentials.rememberMe 
      };
      
      return result;
    } catch (error: any) {
      // krgeobuk 서버 에러 처리
      const errorMessage = errorUtils.getUserMessage(error);
      const errorCode = errorUtils.getErrorCode(error);
      
      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        isAuthError: errorUtils.isAuthError(error)
      });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      
      // 토큰 매니저에 토큰 설정
      const responseData = response.data as any;
      if (responseData?.token) {
        tokenManager.setAuthToken(responseData.token);
      }
      
      return response.data;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error);
      const errorCode = errorUtils.getErrorCode(error);
      
      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        isAuthError: errorUtils.isAuthError(error)
      });
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      // 토큰 매니저에서 토큰 제거
      tokenManager.clearAuthToken();
      
      return;
    } catch (error: any) {
      // 로그아웃 실패해도 로컬 토큰은 제거
      tokenManager.clearAuthToken();
      
      const errorMessage = errorUtils.getUserMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.refreshToken();
      
      // 토큰 매니저에 새 토큰 설정
      if (response.data?.accessToken) {
        tokenManager.setAuthToken(response.data.accessToken);
      }
      
      return response.data;
    } catch (error: any) {
      // 리프레시 실패 시 모든 토큰 제거
      tokenManager.clearAuthToken();
      
      const errorMessage = errorUtils.getUserMessage(error);
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(profileData);
      return response.data;
    } catch (error: any) {
      const errorMessage = errorUtils.getUserMessage(error);
      const errorCode = errorUtils.getErrorCode(error);
      
      return rejectWithValue({
        message: errorMessage,
        code: errorCode,
        isAuthError: errorUtils.isAuthError(error)
      });
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // 토큰 매니저에서도 토큰 제거
      tokenManager.clearAuthToken();
    },
    setRememberMe: (state, action: PayloadAction<boolean>) => {
      state.rememberMe = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // 서버 응답 데이터 처리
        const responseData = action.payload as any;
        
        state.user = responseData.user;
        state.token = responseData.token;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const registerData = action.payload as any;
        state.user = registerData.user;
        state.token = registerData.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        // 로그아웃 실패해도 상태는 초기화
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = { message: action.payload as string };
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          const refreshData = action.payload as any;
          state.token = refreshData.token || refreshData.accessToken;
          if (refreshData.user) {
            state.user = refreshData.user;
          }
          state.isAuthenticated = true;
        }
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user = { ...state.user, ...action.payload };
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, setRememberMe } = authSlice.actions;
export default authSlice.reducer;
