import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
// 실제 API 대신 Mock API 사용
// import { authApi } from '@/lib/api';
import { mockAuthApi } from '@/lib/mockApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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
      console.log('=== loginUser thunk start ===');
      console.log('Credentials:', credentials);
      
      // 실제 API 호출 대신 Mock API 사용
      // const response = await authApi.login(credentials);
      const response = await mockAuthApi.login(credentials);
      
      console.log('Mock API response:', response);
      console.log('Response data:', response.data);
      
      const result = { ...response.data, rememberMe: credentials.rememberMe };
      console.log('Final thunk result:', result);
      
      return result;
    } catch (error: any) {
      console.error('Login error in thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // const response = await authApi.register(userData);
      const response = await mockAuthApi.register(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // await authApi.logout();
      await mockAuthApi.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      // const response = await authApi.refreshToken();
      const response = await mockAuthApi.refreshToken();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue }) => {
    try {
      // const response = await authApi.updateProfile(profileData);
      const response = await mockAuthApi.updateProfile(profileData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
      console.log('Clearing credentials...');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      console.log('Credentials cleared, user:', state.user);
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
        console.log('=== loginUser.fulfilled ===');
        console.log('Action payload:', action.payload);
        console.log('Action payload data:', action.payload.data);
        
        state.isLoading = false;
        
        // response.data.data 구조 확인
        const userData = action.payload.data || action.payload;
        console.log('User data to store:', userData);
        
        state.user = userData.user;
        state.token = userData.token;
        state.isAuthenticated = true;
        state.rememberMe = action.payload.rememberMe;
        state.error = null;
        
        console.log('Updated state user:', state.user);
        console.log('Updated state token:', state.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload.token;
          state.user = action.payload.user;
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
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCredentials, clearCredentials, setRememberMe } = authSlice.actions;
export default authSlice.reducer;
