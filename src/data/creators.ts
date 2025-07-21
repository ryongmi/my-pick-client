import { Creator, Platform } from '@/types';

// 고정된 날짜를 사용하여 데이터 변경을 방지
const MOCK_DATE = '2024-01-15T10:30:00Z';
const MOCK_UPDATE_DATE = '2024-01-16T15:45:00Z';

export const mockCreators: Creator[] = [
  {
    id: 'ado',
    name: 'ado1024imokenp',
    displayName: 'Ado',
    avatar: '',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCk-jAsf5tReUfEqPLCzB3gA',
        username: 'Ado1024',
        url: 'https://youtube.com/@Ado1024',
        isActive: true,
        followerCount: 3200000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'ado1024imokenp',
        username: 'ado1024imokenp',
        url: 'https://twitter.com/ado1024imokenp',
        isActive: true,
        followerCount: 1800000,
        lastSync: MOCK_DATE,
      },
    ],
    description: '日本のシンガーソングライター。様々な楽曲を歌います。',
    isVerified: true,
    followerCount: 5000000,
    contentCount: 234,
    totalViews: 150000000,
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'hikakin',
    name: 'hikakin',
    displayName: '히카킨',
    avatar: '',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCZf__ehlCEBPop-_sldpBUQ',
        username: 'HikakinTV',
        url: 'https://youtube.com/@HikakinTV',
        isActive: true,
        followerCount: 11000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'hikakin',
        username: 'hikakin',
        url: 'https://twitter.com/hikakin',
        isActive: true,
        followerCount: 4500000,
        lastSync: MOCK_DATE,
      },
    ],
    description: '日本最大級のYouTuber！エンターテイメント動画をお届け！',
    isVerified: true,
    followerCount: 15500000,
    contentCount: 5670,
    totalViews: 8500000000,
    createdAt: '2022-05-20T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'kuzuha',
    name: 'kuzuha',
    displayName: '葛葉',
    avatar: '',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCSFCh5NL4qXrAy9u-u2lX3g',
        username: '葛葉',
        url: 'https://youtube.com/@kuzuha',
        isActive: true,
        followerCount: 2100000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'Kuzuha_Channel',
        username: 'Kuzuha_Channel',
        url: 'https://twitter.com/Kuzuha_Channel',
        isActive: true,
        followerCount: 950000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'にじさんじ所属のバーチャルライバー。ゲーム実況や雑談配信を行っています。',
    isVerified: true,
    followerCount: 3050000,
    contentCount: 1890,
    totalViews: 650000000,
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
];

// 팔로우/언팔로우 시뮬레이션
export const mockFollowedCreators: Set<string> = new Set(['ado', 'hikakin']);

export const mockGetCreators = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
  sortBy?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  let filteredCreators = [...mockCreators];
  
  // 검색 필터
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredCreators = filteredCreators.filter(creator =>
      creator.displayName.toLowerCase().includes(searchTerm) ||
      creator.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // 플랫폼 필터
  if (params?.platform && params.platform !== 'all') {
    filteredCreators = filteredCreators.filter(creator =>
      creator.platforms.some(platform => platform.type === params.platform)
    );
  }
  
  // 정렬
  if (params?.sortBy) {
    switch (params.sortBy) {
      case 'followers':
        filteredCreators.sort((a, b) => b.followerCount - a.followerCount);
        break;
      case 'content':
        filteredCreators.sort((a, b) => b.contentCount - a.contentCount);
        break;
      case 'name':
        filteredCreators.sort((a, b) => a.displayName.localeCompare(b.displayName));
        break;
      case 'recent':
        filteredCreators.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
    }
  }
  
  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCreators = filteredCreators.slice(startIndex, endIndex);
  
  return {
    data: paginatedCreators,
    pagination: {
      page,
      limit,
      total: filteredCreators.length,
      totalPages: Math.ceil(filteredCreators.length / limit),
      hasNext: endIndex < filteredCreators.length,
      hasPrev: page > 1,
    },
  };
};

export const mockGetCreator = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const creator = mockCreators.find(c => c.id === id);
  if (!creator) {
    throw new Error('크리에이터를 찾을 수 없습니다.');
  }
  
  return creator;
};

export const mockFollowCreator = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const creator = mockCreators.find(c => c.id === id);
  if (!creator) {
    throw new Error('크리에이터를 찾을 수 없습니다.');
  }
  
  mockFollowedCreators.add(id);
  return { success: true };
};

export const mockUnfollowCreator = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const creator = mockCreators.find(c => c.id === id);
  if (!creator) {
    throw new Error('크리에이터를 찾을 수 없습니다.');
  }
  
  mockFollowedCreators.delete(id);
  return { success: true };
};

export const mockGetFollowedCreators = () => {
  return mockCreators.filter(creator => mockFollowedCreators.has(creator.id));
};
