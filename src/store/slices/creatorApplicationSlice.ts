import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CreatorApplication } from '@/types/userManagement';
import { mockCreatorApplicationApi } from '@/lib/mockApi';

// 신청 데이터 타입
export interface CreatorApplicationFormData {
  channelName: string;
  channelId: string;
  channelUrl: string;
  subscriberCount: number;
  contentCategories: string[];
  description: string;
  businessEmail?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  sampleVideos: string[];
}

// 슬라이스 상태 타입
interface CreatorApplicationState {
  // 현재 사용자의 신청 상태
  currentApplication: CreatorApplication | null;
  applicationStatus: 'none' | 'pending' | 'approved' | 'rejected';
  
  // UI 상태
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // 모달 상태
  isApplicationModalOpen: boolean;
  isStatusModalOpen: boolean;
}

const initialState: CreatorApplicationState = {
  currentApplication: null,
  applicationStatus: 'none',
  isLoading: false,
  isSubmitting: false,
  error: null,
  isApplicationModalOpen: false,
  isStatusModalOpen: false,
};

// 비동기 액션: 크리에이터 신청 제출
export const submitCreatorApplication = createAsyncThunk(
  'creatorApplication/submit',
  async (formData: CreatorApplicationFormData, { rejectWithValue }) => {
    try {
      const response = await mockCreatorApplicationApi.submitApplication(formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '신청 제출에 실패했습니다.');
    }
  }
);

// 비동기 액션: 신청 상태 조회
export const fetchApplicationStatus = createAsyncThunk(
  'creatorApplication/fetchStatus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockCreatorApplicationApi.getApplicationStatus();
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '신청 상태 조회에 실패했습니다.');
    }
  }
);

// 비동기 액션: 재신청
export const resubmitCreatorApplication = createAsyncThunk(
  'creatorApplication/resubmit',
  async (formData: CreatorApplicationFormData, { rejectWithValue }) => {
    try {
      const response = await mockCreatorApplicationApi.resubmitApplication(formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '재신청에 실패했습니다.');
    }
  }
);

const creatorApplicationSlice = createSlice({
  name: 'creatorApplication',
  initialState,
  reducers: {
    // 모달 상태 관리
    openApplicationModal: (state) => {
      state.isApplicationModalOpen = true;
      state.error = null;
    },
    closeApplicationModal: (state) => {
      state.isApplicationModalOpen = false;
      state.error = null;
    },
    openStatusModal: (state) => {
      state.isStatusModalOpen = true;
      state.error = null;
    },
    closeStatusModal: (state) => {
      state.isStatusModalOpen = false;
      state.error = null;
    },
    
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },
    
    // 신청 상태 리셋 (로그아웃 시 등)
    resetApplicationState: (state) => {
      state.currentApplication = null;
      state.applicationStatus = 'none';
      state.error = null;
      state.isApplicationModalOpen = false;
      state.isStatusModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    // 신청 제출
    builder
      .addCase(submitCreatorApplication.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitCreatorApplication.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentApplication = action.payload;
        state.applicationStatus = 'pending';
        state.isApplicationModalOpen = false;
      })
      .addCase(submitCreatorApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
    
    // 상태 조회
    builder
      .addCase(fetchApplicationStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchApplicationStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.currentApplication = action.payload;
          state.applicationStatus = action.payload.status as any;
        } else {
          state.currentApplication = null;
          state.applicationStatus = 'none';
        }
      })
      .addCase(fetchApplicationStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
    
    // 재신청
    builder
      .addCase(resubmitCreatorApplication.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(resubmitCreatorApplication.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.currentApplication = action.payload;
        state.applicationStatus = 'pending';
        state.isApplicationModalOpen = false;
      })
      .addCase(resubmitCreatorApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  openApplicationModal,
  closeApplicationModal,
  openStatusModal,
  closeStatusModal,
  clearError,
  resetApplicationState,
} = creatorApplicationSlice.actions;

export default creatorApplicationSlice.reducer;