import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';
import { creatorDashboardService } from '@/services/creatorDashboardService';
import { creatorPlatformService } from '@/services/creatorPlatformService';
import type {
  CreatorDashboardState,
  ContentStatus,
  ContentFilters,
  CreatorPlatform,
  CreatePlatformRequest,
  UpdatePlatformRequest,
} from '@/types/creatorDashboard';
import { LimitType } from '@/types/creatorDashboard';

// ==================== INITIAL STATE ====================

const initialFilters: ContentFilters = {
  platform: 'all',
  status: 'all',
  searchQuery: '',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
};

const initialState: CreatorDashboardState = {
  myCreatorInfo: null,
  contents: [],
  totalContents: 0,
  totalPages: 0,
  isLoadingContents: false,
  contentsError: null,
  stats: null,
  isLoadingStats: false,
  statsError: null,
  platforms: [],
  isLoadingPlatforms: false,
  platformsError: null,
  isAddPlatformModalOpen: false,
  isEditPlatformModalOpen: false,
  editingPlatform: null,
  filters: initialFilters,
  selectedContentIds: [],
  isLoading: false,
  error: null,
  page: 1,
  limit: LimitType.THIRTY,
  hasMore: true,
};

// ==================== ASYNC THUNKS ====================

/**
 * 크리에이터 정보 및 통계 조회
 */
export const fetchCreatorDashboard = createAsyncThunk(
  'creatorDashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await creatorDashboardService.getMyDashboardStats();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '대시보드 정보를 불러오는데 실패했습니다.'
      );
    }
  }
);

/**
 * 크리에이터 본인 콘텐츠 목록 조회
 */
export const fetchMyContents = createAsyncThunk(
  'creatorDashboard/fetchMyContents',
  async (
    params: {
      creatorId: string;
      page?: number;
      limit?: number;
      platform?: string;
      sortBy?: string;
      sortOrder?: 'ASC' | 'DESC';
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await creatorDashboardService.getMyContents(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '콘텐츠 목록을 불러오는데 실패했습니다.'
      );
    }
  }
);

/**
 * 콘텐츠 상태 변경
 */
export const updateContentStatus = createAsyncThunk(
  'creatorDashboard/updateStatus',
  async (
    { contentId, status }: { contentId: string; status: ContentStatus },
    { rejectWithValue }
  ) => {
    try {
      await creatorDashboardService.updateContentStatus(contentId, status);
      return { contentId, status };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '콘텐츠 상태 변경에 실패했습니다.'
      );
    }
  }
);

/**
 * 콘텐츠 삭제
 */
export const deleteContent = createAsyncThunk(
  'creatorDashboard/deleteContent',
  async (contentId: string, { rejectWithValue }) => {
    try {
      await creatorDashboardService.deleteContent(contentId);
      return contentId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '콘텐츠 삭제에 실패했습니다.'
      );
    }
  }
);

/**
 * 콘텐츠 일괄 상태 변경
 */
export const bulkUpdateContentStatus = createAsyncThunk(
  'creatorDashboard/bulkUpdateStatus',
  async (
    { contentIds, status }: { contentIds: string[]; status: ContentStatus },
    { rejectWithValue }
  ) => {
    try {
      await creatorDashboardService.bulkUpdateContentStatus(contentIds, status);
      return { contentIds, status };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '일괄 상태 변경에 실패했습니다.'
      );
    }
  }
);

/**
 * 플랫폼 목록 조회
 */
export const fetchMyPlatforms = createAsyncThunk(
  'creatorDashboard/fetchMyPlatforms',
  async (_, { rejectWithValue }) => {
    try {
      const platforms = await creatorPlatformService.getMyPlatforms();
      return platforms;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '플랫폼 목록을 불러오는데 실패했습니다.'
      );
    }
  }
);

/**
 * 플랫폼 추가
 */
export const addPlatform = createAsyncThunk(
  'creatorDashboard/addPlatform',
  async (data: CreatePlatformRequest, { rejectWithValue, dispatch }) => {
    try {
      await creatorPlatformService.addPlatform(data);
      // 플랫폼 목록 다시 조회
      await dispatch(fetchMyPlatforms());
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '플랫폼 추가에 실패했습니다.'
      );
    }
  }
);

/**
 * 플랫폼 수정
 */
export const updatePlatform = createAsyncThunk(
  'creatorDashboard/updatePlatform',
  async (
    { platformId, data }: { platformId: string; data: UpdatePlatformRequest },
    { rejectWithValue, dispatch }
  ) => {
    try {
      await creatorPlatformService.updatePlatform(platformId, data);
      // 플랫폼 목록 다시 조회
      await dispatch(fetchMyPlatforms());
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '플랫폼 수정에 실패했습니다.'
      );
    }
  }
);

/**
 * 플랫폼 삭제
 */
export const deletePlatform = createAsyncThunk(
  'creatorDashboard/deletePlatform',
  async (platformId: string, { rejectWithValue, dispatch }) => {
    try {
      await creatorPlatformService.deletePlatform(platformId);
      // 플랫폼 목록 다시 조회
      await dispatch(fetchMyPlatforms());
      return;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : '플랫폼 삭제에 실패했습니다.'
      );
    }
  }
);

// ==================== SLICE ====================

const creatorDashboardSlice = createSlice({
  name: 'creatorDashboard',
  initialState,
  reducers: {
    // 필터 변경
    setFilters: (state, action: PayloadAction<Partial<ContentFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1; // 필터 변경 시 페이지 초기화
    },

    // 필터 초기화
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.page = 1;
    },

    // limit 변경
    setLimit: (state, action: PayloadAction<LimitType>) => {
      state.limit = action.payload;
      state.page = 1; // limit 변경 시 페이지 초기화
    },

    // 콘텐츠 선택 토글
    toggleContentSelection: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      const index = state.selectedContentIds.indexOf(contentId);

      if (index > -1) {
        state.selectedContentIds.splice(index, 1);
      } else {
        state.selectedContentIds.push(contentId);
      }
    },

    // 전체 선택/해제
    toggleAllContentSelection: (state) => {
      if (state.selectedContentIds.length === state.contents.length) {
        state.selectedContentIds = [];
      } else {
        state.selectedContentIds = state.contents.map((c) => c.id);
      }
    },

    // 선택 초기화
    clearSelection: (state) => {
      state.selectedContentIds = [];
    },

    // 페이지 변경
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },

    // 에러 초기화
    clearError: (state) => {
      state.error = null;
      state.contentsError = null;
      state.statsError = null;
      state.platformsError = null;
    },

    // 플랫폼 모달 관리
    openAddPlatformModal: (state) => {
      state.isAddPlatformModalOpen = true;
    },

    closeAddPlatformModal: (state) => {
      state.isAddPlatformModalOpen = false;
    },

    openEditPlatformModal: (state, action: PayloadAction<CreatorPlatform>) => {
      state.isEditPlatformModalOpen = true;
      state.editingPlatform = action.payload;
    },

    closeEditPlatformModal: (state) => {
      state.isEditPlatformModalOpen = false;
      state.editingPlatform = null;
    },
  },
  extraReducers: (builder) => {
    // ==================== fetchCreatorDashboard ====================
    builder
      .addCase(fetchCreatorDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreatorDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myCreatorInfo = action.payload.creator;
        state.stats = action.payload.stats;
      })
      .addCase(fetchCreatorDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ==================== fetchMyContents ====================
    builder
      .addCase(fetchMyContents.pending, (state) => {
        state.isLoadingContents = true;
        state.contentsError = null;
      })
      .addCase(fetchMyContents.fulfilled, (state, action) => {
        state.isLoadingContents = false;
        state.contents = action.payload.items;
        state.totalContents = action.payload.pageInfo.totalItems;
        state.totalPages = action.payload.pageInfo.totalPages;
        state.hasMore = action.payload.pageInfo.page < action.payload.pageInfo.totalPages;
      })
      .addCase(fetchMyContents.rejected, (state, action) => {
        state.isLoadingContents = false;
        state.contentsError = action.payload as string;
      });

    // ==================== updateContentStatus ====================
    builder
      .addCase(updateContentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateContentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // 로컬 상태 업데이트 (낙관적 업데이트)
        const content = state.contents.find((c) => c.id === action.payload.contentId);
        if (content) {
          content.status = action.payload.status;
        }
      })
      .addCase(updateContentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ==================== deleteContent ====================
    builder
      .addCase(deleteContent.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.isLoading = false;
        // 삭제된 콘텐츠 제거
        state.contents = state.contents.filter((c) => c.id !== action.payload);
        state.totalContents -= 1;
        // 선택 목록에서도 제거
        state.selectedContentIds = state.selectedContentIds.filter((id) => id !== action.payload);
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ==================== bulkUpdateContentStatus ====================
    builder
      .addCase(bulkUpdateContentStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bulkUpdateContentStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        // 일괄 상태 업데이트
        const { contentIds, status } = action.payload;
        contentIds.forEach((contentId) => {
          const content = state.contents.find((c) => c.id === contentId);
          if (content) {
            content.status = status;
          }
        });
        // 선택 초기화
        state.selectedContentIds = [];
      })
      .addCase(bulkUpdateContentStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ==================== fetchMyPlatforms ====================
    builder
      .addCase(fetchMyPlatforms.pending, (state) => {
        state.isLoadingPlatforms = true;
        state.platformsError = null;
      })
      .addCase(fetchMyPlatforms.fulfilled, (state, action) => {
        state.isLoadingPlatforms = false;
        state.platforms = action.payload;
      })
      .addCase(fetchMyPlatforms.rejected, (state, action) => {
        state.isLoadingPlatforms = false;
        state.platformsError = action.payload as string;
      });

    // ==================== addPlatform ====================
    builder
      .addCase(addPlatform.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addPlatform.fulfilled, (state) => {
        state.isLoading = false;
        state.isAddPlatformModalOpen = false;
      })
      .addCase(addPlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.platformsError = action.payload as string;
      });

    // ==================== updatePlatform ====================
    builder
      .addCase(updatePlatform.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePlatform.fulfilled, (state) => {
        state.isLoading = false;
        state.isEditPlatformModalOpen = false;
        state.editingPlatform = null;
      })
      .addCase(updatePlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.platformsError = action.payload as string;
      });

    // ==================== deletePlatform ====================
    builder
      .addCase(deletePlatform.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletePlatform.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(deletePlatform.rejected, (state, action) => {
        state.isLoading = false;
        state.platformsError = action.payload as string;
      });
  },
});

// ==================== ACTIONS ====================
export const {
  setFilters,
  resetFilters,
  setLimit,
  toggleContentSelection,
  toggleAllContentSelection,
  clearSelection,
  setPage,
  clearError,
  openAddPlatformModal,
  closeAddPlatformModal,
  openEditPlatformModal,
  closeEditPlatformModal,
} = creatorDashboardSlice.actions;

// ==================== SELECTORS ====================
export const selectCreatorDashboard = (state: RootState) => state.creatorDashboard;
export const selectMyCreatorInfo = (state: RootState) => state.creatorDashboard.myCreatorInfo;
export const selectDashboardStats = (state: RootState) => state.creatorDashboard.stats;
export const selectMyContents = (state: RootState) => state.creatorDashboard.contents;
export const selectFilters = (state: RootState) => state.creatorDashboard.filters;
export const selectSelectedContentIds = (state: RootState) =>
  state.creatorDashboard.selectedContentIds;
export const selectIsLoading = (state: RootState) => state.creatorDashboard.isLoading;

// Platform selectors
export const selectMyPlatforms = (state: RootState) => state.creatorDashboard.platforms;
export const selectIsLoadingPlatforms = (state: RootState) =>
  state.creatorDashboard.isLoadingPlatforms;
export const selectPlatformsError = (state: RootState) => state.creatorDashboard.platformsError;
export const selectIsAddPlatformModalOpen = (state: RootState) =>
  state.creatorDashboard.isAddPlatformModalOpen;
export const selectIsEditPlatformModalOpen = (state: RootState) =>
  state.creatorDashboard.isEditPlatformModalOpen;
export const selectEditingPlatform = (state: RootState) => state.creatorDashboard.editingPlatform;

export default creatorDashboardSlice.reducer;
