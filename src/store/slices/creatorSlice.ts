import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Creator, CreatorStats } from '@/types';
import { creatorService } from '@/services';

interface CreatorState {
  // 크리에이터 데이터
  creators: Creator[];
  featuredCreators: Creator[];

  // 현재 선택된 크리에이터
  selectedCreator: Creator | null;
  creatorStats: CreatorStats | null;

  // 페이지네이션
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };

  // 로딩 상태
  isLoading: boolean;
  isLoadingStats: boolean;
  isFollowing: boolean;
  isSyncing: boolean;

  // 에러 상태
  error: string | null;

  // 검색 및 필터
  searchQuery: string;
  platformFilter: string;
  sortBy: 'name' | 'followers' | 'content' | 'recent';

  // 무한 스크롤
  hasMore: boolean;
  isLoadingMore: boolean;
}

const initialState: CreatorState = {
  creators: [],
  featuredCreators: [],
  selectedCreator: null,
  creatorStats: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  isLoadingStats: false,
  isFollowing: false,
  isSyncing: false,
  error: null,
  searchQuery: '',
  platformFilter: 'all',
  sortBy: 'followers',
  hasMore: true,
  isLoadingMore: false,
};

// Async thunks
export const fetchCreators = createAsyncThunk(
  'creator/fetchCreators',
  async (params: {
    page?: number;
    limit?: number;
    name?: string;
    platform?: string;
    orderBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await creatorService.getCreators(params);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 조회에 실패했습니다.'
      );
    }
  }
);

export const fetchMoreCreators = createAsyncThunk(
  'creator/fetchMoreCreators',
  async (params: {
    page: number;
    limit?: number;
    name?: string;
    platform?: string;
    orderBy?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await creatorService.getCreators(params);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 추가 조회에 실패했습니다.'
      );
    }
  }
);

export const fetchCreatorById = createAsyncThunk(
  'creator/fetchCreatorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await creatorService.getCreator(id);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 상세 조회에 실패했습니다.'
      );
    }
  }
);

export const fetchCreatorStats = createAsyncThunk(
  'creator/fetchCreatorStats',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await creatorService.getCreatorStats(id);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 통계 조회에 실패했습니다.'
      );
    }
  }
);

export const followCreator = createAsyncThunk(
  'creator/followCreator',
  async (creator: Creator, { rejectWithValue }) => {
    try {
      await creatorService.followCreator(creator.id);
      return creator;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 구독에 실패했습니다.'
      );
    }
  }
);

export const unfollowCreator = createAsyncThunk(
  'creator/unfollowCreator',
  async (creatorId: string, { rejectWithValue }) => {
    try {
      await creatorService.unfollowCreator(creatorId);
      return creatorId;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 구독 취소에 실패했습니다.'
      );
    }
  }
);

export const addCreator = createAsyncThunk(
  'creator/addCreator',
  async (creatorData: unknown, { rejectWithValue }) => {
    try {
      const response = await creatorService.addCreator(creatorData as Record<string, unknown>);
      return response;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 추가에 실패했습니다.'
      );
    }
  }
);

export const syncCreator = createAsyncThunk(
  'creator/syncCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      await creatorService.syncCreator(id);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(
        error instanceof Error ? error.message : '크리에이터 동기화에 실패했습니다.'
      );
    }
  }
);

const creatorSlice = createSlice({
  name: 'creator',
  initialState,
  reducers: {
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },
    
    // 선택된 크리에이터 설정
    setSelectedCreator: (state, action: PayloadAction<Creator | null>) => {
      state.selectedCreator = action.payload;
    },
    
    // 검색 및 필터 설정
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setPlatformFilter: (state, action: PayloadAction<string>) => {
      state.platformFilter = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'name' | 'followers' | 'content' | 'recent'>) => {
      state.sortBy = action.payload;
    },
    
    // 페이지네이션 리셋
    resetPagination: (state) => {
      state.pagination.page = 1;
      state.hasMore = true;
    },

    // 크리에이터 데이터 업데이트
    updateCreator: (state, action: PayloadAction<{ id: string; updates: Partial<Creator> }>) => {
      const { id, updates } = action.payload;

      // creators 배열에서 업데이트
      const creatorIndex = state.creators.findIndex(c => c.id === id);
      if (creatorIndex !== -1) {
        const existingCreator = state.creators[creatorIndex];
        Object.keys(updates).forEach(key => {
          if (updates[key as keyof Creator] !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (existingCreator as any)[key] = updates[key as keyof Creator];
          }
        });
      }

      // selectedCreator 업데이트
      if (state.selectedCreator && state.selectedCreator.id === id) {
        Object.keys(updates).forEach(key => {
          if (updates[key as keyof Creator] !== undefined && state.selectedCreator) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (state.selectedCreator as any)[key] = updates[key as keyof Creator];
          }
        });
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch creators
    builder
      .addCase(fetchCreators.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreators.fulfilled, (state, action) => {
        state.isLoading = false;
        const payload = action.payload as {
          items?: Creator[];
          pageInfo?: {
            totalItems: number;
            page: number;
            limit: number;
            totalPages: number;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
          };
        };
        state.creators = payload.items || [];
        if (payload.pageInfo) {
          state.pagination = {
            page: payload.pageInfo.page,
            limit: payload.pageInfo.limit,
            total: payload.pageInfo.totalItems,
            totalPages: payload.pageInfo.totalPages,
            hasNext: payload.pageInfo.hasNextPage,
            hasPrev: payload.pageInfo.hasPreviousPage,
          };
          state.hasMore = payload.pageInfo.hasNextPage;
        }
      })
      .addCase(fetchCreators.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch more creators
    builder
      .addCase(fetchMoreCreators.pending, (state) => {
        state.isLoadingMore = true;
      })
      .addCase(fetchMoreCreators.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        const payload = action.payload as {
          items?: Creator[];
          pageInfo?: {
            totalItems: number;
            page: number;
            limit: number;
            totalPages: number;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
          };
        };
        state.creators = [...state.creators, ...(payload.items || [])];
        if (payload.pageInfo) {
          state.pagination = {
            page: payload.pageInfo.page,
            limit: payload.pageInfo.limit,
            total: payload.pageInfo.totalItems,
            totalPages: payload.pageInfo.totalPages,
            hasNext: payload.pageInfo.hasNextPage,
            hasPrev: payload.pageInfo.hasPreviousPage,
          };
          state.hasMore = payload.pageInfo.hasNextPage;
        }
      })
      .addCase(fetchMoreCreators.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      });

    // Fetch creator by ID
    builder
      .addCase(fetchCreatorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCreatorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCreator = (action.payload as Creator) || null;
      })
      .addCase(fetchCreatorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch creator stats
    builder
      .addCase(fetchCreatorStats.pending, (state) => {
        state.isLoadingStats = true;
      })
      .addCase(fetchCreatorStats.fulfilled, (state, action) => {
        state.isLoadingStats = false;
        state.creatorStats = (action.payload as CreatorStats) || null;
      })
      .addCase(fetchCreatorStats.rejected, (state, action) => {
        state.isLoadingStats = false;
        state.error = action.payload as string;
      });

    // Follow creator
    builder
      .addCase(followCreator.pending, (state) => {
        state.isFollowing = true;
      })
      .addCase(followCreator.fulfilled, (state, action) => {
        state.isFollowing = false;
        const creator = action.payload;

        // creators 목록에서 해당 크리에이터의 isSubscribed를 true로 업데이트
        const creatorIndex = state.creators.findIndex(c => c.id === creator.id);
        if (creatorIndex !== -1 && state.creators[creatorIndex]) {
          state.creators[creatorIndex]!.isSubscribed = true;
        } else {
          // 목록에 없으면 추가 (isSubscribed: true)
          state.creators.push({ ...creator, isSubscribed: true });
        }
      })
      .addCase(followCreator.rejected, (state, action) => {
        state.isFollowing = false;
        state.error = action.payload as string;
      });

    // Unfollow creator
    builder
      .addCase(unfollowCreator.pending, (state) => {
        state.isFollowing = true;
      })
      .addCase(unfollowCreator.fulfilled, (state, action) => {
        state.isFollowing = false;
        const creatorId = action.payload;

        // creators 목록에서 해당 크리에이터의 isSubscribed를 false로 업데이트
        const creatorIndex = state.creators.findIndex(c => c.id === creatorId);
        if (creatorIndex !== -1 && state.creators[creatorIndex]) {
          state.creators[creatorIndex]!.isSubscribed = false;
        }
      })
      .addCase(unfollowCreator.rejected, (state, action) => {
        state.isFollowing = false;
        state.error = action.payload as string;
      });

    // Add creator
    builder
      .addCase(addCreator.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCreator.fulfilled, (state, action) => {
        state.isLoading = false;
        const newCreator = action.payload as Creator;
        if (newCreator) {
          state.creators.unshift(newCreator);
        }
      })
      .addCase(addCreator.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sync creator
    builder
      .addCase(syncCreator.pending, (state) => {
        state.isSyncing = true;
      })
      .addCase(syncCreator.fulfilled, (state) => {
        state.isSyncing = false;
      })
      .addCase(syncCreator.rejected, (state, action) => {
        state.isSyncing = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setSelectedCreator,
  setSearchQuery,
  setPlatformFilter,
  setSortBy,
  resetPagination,
  updateCreator,
} = creatorSlice.actions;

export default creatorSlice.reducer;
