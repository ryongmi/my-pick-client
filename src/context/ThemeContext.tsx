'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider
 *
 * 애플리케이션의 테마를 관리합니다.
 * - Light, Dark, System 테마 지원
 * - LocalStorage에 사용자 설정 저장
 * - 시스템 테마 변경 자동 감지
 * - HTML 클래스 및 meta 태그 자동 업데이트
 */
export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const [theme, setThemeState] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 시스템 테마 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateSystemTheme = (e: MediaQueryList | MediaQueryListEvent): void => {
      if (theme === 'system') {
        setActualTheme(e.matches ? 'dark' : 'light');
      }
    };

    // 초기 시스템 테마 설정
    updateSystemTheme(mediaQuery);

    // 시스템 테마 변경 감지
    mediaQuery.addEventListener('change', updateSystemTheme);
    return (): void => mediaQuery.removeEventListener('change', updateSystemTheme);
  }, [theme]);

  // LocalStorage에서 테마 로드 (초기 마운트 시)
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setThemeState(savedTheme);

      // savedTheme에 따라 actualTheme 설정
      if (savedTheme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setActualTheme(isDark ? 'dark' : 'light');
      } else {
        setActualTheme(savedTheme);
      }
    }
  }, []);

  // HTML 클래스 및 meta 태그 업데이트
  useEffect(() => {
    const root = document.documentElement;

    // Dark 클래스 관리 (Tailwind CSS dark: prefix 사용)
    if (actualTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // 메타 태그 업데이트 (모바일 브라우저 테마 색상)
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    metaThemeColor.setAttribute(
      'content',
      actualTheme === 'dark' ? '#1f2937' : '#ffffff'
    );
  }, [actualTheme]);

  const setTheme = (newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);

    // theme이 변경되면 actualTheme 재계산
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setActualTheme(isDark ? 'dark' : 'light');
    } else {
      setActualTheme(newTheme);
    }
  };

  const toggleTheme = (): void => {
    // light ↔ dark 토글 (system은 건너뜀)
    const newTheme = actualTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme Hook
 *
 * ThemeContext를 사용하여 현재 테마 정보와 테마 변경 함수를 제공합니다.
 *
 * @example
 * const { theme, actualTheme, setTheme, toggleTheme } = useTheme();
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
