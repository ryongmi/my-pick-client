import { useAuthContext } from '@/context/AuthContext';
import type { User } from '@/types';

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  isLoading: boolean; // 별칭
  isLoggedIn: boolean;
  isAuthenticated: boolean;
  error: string | null;
  isInitialized: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

/**
 * 인증 상태 관리 훅
 *
 * AuthContext를 사용하여 인증 상태를 조회합니다.
 * Redux store의 추가 정보(isInitialized)도 함께 제공합니다.
 *
 * @example
 * const { user, isAuthenticated, logout } = useAuth();
 */
export function useAuth(): UseAuthReturn {
  // AuthContext에서 기본 인증 정보 가져오기 (isInitialized 포함)
  const { user, loading, isLoggedIn, isInitialized, error, logout, refreshUser } = useAuthContext();

  return {
    user,
    loading,
    isLoading: loading,
    isLoggedIn,
    isAuthenticated: isLoggedIn,
    error,
    isInitialized,
    logout,
    refreshUser,
  };
}
