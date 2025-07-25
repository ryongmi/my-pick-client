import { Creator, Platform } from '@/types';

// 고정된 날짜를 사용하여 데이터 변경을 방지
const MOCK_DATE = '2024-01-15T10:30:00Z';
const MOCK_UPDATE_DATE = '2024-01-16T15:45:00Z';

export const mockCreators: Creator[] = [
  {
    id: 'ado',
    name: 'ado1024imokenp',
    displayName: 'Ado',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c79d7a3c?w=150&h=150&fit=crop&crop=face',
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
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
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
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
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
  {
    id: 'mrbeast',
    name: 'mrbeast',
    displayName: 'MrBeast',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCX6OQ3DkcsbYNE6H8uQQuVA',
        username: 'MrBeast',
        url: 'https://youtube.com/@MrBeast',
        isActive: true,
        followerCount: 250000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'MrBeast',
        username: 'MrBeast',
        url: 'https://twitter.com/MrBeast',
        isActive: true,
        followerCount: 20000000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'The biggest YouTuber! Philanthropist, entrepreneur and content creator.',
    isVerified: true,
    followerCount: 270000000,
    contentCount: 450,
    totalViews: 35000000000,
    createdAt: '2020-01-01T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'pewdiepie',
    name: 'pewdiepie',
    displayName: 'PewDiePie',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
        username: 'PewDiePie',
        url: 'https://youtube.com/@PewDiePie',
        isActive: true,
        followerCount: 111000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'pewdiepie',
        username: 'pewdiepie',
        url: 'https://twitter.com/pewdiepie',
        isActive: true,
        followerCount: 21500000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Swedish YouTuber, gamer, and content creator. Known for gaming videos and commentary.',
    isVerified: true,
    followerCount: 132500000,
    contentCount: 8900,
    totalViews: 29000000000,
    createdAt: '2010-04-29T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'marques',
    name: 'mkbhd',
    displayName: 'Marques Brownlee',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCBJycsmduvYEL83R_U4JriQ',
        username: 'MKBHD',
        url: 'https://youtube.com/@MKBHD',
        isActive: true,
        followerCount: 18500000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'MKBHD',
        username: 'MKBHD',
        url: 'https://twitter.com/MKBHD',
        isActive: true,
        followerCount: 3800000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Tech reviewer and automotive enthusiast. Clean crisp tech videos!',
    isVerified: true,
    followerCount: 22300000,
    contentCount: 1250,
    totalViews: 3200000000,
    createdAt: '2009-03-21T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'emma',
    name: 'emmachamberlain',
    displayName: 'Emma Chamberlain',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCsc8vNz8Hkgg23mA4ehtnYQ',
        username: 'emmachamberlain',
        url: 'https://youtube.com/@emmachamberlain',
        isActive: true,
        followerCount: 11800000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'emmachamberlain',
        username: 'emmachamberlain',
        url: 'https://twitter.com/emmachamberlain',
        isActive: true,
        followerCount: 1200000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Lifestyle content creator, entrepreneur, and podcast host.',
    isVerified: true,
    followerCount: 13000000,
    contentCount: 890,
    totalViews: 1800000000,
    createdAt: '2017-06-02T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'dude_perfect',
    name: 'dudeperfect',
    displayName: 'Dude Perfect',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCRijo3ddMTht_IHyNSNXpNQ',
        username: 'DudePerfect',
        url: 'https://youtube.com/@DudePerfect',
        isActive: true,
        followerCount: 59000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'dudeperfect',
        username: 'dudeperfect',
        url: 'https://twitter.com/dudeperfect',
        isActive: true,
        followerCount: 1800000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Sports and entertainment group known for trick shots and comedy videos.',
    isVerified: true,
    followerCount: 60800000,
    contentCount: 320,
    totalViews: 14500000000,
    createdAt: '2009-03-16T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'ninja',
    name: 'ninja',
    displayName: 'Ninja',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCAW-NpUFkMyCNrvRSSGIvDQ',
        username: 'NinjashyperOfficial',
        url: 'https://youtube.com/@NinjashyperOfficial',
        isActive: true,
        followerCount: 24000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'ninja',
        username: 'ninja',
        url: 'https://twitter.com/ninja',
        isActive: true,
        followerCount: 6800000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Professional gamer and streamer. Fortnite, gaming content, and entertainment.',
    isVerified: true,
    followerCount: 30800000,
    contentCount: 2100,
    totalViews: 2600000000,
    createdAt: '2011-01-22T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'veritasium',
    name: 'veritasium',
    displayName: 'Veritasium',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCHnyfMqiRRG1u-2MsSQLbXA',
        username: 'veritasium',
        url: 'https://youtube.com/@veritasium',
        isActive: true,
        followerCount: 14500000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'veritasium',
        username: 'veritasium',
        url: 'https://twitter.com/veritasium',
        isActive: true,
        followerCount: 850000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Engineering and science educator. Making science accessible and fun!',
    isVerified: true,
    followerCount: 15350000,
    contentCount: 450,
    totalViews: 2100000000,
    createdAt: '2010-07-21T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'gordon_ramsay',
    name: 'gordonramsay',
    displayName: 'Gordon Ramsay',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCIEv3lZ_tNXHzL3ox-_uUGQ',
        username: 'GordonRamsay',
        url: 'https://youtube.com/@GordonRamsay',
        isActive: true,
        followerCount: 22000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'GordonRamsay',
        username: 'GordonRamsay',
        url: 'https://twitter.com/GordonRamsay',
        isActive: true,
        followerCount: 7800000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'World-renowned chef, restaurateur, and television personality.',
    isVerified: true,
    followerCount: 29800000,
    contentCount: 1890,
    totalViews: 4500000000,
    createdAt: '2006-09-29T00:00:00Z',
    updatedAt: MOCK_UPDATE_DATE,
  },
  {
    id: 'kurzgesagt',
    name: 'kurzgesagt',
    displayName: 'Kurzgesagt',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UCsXVk37bltHxD1rDPwtNM8Q',
        username: 'kurzgesagt',
        url: 'https://youtube.com/@kurzgesagt',
        isActive: true,
        followerCount: 21000000,
        lastSync: MOCK_DATE,
      },
      {
        type: 'twitter',
        platformId: 'Kurz_Gesagt',
        username: 'Kurz_Gesagt',
        url: 'https://twitter.com/Kurz_Gesagt',
        isActive: true,
        followerCount: 890000,
        lastSync: MOCK_DATE,
      },
    ],
    description: 'Science and philosophy videos with beautiful animations. In a Nutshell.',
    isVerified: true,
    followerCount: 21890000,
    contentCount: 210,
    totalViews: 2800000000,
    createdAt: '2013-07-09T00:00:00Z',
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
