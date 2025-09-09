import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// 비디오 상세 정보 타입
export interface VideoDetail {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  platform: 'youtube' | 'twitter';
  creator: {
    id: string;
    name: string;
    displayName: string;
    avatar: string;
    subscriberCount: number;
    verified: boolean;
  };
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration: string;
  tags: string[];
  category: string;
  isBookmarked: boolean;
  isLiked: boolean;
  originalUrl: string;
}

// 관련 비디오 타입
export interface RelatedVideo {
  id: string;
  title: string;
  thumbnail: string;
  creator: {
    id: string;
    displayName: string;
  };
  viewCount: number;
  duration: string;
  publishedAt: string;
  platform: 'youtube' | 'twitter';
}

// 슬라이스 상태 타입
interface VideoDetailState {
  // 현재 비디오 정보
  currentVideo: VideoDetail | null;
  relatedVideos: RelatedVideo[];
  
  // 로딩 상태
  isLoading: boolean;
  isLoadingRelated: boolean;
  
  // 에러 상태
  error: string | null;
  
  // 플레이어 상태
  isPlaying: boolean;
  currentTime: number;
  
  // UI 상태
  showDescription: boolean;
}

const initialState: VideoDetailState = {
  currentVideo: null,
  relatedVideos: [],
  isLoading: false,
  isLoadingRelated: false,
  error: null,
  isPlaying: false,
  currentTime: 0,
  showDescription: false,
};

// Mock API 함수들
const mockVideoDetailApi = {
  async getVideoDetail(videoId: string): Promise<VideoDetail> {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockData: { [key: string]: VideoDetail } = {
      '1': {
        id: '1',
        title: '【歌ってみた】새로운 커버곡 / Ado',
        description: '오늘은 특별한 커버곡을 준비했어요! 많은 분들이 요청해주신 곡인데요...',
        thumbnail: '',
        platform: 'youtube',
        creator: {
          id: 'ado',
          name: 'Ado',
          displayName: 'Ado',
          avatar: '',
          subscriberCount: 7200000,
          verified: true,
        },
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        viewCount: 520000,
        likeCount: 45000,
        commentCount: 3200,
        duration: '15:23',
        tags: ['음악', 'Cover', 'J-Pop', 'Ado'],
        category: '음악',
        isBookmarked: false,
        isLiked: false,
        originalUrl: 'https://youtube.com/watch?v=example1',
      },
      '2': {
        id: '2',
        title: '【검증】1000만원의 〇〇 사봤다!',
        description: '안녕하세요! 히카킨입니다! 오늘은 무려 1000만원의...',
        thumbnail: '',
        platform: 'youtube',
        creator: {
          id: 'hikakin',
          name: '히카킨',
          displayName: '히카킨',
          avatar: '',
          subscriberCount: 5400000,
          verified: true,
        },
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        viewCount: 1200000,
        likeCount: 89000,
        commentCount: 5600,
        duration: '8:45',
        tags: ['검증', '리뷰', '언박싱', '고급'],
        category: '엔터테인먼트',
        isBookmarked: false,
        isLiked: false,
        originalUrl: 'https://youtube.com/watch?v=example2',
      },
    };
    
    const video = mockData[videoId];
    if (!video) {
      throw new Error('비디오를 찾을 수 없습니다.');
    }
    
    return video;
  },

  async getRelatedVideos(videoId: string): Promise<RelatedVideo[]> {
    // 실제로는 API 호출
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockRelatedVideos: RelatedVideo[] = [
      {
        id: '3',
        title: '【Live】특별 라이브 방송! 새로운 곡 공개',
        thumbnail: '',
        creator: { id: 'ado', displayName: 'Ado' },
        viewCount: 340000,
        duration: '45:12',
        publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        platform: 'youtube',
      },
      {
        id: '4',
        title: '【Q&A】팬들의 질문에 답해드려요!',
        thumbnail: '',
        creator: { id: 'ado', displayName: 'Ado' },
        viewCount: 680000,
        duration: '23:45',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        platform: 'youtube',
      },
      {
        id: '5',
        title: '【Vlog】스튜디오에서의 하루',
        thumbnail: '',
        creator: { id: 'hikakin', displayName: '히카킨' },
        viewCount: 920000,
        duration: '12:30',
        publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        platform: 'youtube',
      },
    ];
    
    return mockRelatedVideos.filter(video => video.id !== videoId);
  },

  async toggleBookmark(_videoId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() > 0.5; // Mock 결과
  },

  async toggleLike(_videoId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return Math.random() > 0.5; // Mock 결과
  },
};

// 비동기 액션: 비디오 상세 정보 가져오기
export const fetchVideoDetail = createAsyncThunk(
  'videoDetail/fetchDetail',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const video = await mockVideoDetailApi.getVideoDetail(videoId);
      return video;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || '비디오 정보를 가져오는데 실패했습니다.');
    }
  }
);

// 비동기 액션: 관련 비디오 가져오기
export const fetchRelatedVideos = createAsyncThunk(
  'videoDetail/fetchRelated',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const videos = await mockVideoDetailApi.getRelatedVideos(videoId);
      return videos;
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || '관련 비디오를 가져오는데 실패했습니다.');
    }
  }
);

// 비동기 액션: 북마크 토글
export const toggleVideoBookmark = createAsyncThunk(
  'videoDetail/toggleBookmark',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const isBookmarked = await mockVideoDetailApi.toggleBookmark(videoId);
      return { videoId, isBookmarked };
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || '북마크 처리에 실패했습니다.');
    }
  }
);

// 비동기 액션: 좋아요 토글
export const toggleVideoLike = createAsyncThunk(
  'videoDetail/toggleLike',
  async (videoId: string, { rejectWithValue }) => {
    try {
      const isLiked = await mockVideoDetailApi.toggleLike(videoId);
      return { videoId, isLiked };
    } catch (error: unknown) {
      return rejectWithValue((error as Error).message || '좋아요 처리에 실패했습니다.');
    }
  }
);

const videoDetailSlice = createSlice({
  name: 'videoDetail',
  initialState,
  reducers: {
    // 플레이어 상태 관리
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    
    // UI 상태 관리
    toggleDescription: (state) => {
      state.showDescription = !state.showDescription;
    },
    
    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },
    
    // 상태 리셋
    resetVideoDetail: (state) => {
      state.currentVideo = null;
      state.relatedVideos = [];
      state.error = null;
      state.isPlaying = false;
      state.currentTime = 0;
      state.showDescription = false;
    },
  },
  extraReducers: (builder) => {
    // 비디오 상세 정보 가져오기
    builder
      .addCase(fetchVideoDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchVideoDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentVideo = action.payload;
      })
      .addCase(fetchVideoDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // 관련 비디오 가져오기
    builder
      .addCase(fetchRelatedVideos.pending, (state) => {
        state.isLoadingRelated = true;
      })
      .addCase(fetchRelatedVideos.fulfilled, (state, action) => {
        state.isLoadingRelated = false;
        state.relatedVideos = action.payload;
      })
      .addCase(fetchRelatedVideos.rejected, (state, _action) => {
        state.isLoadingRelated = false;
      });

    // 북마크 토글
    builder
      .addCase(toggleVideoBookmark.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.isBookmarked = action.payload.isBookmarked;
        }
      });

    // 좋아요 토글
    builder
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        if (state.currentVideo) {
          state.currentVideo.isLiked = action.payload.isLiked;
        }
      });
  },
});

export const {
  setIsPlaying,
  setCurrentTime,
  toggleDescription,
  clearError,
  resetVideoDetail,
} = videoDetailSlice.actions;

export default videoDetailSlice.reducer;