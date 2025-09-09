import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PlatformConfig, PlatformState } from '@/types/platform';
import { 
  DEFAULT_PLATFORMS, 
  DEFAULT_USER_PLATFORM_SETTINGS,
  getEnabledPlatforms,
  sortPlatformsByOrder 
} from '@/data/platforms';

const initialState: PlatformState = {
  availablePlatforms: DEFAULT_PLATFORMS,
  enabledPlatforms: getEnabledPlatforms(),
  selectedPlatform: DEFAULT_USER_PLATFORM_SETTINGS.selectedPlatform,
  isLoading: false,
  error: null,
};

const platformSlice = createSlice({
  name: 'platform',
  initialState,
  reducers: {
    // 플랫폼 선택
    setSelectedPlatform: (state, action: PayloadAction<string>) => {
      state.selectedPlatform = action.payload;
      state.error = null;
    },

    // 플랫폼 활성화/비활성화
    setPlatformEnabled: (state, action: PayloadAction<{ platformId: string; enabled: boolean }>) => {
      const { platformId, enabled } = action.payload;
      
      // availablePlatforms에서 플랫폼 찾아서 업데이트
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
      if (platformIndex !== -1) {
        const platform = state.availablePlatforms[platformIndex];
        if (platform) {
          platform.isEnabled = enabled;
        }
        
        // enabledPlatforms 재계산
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
        
        // 비활성화된 플랫폼이 현재 선택된 플랫폼이면 'all'로 변경
        if (!enabled && state.selectedPlatform === platformId) {
          state.selectedPlatform = 'all';
        }
      }
      state.error = null;
    },

    // 여러 플랫폼 활성화/비활성화
    setPlatformsEnabled: (state, action: PayloadAction<{ platformIds: string[]; enabled: boolean }>) => {
      const { platformIds, enabled } = action.payload;
      
      platformIds.forEach(platformId => {
        const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
        if (platformIndex !== -1) {
          const platform = state.availablePlatforms[platformIndex];
          if (platform) {
            platform.isEnabled = enabled;
          }
        }
      });
      
      // enabledPlatforms 재계산
      state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
      
      // 현재 선택된 플랫폼이 비활성화되었으면 'all'로 변경
      if (!enabled && platformIds.includes(state.selectedPlatform)) {
        state.selectedPlatform = 'all';
      }
      
      state.error = null;
    },

    // 플랫폼 순서 업데이트
    updatePlatformOrder: (state, action: PayloadAction<{ platformId: string; newOrder: number }>) => {
      const { platformId, newOrder } = action.payload;
      
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
      if (platformIndex !== -1) {
        const platform = state.availablePlatforms[platformIndex];
        if (platform) {
          platform.order = newOrder;
        }
        
        // 순서대로 재정렬
        state.availablePlatforms = sortPlatformsByOrder(state.availablePlatforms);
        state.enabledPlatforms = sortPlatformsByOrder(state.enabledPlatforms);
      }
      state.error = null;
    },

    // 플랫폼 설정 리셋 (기본값으로 복원)
    resetPlatformSettings: (state) => {
      state.availablePlatforms = DEFAULT_PLATFORMS;
      state.enabledPlatforms = getEnabledPlatforms();
      state.selectedPlatform = DEFAULT_USER_PLATFORM_SETTINGS.selectedPlatform;
      state.error = null;
    },

    // 플랫폼 설정 일괄 업데이트
    updatePlatformSettings: (state, action: PayloadAction<{
      availablePlatforms?: PlatformConfig[];
      selectedPlatform?: string;
    }>) => {
      const { availablePlatforms, selectedPlatform } = action.payload;
      
      if (availablePlatforms) {
        state.availablePlatforms = availablePlatforms;
        state.enabledPlatforms = availablePlatforms.filter(p => p.isEnabled);
      }
      
      if (selectedPlatform !== undefined) {
        state.selectedPlatform = selectedPlatform;
      }
      
      state.error = null;
    },

    // 로딩 상태 관리
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // 에러 상태 관리
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // 에러 클리어
    clearError: (state) => {
      state.error = null;
    },

    // 특정 플랫폼 토글 (활성화 ↔ 비활성화)
    togglePlatform: (state, action: PayloadAction<string>) => {
      const platformId = action.payload;
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
      
      if (platformIndex !== -1) {
        const platform = state.availablePlatforms[platformIndex];
        if (platform) {
          const currentEnabled = platform.isEnabled;
          platform.isEnabled = !currentEnabled;
          
          // 비활성화된 플랫폼이 현재 선택된 플랫폼이면 'all'로 변경
          if (currentEnabled && state.selectedPlatform === platformId) {
            state.selectedPlatform = 'all';
          }
        }
        
        // enabledPlatforms 재계산
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
      }
      state.error = null;
    },

    // 플랫폼 추가
    addPlatform: (state, action: PayloadAction<PlatformConfig>) => {
      const newPlatform = action.payload;
      state.availablePlatforms.push(newPlatform);
      
      // 활성화된 플랫폼이면 enabledPlatforms에도 추가
      if (newPlatform.isEnabled) {
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
      }
      
      // 순서대로 재정렬
      state.availablePlatforms = sortPlatformsByOrder(state.availablePlatforms);
      state.enabledPlatforms = sortPlatformsByOrder(state.enabledPlatforms);
      
      state.error = null;
    },

    // 플랫폼 업데이트
    updatePlatform: (state, action: PayloadAction<PlatformConfig>) => {
      const updatedPlatform = action.payload;
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === updatedPlatform.id);
      
      if (platformIndex !== -1) {
        state.availablePlatforms[platformIndex] = updatedPlatform;
        
        // enabledPlatforms 재계산
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
        
        // 순서대로 재정렬
        state.availablePlatforms = sortPlatformsByOrder(state.availablePlatforms);
        state.enabledPlatforms = sortPlatformsByOrder(state.enabledPlatforms);
        
        // 비활성화된 플랫폼이 현재 선택된 플랫폼이면 'all'로 변경
        if (!updatedPlatform.isEnabled && state.selectedPlatform === updatedPlatform.id) {
          state.selectedPlatform = 'all';
        }
      }
      state.error = null;
    },

    // 플랫폼 삭제
    removePlatform: (state, action: PayloadAction<string>) => {
      const platformId = action.payload;
      
      // availablePlatforms에서 제거
      state.availablePlatforms = state.availablePlatforms.filter(p => p.id !== platformId);
      
      // enabledPlatforms에서도 제거
      state.enabledPlatforms = state.enabledPlatforms.filter(p => p.id !== platformId);
      
      // 삭제된 플랫폼이 현재 선택된 플랫폼이면 'all'로 변경
      if (state.selectedPlatform === platformId) {
        state.selectedPlatform = 'all';
      }
      
      state.error = null;
    },

    // 플랫폼 활성화
    enablePlatform: (state, action: PayloadAction<string>) => {
      const platformId = action.payload;
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
      
      if (platformIndex !== -1) {
        const platform = state.availablePlatforms[platformIndex];
        if (platform) {
          platform.isEnabled = true;
        }
        
        // enabledPlatforms 재계산
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
      }
      state.error = null;
    },

    // 플랫폼 비활성화
    disablePlatform: (state, action: PayloadAction<string>) => {
      const platformId = action.payload;
      const platformIndex = state.availablePlatforms.findIndex(p => p.id === platformId);
      
      if (platformIndex !== -1) {
        const platform = state.availablePlatforms[platformIndex];
        if (platform) {
          platform.isEnabled = false;
        }
        
        // enabledPlatforms 재계산
        state.enabledPlatforms = state.availablePlatforms.filter(p => p.isEnabled);
        
        // 비활성화된 플랫폼이 현재 선택된 플랫폼이면 'all'로 변경
        if (state.selectedPlatform === platformId) {
          state.selectedPlatform = 'all';
        }
      }
      state.error = null;
    },
  },
});

export const {
  setSelectedPlatform,
  setPlatformEnabled,
  setPlatformsEnabled,
  updatePlatformOrder,
  resetPlatformSettings,
  updatePlatformSettings,
  setLoading,
  setError,
  clearError,
  togglePlatform,
  addPlatform,
  updatePlatform,
  removePlatform,
  enablePlatform,
  disablePlatform,
} = platformSlice.actions;

export default platformSlice.reducer;

// 선택자 (Selectors)
export const selectAvailablePlatforms = (state: { platform: PlatformState }): PlatformConfig[] => 
  state.platform.availablePlatforms;

export const selectEnabledPlatforms = (state: { platform: PlatformState }): PlatformConfig[] => 
  state.platform.enabledPlatforms;

export const selectSelectedPlatform = (state: { platform: PlatformState }): string => 
  state.platform.selectedPlatform;

export const selectPlatformById = (state: { platform: PlatformState }, platformId: string): PlatformConfig | undefined => 
  state.platform.availablePlatforms.find(p => p.id === platformId);

export const selectIsPlatformEnabled = (state: { platform: PlatformState }, platformId: string): boolean => 
  state.platform.availablePlatforms.find(p => p.id === platformId)?.isEnabled || false;

export const selectPlatformLoading = (state: { platform: PlatformState }): boolean => 
  state.platform.isLoading;

export const selectPlatformError = (state: { platform: PlatformState }): string | null => 
  state.platform.error;

// 관리자용 셀렉터들
export const selectAllPlatforms = (state: { platform: PlatformState }): PlatformConfig[] => 
  state.platform.availablePlatforms;

export const selectDisabledPlatforms = (state: { platform: PlatformState }): PlatformConfig[] => 
  state.platform.availablePlatforms.filter(p => !p.isEnabled);