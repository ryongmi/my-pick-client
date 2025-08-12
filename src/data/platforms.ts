// Platform configuration data
import { PlatformConfig } from '@/types/platform';

export const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    displayName: 'YouTube',
    icon: 'Youtube',
    color: 'text-red-600',
    bgColor: 'bg-red-600',
    isEnabled: true,
    isDefault: true,
    order: 1,
    description: '비디오 콘텐츠 플랫폼',
  },
  {
    id: 'twitter',
    name: 'Twitter',
    displayName: 'Twitter',
    icon: 'Twitter',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    isEnabled: true,
    isDefault: true,
    order: 2,
    description: '소셜 미디어 플랫폼',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    displayName: 'Instagram',
    icon: 'Instagram',
    color: 'text-pink-500',
    bgColor: 'bg-pink-500',
    isEnabled: false,
    isDefault: false,
    order: 3,
    description: '사진/비디오 공유 플랫폼',
  },
];

export const DEFAULT_USER_PLATFORM_SETTINGS = {
  selectedPlatform: 'all',
};

export const getEnabledPlatforms = () => {
  return DEFAULT_PLATFORMS.filter(platform => platform.isEnabled);
};

export const sortPlatformsByOrder = (platforms: PlatformConfig[]) => {
  return [...platforms].sort((a, b) => a.order - b.order);
};

export const PLATFORMS = DEFAULT_PLATFORMS;