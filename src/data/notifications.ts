import { Notification } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: 'Ado가 새 영상을 업로드했습니다',
    message: '【歌ってみた】새로운 커버곡',
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10분 전
    actionUrl: '/content/1',
  },
  {
    id: '2',
    type: 'success',
    title: '새 크리에이터가 추가되었습니다',
    message: '葛葉를 팔로우 목록에 추가했습니다',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1시간 전
  },
  {
    id: '3',
    type: 'info',
    title: '히카킨이 새 트윗을 올렸습니다',
    message: '오늘도 촬영 열심히 했습니다!',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3시간 전
    actionUrl: '/content/7',
  },
  {
    id: '4',
    type: 'warning',
    title: '주간 다이제스트',
    message: '이번 주에 놓친 콘텐츠 5개가 있습니다',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
  },
  {
    id: '5',
    type: 'info',
    title: 'Ado가 새 MV를 공개했습니다',
    message: '【MV】새로운 오리지널 곡 "夜想曲"',
    isRead: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
    actionUrl: '/content/2',
  },
];

export const mockGetNotifications = async (page = 1, limit = 20): Promise<{ data: Notification[]; pagination: { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean } }> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedNotifications = mockNotifications.slice(startIndex, endIndex);
  
  return {
    data: paginatedNotifications,
    pagination: {
      page,
      limit,
      total: mockNotifications.length,
      totalPages: Math.ceil(mockNotifications.length / limit),
      hasNext: endIndex < mockNotifications.length,
      hasPrev: page > 1,
    },
  };
};

export const mockGetUnreadCount = async (): Promise<{ count: number }> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;
  return { count: unreadCount };
};

export const mockMarkAsRead = async (id: string): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const notification = mockNotifications.find(n => n.id === id);
  if (!notification) {
    throw new Error('알림을 찾을 수 없습니다.');
  }
  
  notification.isRead = true;
  return { success: true };
};

export const mockMarkAllAsRead = async (): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  mockNotifications.forEach(notification => {
    notification.isRead = true;
  });
  
  return { success: true };
};

export const mockUpdateNotificationSettings = async (_settings: unknown): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // 설정 저장 시뮬레이션
  return { success: true };
};
