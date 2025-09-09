import { User } from '@/types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: '김철수',
    email: 'user@example.com',
    avatar: '',
    role: 'user',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '2',
    name: '관리자',
    email: 'admin@example.com',
    avatar: '',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
  {
    id: '3',
    name: '프리미엄 사용자',
    email: 'premium@example.com',
    avatar: '',
    role: 'premium',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-03-15T00:00:00Z',
  },
];

export const mockAuthTokens = {
  user: 'mock-user-token-12345',
  admin: 'mock-admin-token-67890',
  premium: 'mock-premium-token-abcde',
};

// 로그인 시뮬레이션
export const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // 2초 딜레이 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = mockUsers.find(u => u.email === email);
  
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  if (password !== 'password123') {
    throw new Error('비밀번호가 올바르지 않습니다.');
  }
  
  const token = mockAuthTokens[user.role] || mockAuthTokens.user;
  
  return {
    user,
    token,
  };
};

// 회원가입 시뮬레이션
export const mockRegister = async (name: string, email: string, _password: string): Promise<{ user: User; token: string }> => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // 이메일 중복 체크
  const existingUser = mockUsers.find(u => u.email === email);
  if (existingUser) {
    throw new Error('이미 등록된 이메일입니다.');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    name,
    email,
    avatar: '',
    role: 'user',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockUsers.push(newUser);
  
  return {
    user: newUser,
    token: mockAuthTokens.user,
  };
};

// 프로필 업데이트 시뮬레이션
export const mockUpdateProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  if (userIndex === -1) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  
  const updatedUser: User = {
    ...mockUsers[userIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  } as User;
  mockUsers[userIndex] = updatedUser;
  
  return mockUsers[userIndex];
};
