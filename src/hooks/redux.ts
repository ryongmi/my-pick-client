import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 타입이 지정된 hooks
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 특정 slice 상태를 가져오는 커스텀 hooks
// AuthContext를 사용하도록 변경됨
export const useUI = (): RootState['ui'] => useAppSelector((state) => state.ui);
export const useCreator = (): RootState['creator'] => useAppSelector((state) => state.creator);
export const useContent = (): RootState['content'] => useAppSelector((state) => state.content);
export const useNotification = (): RootState['notification'] => useAppSelector((state) => state.notification);
export const useAdmin = (): RootState['admin'] => useAppSelector((state) => state.admin);

// 특정 데이터만 가져오는 셀렉터 hooks
export const useUser = (): RootState['auth']['user'] => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = (): boolean => useAppSelector((state) => state.auth.isAuthenticated);
export const useIsLoading = (): boolean => useAppSelector((state) => state.auth.isLoading);

export const useSidebarOpen = (): boolean => useAppSelector((state) => state.ui.sidebarOpen);
export const useCurrentView = (): RootState['ui']['currentView'] => useAppSelector((state) => state.ui.currentView);
export const useTheme = (): string => useAppSelector((state) => state.ui.theme);
export const useFilters = (): RootState['ui']['filters'] => useAppSelector((state) => state.ui.filters);

export const useFollowedCreators = (): RootState['creator']['followedCreators'] => useAppSelector((state) => state.creator.followedCreators);
export const useSelectedCreator = (): RootState['creator']['selectedCreator'] => useAppSelector((state) => state.creator.selectedCreator);

export const useContents = (): RootState['content']['contents'] => useAppSelector((state) => state.content.contents);
export const useContentFilters = (): RootState['content']['filters'] => useAppSelector((state) => state.content.filters);

export const useUnreadCount = (): number => useAppSelector((state) => state.notification.unreadCount);
export const useNotifications = (): RootState['notification']['notifications'] => useAppSelector((state) => state.notification.notifications);

export const useDashboardStats = (): RootState['admin']['dashboardStats'] => useAppSelector((state) => state.admin.dashboardStats);
export const useAdminUsers = (): RootState['admin']['users'] => useAppSelector((state) => state.admin.users);
