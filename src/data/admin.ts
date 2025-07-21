import { DashboardStats, User, Creator } from '@/types';
import { mockUsers } from './users';
import { mockCreators } from './creators';

export const mockDashboardStats: DashboardStats = {
  totalUsers: 12345,
  totalCreators: 487,
  totalContent: 1892,
  apiUsage: 89,
  userGrowth: 12,
  creatorGrowth: 8,
  contentGrowth: 23,
};

export const mockAdminUsers: User[] = [
  ...mockUsers,
  {
    id: '4',
    name: '이영희',
    email: 'yhlee@example.com',
    avatar: '',
    role: 'premium',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-03-10T00:00:00Z',
  },
  {
    id: '5',
    name: '박민수',
    email: 'mspark@example.com',
    avatar: '',
    role: 'user',
    createdAt: '2024-03-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

export const mockPendingCreators: Creator[] = [
  {
    id: 'pending1',
    name: 'newcreator',
    displayName: 'NewCreator',
    avatar: '',
    platforms: [
      {
        type: 'youtube',
        platformId: 'UC_pending1',
        username: 'NewCreator',
        url: 'https://youtube.com/@NewCreator',
        isActive: false,
        followerCount: 50000,
      },
    ],
    description: '새로운 크리에이터입니다. 승인을 기다리고 있습니다.',
    isVerified: false,
    followerCount: 50000,
    contentCount: 25,
    totalViews: 2500000,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: 'pending2',
    name: 'another_creator',
    displayName: 'Another Creator',
    avatar: '',
    platforms: [
      {
        type: 'twitter',
        platformId: 'another_creator',
        username: 'another_creator',
        url: 'https://twitter.com/another_creator',
        isActive: false,
        followerCount: 30000,
      },
    ],
    description: 'Twitter 중심의 크리에이터입니다.',
    isVerified: false,
    followerCount: 30000,
    contentCount: 150,
    totalViews: 1200000,
    createdAt: '2024-03-14T00:00:00Z',
    updatedAt: '2024-03-14T00:00:00Z',
  },
];

export const mockGetDashboardStats = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return mockDashboardStats;
};

export const mockGetAdminUsers = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredUsers = [...mockAdminUsers];
  
  // 검색 필터
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    filteredUsers = filteredUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
  }
  
  // 역할 필터
  if (params?.role && params.role !== 'all') {
    filteredUsers = filteredUsers.filter(user => user.role === params.role);
  }
  
  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  
  return {
    data: paginatedUsers,
    pagination: {
      page,
      limit,
      total: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / limit),
      hasNext: endIndex < filteredUsers.length,
      hasPrev: page > 1,
    },
  };
};

export const mockGetAdminCreators = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  platform?: string;
  status?: string;
}) => {
  await new Promise(resolve => setTimeout(resolve, 700));
  
  let allCreators = [...mockCreators, ...mockPendingCreators];
  
  // 검색 필터
  if (params?.search) {
    const searchTerm = params.search.toLowerCase();
    allCreators = allCreators.filter(creator =>
      creator.displayName.toLowerCase().includes(searchTerm) ||
      creator.name.toLowerCase().includes(searchTerm)
    );
  }
  
  // 플랫폼 필터
  if (params?.platform && params.platform !== 'all') {
    allCreators = allCreators.filter(creator =>
      creator.platforms.some(platform => platform.type === params.platform)
    );
  }
  
  // 상태 필터
  if (params?.status && params.status !== 'all') {
    if (params.status === 'verified') {
      allCreators = allCreators.filter(creator => creator.isVerified);
    } else if (params.status === 'pending') {
      allCreators = allCreators.filter(creator => !creator.isVerified);
    }
  }
  
  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCreators = allCreators.slice(startIndex, endIndex);
  
  return {
    data: paginatedCreators,
    pagination: {
      page,
      limit,
      total: allCreators.length,
      totalPages: Math.ceil(allCreators.length / limit),
      hasNext: endIndex < allCreators.length,
      hasPrev: page > 1,
    },
  };
};

export const mockApproveCreator = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const creatorIndex = mockPendingCreators.findIndex(c => c.id === id);
  if (creatorIndex === -1) {
    throw new Error('크리에이터를 찾을 수 없습니다.');
  }
  
  const creator = mockPendingCreators[creatorIndex];
  creator.isVerified = true;
  creator.platforms.forEach(platform => {
    platform.isActive = true;
  });
  
  // 승인된 크리에이터를 메인 목록으로 이동
  mockCreators.push(creator);
  mockPendingCreators.splice(creatorIndex, 1);
  
  return { success: true };
};

export const mockRejectCreator = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const creatorIndex = mockPendingCreators.findIndex(c => c.id === id);
  if (creatorIndex === -1) {
    throw new Error('크리에이터를 찾을 수 없습니다.');
  }
  
  // 거절된 크리에이터 제거
  mockPendingCreators.splice(creatorIndex, 1);
  
  return { success: true };
};

export const mockUpdateUser = async (id: string, updates: Partial<User>) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const userIndex = mockAdminUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  mockAdminUsers[userIndex] = {
    ...mockAdminUsers[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockAdminUsers[userIndex];
};

export const mockDeleteUser = async (id: string) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const userIndex = mockAdminUsers.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  mockAdminUsers.splice(userIndex, 1);
  return { success: true };
};
