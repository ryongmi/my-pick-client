import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Content, ContentFilter } from '@/types';
// import { contentApi } from '@/lib/api';
import { mockContentApi } from '@/lib/mockApi';

interface ContentState {
  // 콘텐츠 데이터
  contents: Content[];
  bookmarkedContents: Content[];
  trendingContents: Content[];
  
  // 현재 선택된 콘텐츠
  selectedContent: Content | null;
  
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
  isBookmarking: boolean;
  isLiking: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 필터 및 검색
  filters: ContentFilter;
  
  // 무한 스크롤
  hasMore: boolean;
  isLoadingMore: boolean;
  
  // 북마크 관련
  bookmarkPagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
  isLoadingBookmarks: boolean;
}

const initialState: ContentState = {
  contents: [],
  bookmarkedContents: [],
  trendingContents: [],
  selectedContent: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
  isLoading: false,
  isBookmarking: false,
  isLiking: false,
  error: null,
  filters: {
    creators: ['all'],
    platforms: ['all'],
    sortBy: 'newest',
    searchQuery: '',
  },
  hasMore: true,
  isLoadingMore: false,
  bookmarkPagination: {
    page: 1,
    limit: 20,
    total: 0,
    hasNext: false,
  },
  isLoadingBookmarks: false,
};

// Async thunks
export const fetchContent = createAsyncThunk(
  'content/fetchContent',
  async (params: {
    page?: number;
    limit?: number;
    creators?: string[];
    platforms?: string[];
    search?: string;
    sortBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      // const response = await contentApi.getContent(params);
      const response = await mockContentApi.getContent(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMoreContent = createAsyncThunk(
  'content/fetchMoreContent',
  async (params: {
    page: number;
    limit?: number;
    creators?: string[];
    platforms?: string[];
    search?: string;
    sortBy?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await contentApi.getContent(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const bookmarkContent = createAsyncThunk(
  'content/bookmarkContent',
  async (id: string, { rejectWithValue }) => {
    try {
      // await contentApi.bookmarkContent(id);
      await mockContentApi.bookmarkContent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'content/removeBookmark',
  async (id: string, { rejectWithValue }) => {
    try {
      // await contentApi.removeBookmark(id);
      await mockContentApi.removeBookmark(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const likeContent = createAsyncThunk(
  'content/likeContent',
  async (id: string, { rejectWithValue }) => {
    try {
      // await contentApi.likeContent(id);
      await mockContentApi.likeContent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const unlikeContent = createAsyncThunk(
  'content/unlikeContent',
  async (id: string, { rejectWithValue }) => {
    try {
      // await contentApi.unlikeContent(id);
      await mockContentApi.unlikeContent(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedContent: (state, action: PayloadAction<Content | null>) => {
      state.selectedContent = action.payload;
    },
    setContentFilters: (state, action: PayloadAction<Partial<ContentFilter>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        creators: ['all'],
        platforms: ['all'],
        sortBy: 'newest',
        searchQuery: '',
      };
    },
    toggleBookmarkOptimistic: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      const content = state.contents.find(c => c.id === contentId);
      
      if (content) {
        content.isBookmarked = !content.isBookmarked;
      }
    },
    toggleLikeOptimistic: (state, action: PayloadAction<string>) => {
      const contentId = action.payload;
      const content = state.contents.find(c => c.id === contentId);
      
      if (content) {
        content.isLiked = !content.isLiked;
        if (content.isLiked) {
          content.likeCount = (content.likeCount || 0) + 1;
        } else {
          content.likeCount = Math.max(0, (content.likeCount || 0) - 1);
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch content
    builder
      .addCase(fetchContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contents = action.payload.data;
        state.pagination = action.payload.pagination;
        state.hasMore = action.payload.pagination.hasNext;
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Bookmark content
    builder
      .addCase(bookmarkContent.fulfilled, (state, action) => {
        const contentId = action.payload;
        const content = state.contents.find(c => c.id === contentId);
        if (content) {
          content.isBookmarked = true;
        }
      });

    // Remove bookmark
    builder
      .addCase(removeBookmark.fulfilled, (state, action) => {
        const contentId = action.payload;
        const content = state.contents.find(c => c.id === contentId);
        if (content) {
          content.isBookmarked = false;
        }
      });
  },
});

export const {
  clearError,
  setSelectedContent,
  setContentFilters,
  clearFilters,
  toggleBookmarkOptimistic,
  toggleLikeOptimistic,
} = contentSlice.actions;

export default contentSlice.reducer;
