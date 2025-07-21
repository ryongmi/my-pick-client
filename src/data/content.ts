import { Content, YouTubeVideo, TwitterPost } from '@/types';
import { mockCreators } from './creators';

export const mockContents: Content[] = [
  // Ado YouTube 콘텐츠
  {
    id: '1',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【歌ってみた】新曲カバー / Ado',
    description: '今回は皆さんからリクエストの多かった楽曲をカバーさせていただきました！楽しんでいただけると嬉しいです♪',
    thumbnail: '',
    url: 'https://youtube.com/watch?v=example1',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
    viewCount: 520000,
    likeCount: 45000,
    commentCount: 3200,
    duration: '15:23',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['歌ってみた', 'cover', 'Ado'],
      category: 'Music',
      language: 'ja',
    },
  },
  {
    id: '2',
    creator: mockCreators[0], // Ado
    platform: 'youtube',
    title: '【MV】新曲「夜想曲」/ Ado',
    description: '新曲「夜想曲」のミュージックビデオです。作詞作曲：〇〇さん、イラスト：△△さん',
    thumbnail: '',
    url: 'https://youtube.com/watch?v=example2',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    viewCount: 1200000,
    likeCount: 89000,
    commentCount: 5600,
    duration: '4:32',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['MV', 'オリジナル曲', 'Ado'],
      category: 'Music',
      language: 'ja',
    },
  },
  
  // Ado Twitter 콘텐츠
  {
    id: '3',
    creator: mockCreators[0], // Ado
    platform: 'twitter',
    title: '今日はレコーディングでした！新しい曲もうすぐ完成します🎵楽しみにしていてください✨',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/ado1024imokenp/status/example1',
    publishedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30분 전
    viewCount: 0,
    likeCount: 5800,
    commentCount: 234,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: [],
      mentions: [],
    },
  },
  {
    id: '4',
    creator: mockCreators[0], // Ado
    platform: 'twitter',
    title: 'ありがとうございます！😊\n皆さんの応援が本当に嬉しいです💖\n次回作も頑張ります！',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/ado1024imokenp/status/example2',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    viewCount: 0,
    likeCount: 12500,
    commentCount: 892,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: [],
      mentions: [],
    },
  },
  
  // 히카킨 YouTube 콘텐츠
  {
    id: '5',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【検証】1000万円の○○買ってみた！',
    description: 'みなさんこんにちは！ヒカキンです！今回はなんと1000万円もする超高級○○を買ってみました！果たしてその価値はあるのか...!?',
    thumbnail: '',
    url: 'https://youtube.com/watch?v=example3',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5시간 전
    viewCount: 1200000,
    likeCount: 89000,
    commentCount: 12000,
    duration: '8:45',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ヒカキン', '検証', '高級'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  {
    id: '6',
    creator: mockCreators[1], // 히카킨
    platform: 'youtube',
    title: '【開封】視聴者プレゼント開封！感動の連続...',
    description: '今回は視聴者の皆さんからいただいたプレゼントを開封していきます！本当にありがとうございます😭',
    thumbnail: '',
    url: 'https://youtube.com/watch?v=example4',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
    viewCount: 980000,
    likeCount: 67000,
    commentCount: 8900,
    duration: '12:15',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['ヒカキン', 'プレゼント開封', '感謝'],
      category: 'Entertainment',
      language: 'ja',
    },
  },
  
  // 히카킨 Twitter 콘텐츠
  {
    id: '7',
    creator: mockCreators[1], // 히카킨
    platform: 'twitter',
    title: '今日も撮影頑張りました！\n明日の動画お楽しみに〜😊\n#ヒカキン #YouTube',
    description: '',
    thumbnail: '',
    url: 'https://twitter.com/hikakin/status/example1',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
    viewCount: 0,
    likeCount: 8900,
    commentCount: 567,
    isBookmarked: false,
    isLiked: false,
    metadata: {
      hashtags: ['ヒカキン', 'YouTube'],
      mentions: [],
    },
  },
  
  // 葛葉 콘텐츠
  {
    id: '8',
    creator: mockCreators[2], // 葛葉
    platform: 'youtube',
    title: '【APEX】ランク上げ配信！マスター目指します',
    description: 'おつかれさまです！今日もAPEXランク配信やっていきます〜目標はマスターです！',
    thumbnail: '',
    url: 'https://youtube.com/watch?v=example5',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4시간 전
    viewCount: 450000,
    likeCount: 23000,
    commentCount: 5600,
    duration: '3:45:12',
    isBookmarked: false,
    isLiked: false,
    metadata: {
      tags: ['APEX', 'ゲーム実況', '葛葉'],
      category: 'Gaming',
      language: 'ja',
      isLive: false,
    },
  },
];

// 북마크/좋아요 상태 관리
export const mockBookmarkedContent: Set<string> = new Set();
export const mockLikedContent: Set<string> = new Set();

export const mockGetContent = async (params?: {
  page?: number;
  limit?: number;
  creators?: string[];
  platforms?: string[];
  search?: string;
  sortBy?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredContent = [...mockContents];
  
  // 크리에이터 필터
  if (params?.creators && !params.creators.includes('all')) {
    filteredContent = filteredContent.filter(content =>
      params.creators!.includes(content.creator.id)
    );
  }
  
  // 플랫폼 필터
  if (params?.platforms && !params.platforms.includes('all')) {
    filteredContent = filteredContent.filter(content =>
      params.platforms!.includes(content.platform)
    );
  }
  
  // 검색 필터
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredContent = filteredContent.filter(content =>
      content.title.toLowerCase().includes(searchTerm) ||
      content.description?.toLowerCase().includes(searchTerm) ||
      content.creator.displayName.toLowerCase().includes(searchTerm)
    );
  }
  
  // 정렬
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'newest':
        filteredContent.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'oldest':
        filteredContent.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'popular':
        filteredContent.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0));
        break;
      case 'trending':
        filteredContent.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
        break;
    }
  }
  
  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedContent = filteredContent.slice(startIndex, endIndex);
  
  // 북마크/좋아요 상태 적용
  paginatedContent.forEach(content => {
    content.isBookmarked = mockBookmarkedContent.has(content.id);
    content.isLiked = mockLikedContent.has(content.id);
  });
  
  return {
    data: paginatedContent,
    pagination: {
      page,
      limit,
      total: filteredContent.length,
      totalPages: Math.ceil(filteredContent.length / limit),
      hasNext: endIndex < filteredContent.length,
      hasPrev: page > 1,
    },
  };
};

export const mockBookmarkContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockBookmarkedContent.add(id);
  return { success: true };
};

export const mockRemoveBookmark = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  mockBookmarkedContent.delete(id);
  return { success: true };
};

export const mockLikeContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockLikedContent.add(id);
  // 좋아요 수 증가
  content.likeCount = (content.likeCount || 0) + 1;
  return { success: true };
};

export const mockUnlikeContent = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const content = mockContents.find(c => c.id === id);
  if (!content) {
    throw new Error('콘텐츠를 찾을 수 없습니다.');
  }
  
  mockLikedContent.delete(id);
  // 좋아요 수 감소
  content.likeCount = Math.max(0, (content.likeCount || 0) - 1);
  return { success: true };
};

export const mockGetBookmarks = async (page = 1, limit = 20) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const bookmarkedContents = mockContents.filter(content => 
    mockBookmarkedContent.has(content.id)
  );
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedBookmarks = bookmarkedContents.slice(startIndex, endIndex);
  
  return {
    data: paginatedBookmarks,
    pagination: {
      page,
      limit,
      total: bookmarkedContents.length,
      totalPages: Math.ceil(bookmarkedContents.length / limit),
      hasNext: endIndex < bookmarkedContents.length,
      hasPrev: page > 1,
    },
  };
};
