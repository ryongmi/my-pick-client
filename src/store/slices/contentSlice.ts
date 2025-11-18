import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Content, ContentFilter } from '@/types';
import { contentService } from '@/services';

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
    creatorIds: [],
    platforms: [],
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
    creatorIds?: string[];
    platforms?: string[];
    search?: string;
    sortBy?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await contentService.getContent(params);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchMoreContent = createAsyncThunk(
  'content/fetchMoreContent',
  async (params: {
    page: number;
    limit?: number;
    creatorIds?: string[];
    platforms?: string[];
    search?: string;
    sortBy?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await contentService.getContent(params);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchContentDetail = createAsyncThunk(
  'content/fetchContentDetail',
  async (contentId: string, { rejectWithValue }) => {
    try {
      const response = await contentService.getContentById(contentId);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠를 불러오는데 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookmarks = createAsyncThunk(
  'content/fetchBookmarks',
  async (params: {
    page?: number;
    limit?: number;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await contentService.getBookmarks(params.page, params.limit);
      return response;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const bookmarkContent = createAsyncThunk(
  'content/bookmarkContent',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentService.bookmarkContent(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'content/removeBookmark',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentService.removeBookmark(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const likeContent = createAsyncThunk(
  'content/likeContent',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentService.likeContent(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
    }
  }
);

export const unlikeContent = createAsyncThunk(
  'content/unlikeContent',
  async (id: string, { rejectWithValue }) => {
    try {
      await contentService.unlikeContent(id);
      return id;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "콘텐츠 작업에 실패했습니다.";
      return rejectWithValue(errorMessage);
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
        creatorIds: [],
        platforms: [],
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
        const payload = (action.payload as unknown) as {
          items?: unknown[];
          pageInfo?: {
            totalItems?: number;
            page?: number;
            limit?: number;
            totalPages?: number;
            hasPreviousPage?: boolean;
            hasNextPage?: boolean;
          };
        };

        // items를 contents로 매핑하고 viewCount 등 계산 필드 추가
        const contents = (payload.items as Content[]) || [];
        state.contents = contents.map(content => ({
          ...content,
          viewCount: content.statistics?.views || 0,
          likeCount: content.statistics?.likes || 0,
          commentCount: content.statistics?.comments || 0,
        }));

        state.pagination = {
          page: payload.pageInfo?.page || 1,
          limit: payload.pageInfo?.limit || 20,
          total: payload.pageInfo?.totalItems || 0,
          totalPages: payload.pageInfo?.totalPages || 0,
          hasNext: payload.pageInfo?.hasNextPage || false,
          hasPrev: payload.pageInfo?.hasPreviousPage || false
        };
        state.hasMore = payload.pageInfo?.hasNextPage || false;
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
          // bookmarkedContents 배열에도 추가 (중복 방지)
          const isAlreadyBookmarked = state.bookmarkedContents.some(c => c.id === contentId);
          if (!isAlreadyBookmarked) {
            state.bookmarkedContents.push(content);
          }
        }
      });

    // Remove bookmark
    builder
      .addCase(removeBookmark.fulfilled, (state, action) => {
        const contentId = action.payload;
        const content = state.contents.find(c => c.id === contentId);
        if (content) {
          content.isBookmarked = false;
          // bookmarkedContents 배열에서도 제거
          state.bookmarkedContents = state.bookmarkedContents.filter(c => c.id !== contentId);
        }
      });

    // Fetch more content (infinite scroll)
    builder
      .addCase(fetchMoreContent.pending, (state) => {
        state.isLoadingMore = true;
        state.error = null;
      })
      .addCase(fetchMoreContent.fulfilled, (state, action) => {
        state.isLoadingMore = false;
        const payload = (action.payload as unknown) as {
          items?: unknown[];
          pageInfo?: {
            totalItems?: number;
            page?: number;
            limit?: number;
            totalPages?: number;
            hasPreviousPage?: boolean;
            hasNextPage?: boolean;
          };
        };

        // items를 contents로 매핑하고 viewCount 등 계산 필드 추가
        const newContents = (payload.items as Content[]) || [];
        const mappedContents = newContents.map(content => ({
          ...content,
          viewCount: content.statistics?.views || 0,
          likeCount: content.statistics?.likes || 0,
          commentCount: content.statistics?.comments || 0,
        }));

        // 기존 콘텐츠에 새 콘텐츠 추가
        state.contents = [...state.contents, ...mappedContents];
        state.pagination = {
          page: payload.pageInfo?.page || state.pagination.page,
          limit: payload.pageInfo?.limit || state.pagination.limit,
          total: payload.pageInfo?.totalItems || state.pagination.total,
          totalPages: payload.pageInfo?.totalPages || state.pagination.totalPages,
          hasNext: payload.pageInfo?.hasNextPage || false,
          hasPrev: payload.pageInfo?.hasPreviousPage || false
        };
        state.hasMore = payload.pageInfo?.hasNextPage || false;
      })
      .addCase(fetchMoreContent.rejected, (state, action) => {
        state.isLoadingMore = false;
        state.error = action.payload as string;
      });

    // Fetch bookmarks
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.isLoadingBookmarks = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.isLoadingBookmarks = false;
        const payload = (action.payload as unknown) as {
          items?: unknown[];
          pageInfo?: {
            totalItems?: number;
            page?: number;
            limit?: number;
            totalPages?: number;
            hasPreviousPage?: boolean;
            hasNextPage?: boolean;
          };
        };

        // items를 bookmarkedContents로 매핑하고 viewCount 등 계산 필드 추가
        const bookmarks = (payload.items as Content[]) || [];
        state.bookmarkedContents = bookmarks.map(content => ({
          ...content,
          viewCount: content.statistics?.views || 0,
          likeCount: content.statistics?.likes || 0,
          commentCount: content.statistics?.comments || 0,
        }));

        state.bookmarkPagination = {
          page: payload.pageInfo?.page || state.bookmarkPagination.page,
          limit: payload.pageInfo?.limit || state.bookmarkPagination.limit,
          total: payload.pageInfo?.totalItems || state.bookmarkPagination.total,
          hasNext: payload.pageInfo?.hasNextPage || state.bookmarkPagination.hasNext
        };
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.isLoadingBookmarks = false;
        state.error = action.payload as string;
      })

    // Fetch content detail
    builder
      .addCase(fetchContentDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContentDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        const content = action.payload as Content;

        // selectedContent에 저장하고 계산 필드 추가
        state.selectedContent = {
          ...content,
          viewCount: content.statistics?.views || 0,
          likeCount: content.statistics?.likes || 0,
          commentCount: content.statistics?.comments || 0,
        };
      })
      .addCase(fetchContentDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.selectedContent = null;
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
