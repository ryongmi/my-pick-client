import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';

// 타입이 지정된 hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 특정 slice 상태를 가져오는 커스텀 hooks
export const useAuth = () => useAppSelector((state) => state.auth);
export const useUI = () => useAppSelector((state) => state.ui);
export const useCreator = () => useAppSelector((state) => state.creator);
export const useContent = () => useAppSelector((state) => state.content);
export const useNotification = () => useAppSelector((state) => state.notification);
export const useAdmin = () => useAppSelector((state) => state.admin);

// 특정 데이터만 가져오는 셀렉터 hooks
export const useUser = () => useAppSelector((state) => state.auth.user);
export const useIsAuthenticated = () => useAppSelector((state) => state.auth.isAuthenticated);
export const useIsLoading = () => useAppSelector((state) => state.auth.isLoading);

export const useSidebarOpen = () => useAppSelector((state) => state.ui.sidebarOpen);
export const useCurrentView = () => useAppSelector((state) => state.ui.currentView);
export const useTheme = () => useAppSelector((state) => state.ui.theme);
export const useFilters = () => useAppSelector((state) => state.ui.filters);

export const useFollowedCreators = () => useAppSelector((state) => state.creator.followedCreators);
export const useSelectedCreator = () => useAppSelector((state) => state.creator.selectedCreator);

export const useContents = () => useAppSelector((state) => state.content.contents);
export const useContentFilters = () => useAppSelector((state) => state.content.filters);

export const useUnreadCount = () => useAppSelector((state) => state.notification.unreadCount);
export const useNotifications = () => useAppSelector((state) => state.notification.notifications);

export const useDashboardStats = () => useAppSelector((state) => state.admin.dashboardStats);
export const useAdminUsers = () => useAppSelector((state) => state.admin.users);
