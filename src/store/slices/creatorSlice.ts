import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Creator, CreatorStats } from '@/types';
import { creatorApi } from '@/lib/api';

interface CreatorState {
  // 크리에이터 데이터
  creators: Creator[];
  followedCreators: Creator[];
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
  followedCreators: [],
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
    search?: string;
    platform?: string;
    sortBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await creatorApi.getCreators(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoreCreators = createAsyncThunk(
  'creator/fetchMoreCreators',
  async (params: {
    page: number;
    limit?: number;
    search?: string;
    platform?: string;
    sortBy?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await creatorApi.getCreators(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCreatorById = createAsyncThunk(
  'creator/fetchCreatorById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await creatorApi.getCreator(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCreatorStats = createAsyncThunk(
  'creator/fetchCreatorStats',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await creatorApi.getCreatorStats(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const followCreator = createAsyncThunk(
  'creator/followCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      await creatorApi.followCreator(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowCreator = createAsyncThunk(
  'creator/unfollowCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      await creatorApi.unfollowCreator(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const addCreator = createAsyncThunk(
  'creator/addCreator',
  async (creatorData: any, { rejectWithValue }) => {
    try {
      const response = await creatorApi.addCreator(creatorData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncCreator = createAsyncThunk(
  'creator/syncCreator',
  async (id: string, { rejectWithValue }) => {
    try {
      await creatorApi.syncCreator(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
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
    
    // 팔로우된 크리에이터 업데이트
    updateFollowedCreators: (state, action: PayloadAction<Creator[]>) => {
      state.followedCreators = action.payload;
    },
    
    // 크리에이터 데이터 업데이트
    updateCreator: (state, action: PayloadAction<{ id: string; updates: Partial<Creator> }>) => {
      const { id, updates } = action.payload;
      
      // creators 배열에서 업데이트
      const creatorIndex = state.creators.findIndex(c => c.id === id);
      if (creatorIndex !== -1) {
        state.creators[creatorIndex] = { ...state.creators[creatorIndex], ...updates };
      }
      
      // followedCreators 배열에서 업데이트
      const followedIndex = state.followedCreators.findIndex(c => c.id === id);
      if (followedIndex !== -1) {
        state.followedCreators[followedIndex] = { ...state.followedCreators[followedIndex], ...updates };
      }
      
      // selectedCreator 업데이트
      if (state.selectedCreator && state.selectedCreator.id === id) {
        state.selectedCreator = { ...state.selectedCreator, ...updates };
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
        state.creators = action.payload.data;
        state.pagination = action.payload.pagination;
        state.hasMore = action.payload.pagination.hasNext;
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
        state.creators = [...state.creators, ...action.payload.data];
        state.pagination = action.payload.pagination;
        state.hasMore = action.payload.pagination.hasNext;
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
        state.selectedCreator = action.payload;
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
        state.creatorStats = action.payload;
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
        const creatorId = action.payload;
        
        // 팔로우된 크리에이터 목록에 추가
        const creator = state.creators.find(c => c.id === creatorId);
        if (creator && !state.followedCreators.find(c => c.id === creatorId)) {
          state.followedCreators.push(creator);
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
        
        // 팔로우된 크리에이터 목록에서 제거
        state.followedCreators = state.followedCreators.filter(c => c.id !== creatorId);
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
        state.creators.unshift(action.payload);
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
  updateFollowedCreators,
  updateCreator,
} = creatorSlice.actions;

export default creatorSlice.reducer;
