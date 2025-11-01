'use client';

import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { initializeAuth, clearUser, fetchUserProfile, logoutUser } from '@/store/slices/authSlice';
import type { UserProfile } from '@/types';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isLoggedIn: boolean;
  isInitialized: boolean;
  error: string | null;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider
 *
 * Redux store의 인증 상태를 Context API를 통해 제공합니다.
 * - 초기 인증 상태 확인 (RefreshToken 기반)
 * - 토큰 이벤트 리스닝
 * - 로그아웃/사용자 정보 새로고침 함수 제공
 */
export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error, isInitialized } = useAppSelector(
    (state) => state.auth
  );
  const initializeRef = useRef(false);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkInitialAuth = async (): Promise<void> => {
      // StrictMode 대응: 이미 초기화되었으면 스킵
      if (isInitialized || initializeRef.current) {
        return;
      }

      initializeRef.current = true;

      try {
        // RefreshToken으로 AccessToken + 사용자 정보 한 번에 조회
        await dispatch(initializeAuth()).unwrap();
      } catch (_error) {
        // 인증되지 않은 사용자 (정상 동작)
      } finally {
        initializeRef.current = false;
      }
    };

    // TokenManager 이벤트 리스너 설정
    const handleTokenCleared = (): void => {
        dispatch(clearUser());
    };

    // const handleTokenUpdated = (event: CustomEvent): void => {
    //   // 새 토큰이 설정되면 사용자 정보 갱신
    //   if (event.detail?.accessToken && !user) {
    //     dispatch(fetchUserProfile());
    //   }
    // };

    window.addEventListener('tokenCleared', handleTokenCleared);
    // window.addEventListener('tokenUpdated', handleTokenUpdated as EventListener);

    checkInitialAuth();

    return (): void => {
      window.removeEventListener('tokenCleared', handleTokenCleared);
      // window.removeEventListener('tokenUpdated', handleTokenUpdated as EventListener);
    };
  }, [dispatch, isInitialized]);

  const logout = async (): Promise<void> => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (_error) {
      // 로그아웃 실패 시에도 클라이언트 상태는 클리어
      dispatch(clearUser());
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      await dispatch(fetchUserProfile()).unwrap();
    } catch (_error) {
      // 사용자 정보 새로고침 실패
    }
  };

  const value: AuthContextType = {
    user,
    loading: isLoading,
    isLoggedIn: isAuthenticated,
    isInitialized,
    error,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook (Context 버전)
 *
 * AuthContext를 사용하여 인증 상태를 조회합니다.
 *
 * @example
 * const { user, isLoggedIn, logout } = useAuth();
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
