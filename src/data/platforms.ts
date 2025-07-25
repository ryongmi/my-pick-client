import { PlatformConfig } from '@/types/platform';

// 기본 플랫폼 설정 데이터
export const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'youtube',
    displayName: 'YouTube',
    icon: 'Youtube',
    color: 'text-red-600',
    bgColor: 'bg-red-600',
    isEnabled: true,
    isDefault: true,
    order: 1,
    description: '세계 최대 동영상 플랫폼',
  },
  {
    id: 'twitter',
    name: 'twitter',
    displayName: 'Twitter',
    icon: 'Twitter',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400',
    isEnabled: true,
    isDefault: true,
    order: 2,
    description: '실시간 소셜 미디어 플랫폼',
  },
  {
    id: 'instagram',
    name: 'instagram',
    displayName: 'Instagram',
    icon: 'Instagram',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500',
    isEnabled: false,
    isDefault: false,
    order: 3,
    description: '사진 및 스토리 공유 플랫폼',
  },
  {
    id: 'tiktok',
    name: 'tiktok',
    displayName: 'TikTok',
    icon: 'Music',
    color: 'text-black',
    bgColor: 'bg-black',
    isEnabled: false,
    isDefault: false,
    order: 4,
    description: '숏폼 비디오 플랫폼',
  },
  {
    id: 'twitch',
    name: 'twitch',
    displayName: 'Twitch',
    icon: 'Tv',
    color: 'text-purple-600',
    bgColor: 'bg-purple-600',
    isEnabled: false,
    isDefault: false,
    order: 5,
    description: '라이브 스트리밍 플랫폼',
  },
];

// 기본 사용자 플랫폼 설정
export const DEFAULT_USER_PLATFORM_SETTINGS = {
  enabledPlatforms: ['youtube', 'twitter'],
  selectedPlatform: 'all',
};

// 플랫폼 아이콘 매핑 (동적 import를 위한)
export const PLATFORM_ICON_MAP = {
  youtube: 'Youtube',
  twitter: 'Twitter', 
  instagram: 'Instagram',
  tiktok: 'Music',
  twitch: 'Tv',
} as const;

// 플랫폼별 색상 설정
export const PLATFORM_COLORS = {
  youtube: {
    text: 'text-red-600',
    bg: 'bg-red-600',
    border: 'border-red-600',
    hover: 'hover:bg-red-50',
  },
  twitter: {
    text: 'text-blue-400',
    bg: 'bg-blue-400', 
    border: 'border-blue-400',
    hover: 'hover:bg-blue-50',
  },
  instagram: {
    text: 'text-pink-500',
    bg: 'bg-pink-500',
    border: 'border-pink-500',
    hover: 'hover:bg-pink-50',
  },
  tiktok: {
    text: 'text-black',
    bg: 'bg-black',
    border: 'border-black',
    hover: 'hover:bg-gray-50',
  },
  twitch: {
    text: 'text-purple-600',
    bg: 'bg-purple-600',
    border: 'border-purple-600',
    hover: 'hover:bg-purple-50',
  },
} as const;

// 플랫폼 ID로 설정 가져오기
export const getPlatformConfig = (platformId: string): PlatformConfig | undefined => {
  return DEFAULT_PLATFORMS.find(platform => platform.id === platformId);
};

// 활성화된 플랫폼만 가져오기
export const getEnabledPlatforms = (): PlatformConfig[] => {
  return DEFAULT_PLATFORMS.filter(platform => platform.isEnabled);
};

// 기본 플랫폼만 가져오기  
export const getDefaultPlatforms = (): PlatformConfig[] => {
  return DEFAULT_PLATFORMS.filter(platform => platform.isDefault);
};

// 플랫폼 순서대로 정렬
export const sortPlatformsByOrder = (platforms: PlatformConfig[]): PlatformConfig[] => {
  return [...platforms].sort((a, b) => a.order - b.order);
};

// 플랫폼 유효성 검사
export const isValidPlatform = (platformId: string): boolean => {
  return DEFAULT_PLATFORMS.some(platform => platform.id === platformId);
};