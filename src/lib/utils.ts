import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// 날짜 포맷팅
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  if (format === 'relative') {
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) {return '방금 전';}
    if (minutes < 60) {return `${minutes}분 전`;}
    if (hours < 24) {return `${hours}시간 전`;}
    if (days < 7) {return `${days}일 전`;}
    if (days < 30) {return `${Math.floor(days / 7)}주 전`;}
    if (days < 365) {return `${Math.floor(days / 30)}개월 전`;}
    return `${Math.floor(days / 365)}년 전`;
  }

  if (format === 'long') {
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// 숫자 포맷팅
export function formatNumber(num: number | undefined, compact?: boolean): string {
  // undefined나 null 처리
  if (num === undefined || num === null) {
    return '0';
  }

  if (compact) {
    if (num >= 1000000) {
      return Math.floor(num / 1000000) + 'M';
    }
    if (num >= 1000) {
      return Math.floor(num / 1000) + 'K';
    }
    return num.toString();
  }

  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// 지속시간 포맷팅 (초 -> MM:SS 또는 HH:MM:SS)
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// URL 유효성 검사
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// YouTube 동영상 ID 추출
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {return match[1];}
  }
  return null;
}

// X (구 Twitter) 사용자명 추출
export function extractTwitterUsername(url: string): string | null {
  const pattern = /(?:twitter\.com\/|x\.com\/)([a-zA-Z0-9_]+)/;
  const match = url.match(pattern);
  return match && match[1] ? match[1] : null;
}

// 플랫폼별 아이콘 매핑
export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    youtube: '🎥',
    twitter: '✖️', // X (구 Twitter)
    instagram: '📷',
    tiktok: '🎵',
  };
  return icons[platform] || '🌐';
}

// 플랫폼별 색상 매핑
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    youtube: 'bg-red-600',
    twitter: 'bg-black', // X (구 Twitter)
    instagram: 'bg-pink-600',
    tiktok: 'bg-black',
  };
  return colors[platform] || 'bg-gray-600';
}

// 텍스트 생략
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {return text;}
  return text.slice(0, maxLength) + '...';
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  if (bytes === 0) {return '0 Bytes';}
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// 비밀번호 강도 검사
export function getPasswordStrength(password: string): {
  score: number;
  feedback: string;
} {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) {score += 1;}
  else {feedback.push('최소 8자 이상');}

  if (/[a-z]/.test(password)) {score += 1;}
  else {feedback.push('소문자 포함');}

  if (/[A-Z]/.test(password)) {score += 1;}
  else {feedback.push('대문자 포함');}

  if (/\d/.test(password)) {score += 1;}
  else {feedback.push('숫자 포함');}

  if (/[^a-zA-Z\d]/.test(password)) {score += 1;}
  else {feedback.push('특수문자 포함');}

  const strengthText = ['매우 약함', '약함', '보통', '강함', '매우 강함'][score] || '알 수 없음';
  return {
    score,
    feedback: feedback.length > 0 ? feedback.join(', ') : strengthText,
  };
}

// 랜덤 색상 생성
export function generateRandomColor(): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-orange-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)] || 'bg-gray-500';
}

// 이름 이니셜 생성
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// 로컬 스토리지 헬퍼
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') {return defaultValue;}
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') {return;}
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to save to localStorage:', error);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') {return;}
    localStorage.removeItem(key);
  },
};

// 디바운스 함수
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 스로틀 함수
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
