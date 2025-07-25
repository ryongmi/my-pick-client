import { LucideIcon } from 'lucide-react';

// 플랫폼 설정을 위한 새로운 타입 정의
export interface PlatformConfig {
  id: string;
  name: string;
  displayName: string;
  icon: string; // Lucide icon 이름 (예: 'Youtube', 'Twitter')
  color: string; // Tailwind CSS 클래스 (예: 'text-red-600')
  bgColor: string; // Tailwind CSS 클래스 (예: 'bg-red-600')
  isEnabled: boolean;
  isDefault: boolean;
  order: number;
  description?: string;
}

// 사용자별 플랫폼 설정
export interface PlatformSettings {
  availablePlatforms: PlatformConfig[];
  userEnabledPlatforms: string[];
  selectedPlatform: string;
}

// 플랫폼 상태 관리를 위한 Redux 상태 타입
export interface PlatformState {
  availablePlatforms: PlatformConfig[];
  enabledPlatforms: PlatformConfig[];
  selectedPlatform: string;
  isLoading: boolean;
  error: string | null;
}

// 플랫폼 필터 컴포넌트 Props
export interface PlatformTabProps {
  platform: PlatformConfig;
  isSelected: boolean;
  onClick: (platformId: string) => void;
  className?: string;
}

export interface PlatformFilterProps {
  selectedPlatform: string;
  onPlatformChange: (platformId: string) => void;
  className?: string;
}

// 플랫폼 액션 타입들
export type PlatformActionType = 
  | 'SET_ENABLED'
  | 'SET_DISABLED'
  | 'SET_SELECTED'
  | 'UPDATE_ORDER'
  | 'RESET_SETTINGS';

export interface PlatformAction {
  type: PlatformActionType;
  payload: {
    platformId: string;
    value?: any;
  };
}